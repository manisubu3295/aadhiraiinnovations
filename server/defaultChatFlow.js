import { prisma } from './prismaClient.js'

export const DEFAULT_CHAT_FLOW_NAME = 'Default Menu'

const MEDORA_DOWNLOAD_URL = 'https://aadhiraiinnovations.com/products/medora-offline?download=1'

// Each entry is a node in the flow, keyed by a local id used only while building this graph.
// `next` creates a single outgoing edge (MESSAGE/QUESTION style — "after this, go there").
// `branches` + `defaultNext` are CONDITION-only: they become both `data.conditions`/
// `data.defaultNextNodeId` (what the engine actually reads) and matching edges (so the flow
// looks complete if opened in the visual builder afterward).
const NODE_DEFS = [
  {
    key: 'menuQuestion',
    type: 'QUESTION',
    data: {
      message:
        "Hi! \u{1F44B} Thanks for reaching out to Aadhirai Innovations.\n\nWhat can we help you with today?\n\n1️⃣ Medora Pharmacy Software\n2️⃣ Custom App Development\n3️⃣ Website\n4️⃣ Others\n5️⃣ Talk to Support\n\nReply with a number (1-5).",
      variableName: 'menuChoice',
    },
    next: 'menuRouter',
  },
  {
    key: 'menuRouter',
    type: 'CONDITION',
    branches: [
      { matchType: 'contains', value: '1', nextKey: 'medoraMsg' },
      { matchType: 'contains', value: 'pharmacy', nextKey: 'medoraMsg' },
      { matchType: 'contains', value: '2', nextKey: 'customAppQ1' },
      { matchType: 'contains', value: 'custom', nextKey: 'customAppQ1' },
      { matchType: 'contains', value: '3', nextKey: 'websiteQ1' },
      { matchType: 'contains', value: 'website', nextKey: 'websiteQ1' },
      { matchType: 'contains', value: '4', nextKey: 'othersQ1' },
      { matchType: 'contains', value: 'other', nextKey: 'othersQ1' },
      { matchType: 'contains', value: '5', nextKey: 'supportMsg' },
      { matchType: 'contains', value: 'support', nextKey: 'supportMsg' },
      { matchType: 'contains', value: 'agent', nextKey: 'supportMsg' },
    ],
    defaultNext: 'invalidMsg',
  },
  {
    key: 'invalidMsg',
    type: 'MESSAGE',
    data: { message: "Sorry, I didn't quite get that \u{1F64F}" },
    next: 'menuQuestion',
  },

  // --- Medora Pharmacy branch ---
  {
    key: 'medoraMsg',
    type: 'MESSAGE',
    data: {
      message: `Medora Pharmacy is our all-in-one pharmacy billing & inventory software — GST-ready billing, stock & expiry tracking, works fully offline.\n\n\u{1F4E5} Download it here: ${MEDORA_DOWNLOAD_URL}`,
    },
    next: 'medoraFollowupQ',
  },
  {
    key: 'medoraFollowupQ',
    type: 'QUESTION',
    data: {
      message: "Would you like to speak with our support team about Medora? Reply YES, or just message us anytime if you're all set.",
      variableName: 'medoraFollowup',
    },
    next: 'medoraFollowupRouter',
  },
  {
    key: 'medoraFollowupRouter',
    type: 'CONDITION',
    branches: [{ matchType: 'contains', value: 'yes', nextKey: 'supportMsg' }],
    defaultNext: 'medoraDoneMsg',
  },
  {
    key: 'medoraDoneMsg',
    type: 'MESSAGE',
    data: { message: 'Great! Feel free to message us anytime if you need help. \u{1F64C}' },
    next: 'doneEnd',
  },
  { key: 'doneEnd', type: 'END', data: {} },

  // --- Support / human handoff (shared by menu option 5 and the Medora follow-up "yes") ---
  {
    key: 'supportMsg',
    type: 'MESSAGE',
    data: { message: "Thanks! I've let our team know \u{1F64C} — someone will reply here shortly." },
    next: 'supportEnd',
  },
  { key: 'supportEnd', type: 'END', data: { pauseSession: true } },

  // --- Custom App / Website / Others: identical 4-node lead-capture branches ---
  ...['customApp', 'website', 'others'].flatMap((branch) => {
    const label = { customApp: 'Custom App', website: 'Website', others: 'Others' }[branch]
    return [
      {
        key: `${branch}Q1`,
        type: 'QUESTION',
        data: { message: 'No problem! Could you share your name?', variableName: 'name' },
        next: `${branch}Q2`,
      },
      {
        key: `${branch}Q2`,
        type: 'QUESTION',
        data: {
          message: "Thanks! Briefly, what do you need help with — and feel free to include an email if you'd like us to use that instead.",
          variableName: 'details',
        },
        next: `${branch}LeadMsg`,
      },
      {
        key: `${branch}LeadMsg`,
        type: 'MESSAGE',
        data: { message: 'Got it — thanks! Our team will get back to you shortly. \u{1F64C}' },
        next: `${branch}End`,
      },
      {
        key: `${branch}End`,
        type: 'END',
        data: { createLead: true, pauseSession: true, leadSource: `WhatsApp - ${label}` },
      },
    ]
  }),
]

