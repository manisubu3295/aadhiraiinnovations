import express from 'express'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

router.get('/', async (req, res) => {
  const flows = await prisma.chatFlow.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ success: true, flows })
})

router.post('/', async (req, res) => {
  const { name } = req.body ?? {}
  const trimmed = String(name || '').trim()
  if (!trimmed) {
    return res.status(400).json({ success: false, message: 'Flow name is required.' })
  }
  const flow = await prisma.chatFlow.create({ data: { userId: req.user.id, name: trimmed } })
  res.status(201).json({ success: true, flow })
})

router.get('/:id', async (req, res) => {
  const flow = await prisma.chatFlow.findUnique({
    where: { id: req.params.id },
    include: { nodes: true, edges: true },
  })
  if (!flow || flow.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Flow not found.' })
  }
  res.json({ success: true, flow })
})

const TRIGGER_TYPES = ['ANY_MESSAGE', 'KEYWORD']

// Saves the whole graph in one transaction: nodes/edges are replaced wholesale (delete-then-
// recreate) rather than diffed, since flows are small and edited as a unit from the canvas.
// Node IDs in the request body are client-side (the canvas's own IDs, not DB IDs) — they're only
// used to validate structural integrity and to remap CONDITION branch targets/startNodeId to the
// real DB IDs generated during this save.
router.put('/:id', async (req, res) => {
  const flow = await prisma.chatFlow.findUnique({ where: { id: req.params.id } })
  if (!flow || flow.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Flow not found.' })
  }

  const { name, triggerType, triggerKeywords, startNodeId, nodes = [], edges = [] } = req.body ?? {}

  if (!String(name || '').trim()) {
    return res.status(400).json({ success: false, message: 'Flow name is required.' })
  }
  if (!TRIGGER_TYPES.includes(triggerType)) {
    return res.status(400).json({ success: false, message: 'Invalid trigger type.' })
  }

  const clientNodeIds = new Set(nodes.map((n) => n.id))

  for (const edge of edges) {
    if (!clientNodeIds.has(edge.fromNodeId) || !clientNodeIds.has(edge.toNodeId)) {
      return res.status(400).json({ success: false, message: 'A connection references a node that no longer exists.' })
    }
  }

  const outgoingCount = {}
  for (const edge of edges) outgoingCount[edge.fromNodeId] = (outgoingCount[edge.fromNodeId] || 0) + 1
  for (const node of nodes) {
    if ((node.type === 'MESSAGE' || node.type === 'QUESTION') && (outgoingCount[node.id] || 0) > 1) {
      return res.status(400).json({ success: false, message: `A "${node.type}" step can only connect to one next step.` })
    }
    if (node.type === 'CONDITION') {
      for (const c of node.data?.conditions || []) {
        if (c.nextNodeId && !clientNodeIds.has(c.nextNodeId)) {
          return res.status(400).json({ success: false, message: 'A condition branch references a node that no longer exists.' })
        }
      }
      if (node.data?.defaultNextNodeId && !clientNodeIds.has(node.data.defaultNextNodeId)) {
        return res.status(400).json({ success: false, message: "A condition's default branch references a node that no longer exists." })
      }
    }
  }
  if (startNodeId && !clientNodeIds.has(startNodeId)) {
    return res.status(400).json({ success: false, message: 'Start node is invalid.' })
  }

  try {
    const saved = await prisma.$transaction(async (tx) => {
      // Existing node IDs (real DB ids) are preserved on update rather than delete-and-recreate —
      // a ChatFlowSession.currentNodeId can point at one of these mid-conversation (Phase 3), and
      // regenerating every ID on every save would silently orphan any in-progress bot session.
      // Only genuinely new/removed nodes get created/deleted; edges have no such persistent
      // reference from elsewhere, so those are still replaced wholesale.
      const existingNodes = await tx.chatFlowNode.findMany({ where: { flowId: flow.id }, select: { id: true } })
      const existingIds = new Set(existingNodes.map((n) => n.id))
      const submittedIds = new Set(nodes.map((n) => n.id))

      const removedIds = [...existingIds].filter((id) => !submittedIds.has(id))
      if (removedIds.length) {
        await tx.chatFlowNode.deleteMany({ where: { id: { in: removedIds } } })
      }

      const idMap = new Map()
      for (const node of nodes) {
        if (existingIds.has(node.id)) {
          await tx.chatFlowNode.update({
            where: { id: node.id },
            data: { type: node.type, positionX: node.positionX ?? 0, positionY: node.positionY ?? 0 },
          })
          idMap.set(node.id, node.id)
        } else {
          const created = await tx.chatFlowNode.create({
            data: {
              flowId: flow.id,
              type: node.type,
              data: {},
              positionX: node.positionX ?? 0,
              positionY: node.positionY ?? 0,
            },
          })
          idMap.set(node.id, created.id)
        }
      }

      // Write final `data` for every node now that idMap is complete — CONDITION branch targets
      // (which may point at nodes created later in the loop above) can only be remapped once
      // every node's real ID is known.
      for (const node of nodes) {
        let data = node.data || {}
        if (node.type === 'CONDITION') {
          data = {
            ...data,
            conditions: (data.conditions || []).map((c) => ({
              ...c,
              nextNodeId: c.nextNodeId ? idMap.get(c.nextNodeId) : null,
            })),
            defaultNextNodeId: data.defaultNextNodeId ? idMap.get(data.defaultNextNodeId) : null,
          }
        }
        await tx.chatFlowNode.update({ where: { id: idMap.get(node.id) }, data: { data } })
      }

      await tx.chatFlowEdge.deleteMany({ where: { flowId: flow.id } })
      for (const edge of edges) {
        await tx.chatFlowEdge.create({
          data: {
            flowId: flow.id,
            fromNodeId: idMap.get(edge.fromNodeId),
            toNodeId: idMap.get(edge.toNodeId),
            label: edge.label || null,
          },
        })
      }

      return tx.chatFlow.update({
        where: { id: flow.id },
        data: {
          name: String(name).trim(),
          triggerType,
          triggerKeywords: Array.isArray(triggerKeywords) ? triggerKeywords.map(String).filter(Boolean) : [],
          startNodeId: startNodeId ? idMap.get(startNodeId) : null,
        },
      })
    })

    const full = await prisma.chatFlow.findUnique({ where: { id: saved.id }, include: { nodes: true, edges: true } })
    res.json({ success: true, flow: full })
  } catch (error) {
    console.error('Failed to save chat flow:', error)
    res.status(400).json({ success: false, message: error.message || 'Failed to save flow.' })
  }
})

