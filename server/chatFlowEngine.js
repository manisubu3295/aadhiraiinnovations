import { prisma } from './prismaClient.js'
import { sendConversationMessage } from './userWhatsappSettings.js'

const MAX_LOOP_ITERATIONS = 20
const STALE_SESSION_HOURS = 48

function evaluateCondition(matchType, value, body) {
  if (!body || !value) return false
  const haystack = body.toLowerCase()
  const needle = String(value).toLowerCase()
  return matchType === 'equals' ? haystack.trim() === needle.trim() : haystack.includes(needle)
}

// ANY_MESSAGE flows take priority (there can be at most one active per user — enforced in
// server/routes/chatFlows.js). Otherwise the first KEYWORD flow (by createdAt asc) whose
// keywords the message contains — documented, deterministic tie-break, not left implicit.
async function findTriggeredFlow(tx, userId, body) {
  const anyMessageFlow = await tx.chatFlow.findFirst({ where: { userId, isActive: true, triggerType: 'ANY_MESSAGE' } })
  if (anyMessageFlow) return anyMessageFlow
  if (!body) return null

  const keywordFlows = await tx.chatFlow.findMany({
    where: { userId, isActive: true, triggerType: 'KEYWORD' },
    orderBy: { createdAt: 'asc' },
  })
  const lower = body.toLowerCase()
  return keywordFlows.find((f) => (f.triggerKeywords || []).some((k) => lower.includes(k.toLowerCase()))) || null
}

// Advances (or starts) a conversation's chatbot session in response to one inbound message.
// Called fire-and-forget from the webhook handler — must never throw out to the caller.
//
// Concurrency: the whole function runs inside one transaction holding a Postgres advisory lock
// keyed on conversationId, serializing any two invocations for the same conversation (e.g. a
// contact double-texting within the same second). This also means the transaction stays open for
// the duration of any outbound Meta API calls made via sendConversationMessage — an accepted
// tradeoff given this is explicitly single-admin, low-volume traffic; there's no outbox/queue, so
// a process restart mid-chain can lose an in-flight bot reply (a future BullMQ+Redis candidate if
// this ever needs to scale past one user).
export async function advanceFlow(conversationId, inboundMessage) {
  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${conversationId})::bigint)`

        const conversation = await tx.whatsAppConversation.findUnique({ where: { id: conversationId } })
        if (!conversation) return

        let session = await tx.chatFlowSession.findFirst({
          where: { conversationId, status: { in: ['ACTIVE', 'PAUSED'] } },
          orderBy: { startedAt: 'desc' },
        })

        // A human took over this conversation (server/routes/conversations.js pauses the session
        // on a manual reply) — stay silent rather than treating "no ACTIVE session" as license to
        // re-trigger the flow from scratch on the contact's next message.
        if (session?.status === 'PAUSED') return

        // Staleness self-heal — a QUESTION node nobody ever answered shouldn't silently swallow
        // every future unrelated message from this contact forever.
        if (session) {
          const ageMs = Date.now() - new Date(session.updatedAt).getTime()
          if (ageMs > STALE_SESSION_HOURS * 60 * 60 * 1000) {
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { status: 'ABANDONED' } })
            session = null
          }
        }

        let currentNode = null
        let answeringQuestion = false

        if (session) {
          currentNode = session.currentNodeId ? await tx.chatFlowNode.findUnique({ where: { id: session.currentNodeId } }) : null
          if (!currentNode) {
            // The flow was edited and this node no longer exists — nothing sensible to resume.
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { status: 'ABANDONED' } })
            session = null
          } else if (currentNode.type === 'QUESTION') {
            answeringQuestion = true
          }
        }

        if (!session) {
          const flow = await findTriggeredFlow(tx, conversation.userId, inboundMessage.body)
          if (!flow || !flow.startNodeId) return
          currentNode = await tx.chatFlowNode.findUnique({ where: { id: flow.startNodeId } })
          if (!currentNode) return
          session = await tx.chatFlowSession.create({
            data: { conversationId, flowId: flow.id, currentNodeId: currentNode.id, status: 'ACTIVE' },
          })
        }

        if (answeringQuestion) {
          const variableName = currentNode.data?.variableName
          if (variableName) {
            const variables = { ...(session.variables || {}), [variableName]: inboundMessage.body }
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { variables } })
            session.variables = variables
          }
          const edge = await tx.chatFlowEdge.findFirst({ where: { flowId: session.flowId, fromNodeId: currentNode.id } })
          if (!edge) {
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { status: 'COMPLETED' } })
            return
          }
          currentNode = await tx.chatFlowNode.findUnique({ where: { id: edge.toNodeId } })
          if (!currentNode) {
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { status: 'ABANDONED' } })
            return
          }
        }

        let iterations = 0
        while (currentNode && iterations < MAX_LOOP_ITERATIONS) {
          iterations += 1

          if (currentNode.type === 'MESSAGE') {
            // Persist currentNodeId only after the send succeeds, so a crash mid-chain resumes
            // correctly rather than replaying or skipping a step.
            await sendConversationMessage(conversation, currentNode.data?.message || '', { sentByBot: true })
            const edge = await tx.chatFlowEdge.findFirst({ where: { flowId: session.flowId, fromNodeId: currentNode.id } })
            if (!edge) {
              await tx.chatFlowSession.update({ where: { id: session.id }, data: { status: 'COMPLETED' } })
              return
            }
            currentNode = await tx.chatFlowNode.findUnique({ where: { id: edge.toNodeId } })
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { currentNodeId: currentNode?.id || null } })
            continue
          }

          if (currentNode.type === 'CONDITION') {
            const conditions = currentNode.data?.conditions || []
            const match = conditions.find((c) => evaluateCondition(c.matchType, c.value, inboundMessage.body))
            const nextId = match?.nextNodeId || currentNode.data?.defaultNextNodeId
            if (!nextId) {
              await tx.chatFlowSession.update({ where: { id: session.id }, data: { status: 'COMPLETED' } })
              return
            }
            currentNode = await tx.chatFlowNode.findUnique({ where: { id: nextId } })
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { currentNodeId: currentNode?.id || null } })
            continue
          }

          if (currentNode.type === 'QUESTION') {
            await sendConversationMessage(conversation, currentNode.data?.message || '', { sentByBot: true })
            await tx.chatFlowSession.update({ where: { id: session.id }, data: { currentNodeId: currentNode.id } })
            return // wait for the real reply — do not keep looping
          }

          if (currentNode.type === 'END') {
            const endData = currentNode.data || {}
            if (endData.createLead) {
              const variables = session.variables || {}
              const name = String(variables.name || '').trim() || 'WhatsApp contact'
              const details = String(variables.details || '').trim()
              const emailMatch = details.match(/[^\s]+@[^\s]+\.[^\s]+/)
              const lead = await tx.lead.create({
                data: {
                  name,
                  phone: conversation.contactNumber,
                  email: emailMatch ? emailMatch[0] : null,
                  source: endData.leadSource || 'WhatsApp',
                  notes: details || null,
                },
              })
              await tx.whatsAppConversation.update({ where: { id: conversation.id }, data: { leadId: lead.id } })
            }
            await tx.chatFlowSession.update({
              where: { id: session.id },
              data: { status: endData.pauseSession ? 'PAUSED' : 'COMPLETED' },
            })
            return
          }

          break
        }
      },
      { timeout: 20000, maxWait: 5000 },
    )
  } catch (error) {
    console.error('Flow engine error:', error)
  }
}