// Builds the "Default Menu" flow for a user: a numbered-text menu (Medora Pharmacy / Custom App /
// Website / Others / Support), a download-link + optional support hand-off for Medora, and a
// short name+details lead-capture form (feeding server/chatFlowEngine.js's END createLead
// handling) for Custom App/Website/Others. Idempotent by name — see the /default route, which
// only calls this when no such flow exists yet for the user.
export async function createDefaultChatFlow(userId) {
  return prisma.$transaction(async (tx) => {
    // Only one ANY_MESSAGE flow may be active per user (same invariant enforced in
    // routes/chatFlows.js's PUT /:id/active) — deactivate any other one first.
    await tx.chatFlow.updateMany({
      where: { userId, isActive: true, triggerType: 'ANY_MESSAGE' },
      data: { isActive: false },
    })

    const flow = await tx.chatFlow.create({
      data: { userId, name: DEFAULT_CHAT_FLOW_NAME, triggerType: 'ANY_MESSAGE' },
    })

    // Pass 1: create every node (plain data only — CONDITION nodes get a placeholder, patched
    // once every key's real id is known).
    const idMap = new Map()
    let index = 0
    for (const def of NODE_DEFS) {
      const created = await tx.chatFlowNode.create({
        data: {
          flowId: flow.id,
          type: def.type,
          data: def.type === 'CONDITION' ? {} : def.data,
          positionX: (index % 5) * 260,
          positionY: Math.floor(index / 5) * 160,
        },
      })
      idMap.set(def.key, created.id)
      index += 1
    }

    // Pass 2: patch CONDITION nodes' data with real node ids, and create edges.
    for (const def of NODE_DEFS) {
      if (def.type === 'CONDITION') {
        const data = {
          conditions: def.branches.map((b) => ({
            matchType: b.matchType,
            value: b.value,
            nextNodeId: idMap.get(b.nextKey),
          })),
          defaultNextNodeId: idMap.get(def.defaultNext),
        }
        await tx.chatFlowNode.update({ where: { id: idMap.get(def.key) }, data: { data } })

        for (const b of def.branches) {
          await tx.chatFlowEdge.create({
            data: { flowId: flow.id, fromNodeId: idMap.get(def.key), toNodeId: idMap.get(b.nextKey), label: b.value },
          })
        }
        await tx.chatFlowEdge.create({
          data: { flowId: flow.id, fromNodeId: idMap.get(def.key), toNodeId: idMap.get(def.defaultNext), label: 'default' },
        })
      } else if (def.next) {
        await tx.chatFlowEdge.create({
          data: { flowId: flow.id, fromNodeId: idMap.get(def.key), toNodeId: idMap.get(def.next) },
        })
      }
    }

    return tx.chatFlow.update({
      where: { id: flow.id },
      data: { startNodeId: idMap.get('menuQuestion'), isActive: true },
      include: { nodes: true, edges: true },
    })
  })
}