// Enforces "at most one ACTIVE any-message flow per user" so an inbound message never has an
// ambiguous "which flow fires" tie. Keyword flows may coexist (the engine picks the first match
// by createdAt asc — see server/chatFlowEngine.js).
router.put('/:id/active', async (req, res) => {
  const { isActive } = req.body ?? {}
  const flow = await prisma.chatFlow.findUnique({ where: { id: req.params.id } })
  if (!flow || flow.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Flow not found.' })
  }

  if (isActive) {
    if (!flow.startNodeId) {
      return res.status(400).json({ success: false, message: 'Set a start node before activating this flow.' })
    }
    if (flow.triggerType === 'ANY_MESSAGE') {
      const conflicting = await prisma.chatFlow.findFirst({
        where: { userId: req.user.id, isActive: true, triggerType: 'ANY_MESSAGE', id: { not: flow.id } },
      })
      if (conflicting) {
        return res.status(400).json({
          success: false,
          message: `Only one "any message" flow can be active at a time — deactivate "${conflicting.name}" first.`,
        })
      }
    }
  }

  const updated = await prisma.chatFlow.update({ where: { id: flow.id }, data: { isActive: Boolean(isActive) } })
  res.json({ success: true, flow: updated })
})

router.put('/:id/archive', async (req, res) => {
  const flow = await prisma.chatFlow.findUnique({ where: { id: req.params.id } })
  if (!flow || flow.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Flow not found.' })
  }
  const updated = await prisma.chatFlow.update({
    where: { id: flow.id },
    data: { isActive: false, archivedAt: new Date() },
  })
  res.json({ success: true, flow: updated })
})

// Refuses if the flow has any session history (blocked by the ChatFlowSession.flowId onDelete:
// Restrict FK too, but checking first gives a clear message instead of a raw constraint error).
router.delete('/:id', async (req, res) => {
  const flow = await prisma.chatFlow.findUnique({ where: { id: req.params.id } })
  if (!flow || flow.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Flow not found.' })
  }
  const sessionCount = await prisma.chatFlowSession.count({ where: { flowId: flow.id } })
  if (sessionCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'This flow has conversation history and cannot be deleted — archive it instead.',
    })
  }
  await prisma.chatFlow.delete({ where: { id: flow.id } })
  res.json({ success: true })
})

export default router
