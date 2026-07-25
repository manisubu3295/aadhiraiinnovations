import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { api } from '../api'
import Modal from '../components/Modal'

const NODE_TYPES_LIST = ['MESSAGE', 'QUESTION', 'CONDITION', 'END']
const NODE_TYPE_LABELS = { MESSAGE: 'Message', QUESTION: 'Question', CONDITION: 'Condition', END: 'End' }
const NODE_TYPE_COLORS = {
  MESSAGE: 'border-blue-300 bg-blue-50',
  QUESTION: 'border-amber-300 bg-amber-50',
  CONDITION: 'border-purple-300 bg-purple-50',
  END: 'border-slate-300 bg-slate-100',
}

let clientIdCounter = 1
function newClientId() {
  return `new-${Date.now()}-${clientIdCounter++}`
}

function nodePreview(nodeType, config) {
  if (nodeType === 'CONDITION') return `${config?.conditions?.length || 0} branch(es)`
  if (nodeType === 'END') return 'Ends the conversation'
  return config?.message || null
}

function FlowNode({ id, data }) {
  const preview = nodePreview(data.nodeType, data.config)
  return (
    <div
      onClick={() => data.onEdit(id)}
      className={`min-w-[160px] max-w-[220px] cursor-pointer rounded-lg border-2 p-3 shadow-sm ${NODE_TYPE_COLORS[data.nodeType]} ${
        data.isStart ? 'ring-2 ring-[#0B1F3A] ring-offset-1' : ''
      }`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {NODE_TYPE_LABELS[data.nodeType]}
        {data.isStart && ' · Start'}
      </div>
      <div className="mt-1 truncate text-sm text-slate-800">
        {preview || <span className="italic text-slate-400">Click to edit</span>}
      </div>
      {data.nodeType !== 'END' && <Handle type="source" position={Position.Bottom} />}
    </div>
  )
}

const nodeTypes = { flowNode: FlowNode }

function defaultConfigFor(type) {
  if (type === 'MESSAGE') return { message: '' }
  if (type === 'QUESTION') return { message: '', variableName: '' }
  if (type === 'CONDITION') return { conditions: [], defaultNextNodeId: null }
  return {}
}

function toFlowNode(dbNode, startNodeId, onEdit) {
  return {
    id: dbNode.id,
    type: 'flowNode',
    position: { x: dbNode.positionX, y: dbNode.positionY },
    data: { nodeType: dbNode.type, config: dbNode.data, isStart: dbNode.id === startNodeId, onEdit },
  }
}

function NodeEditPanel({ node, allNodes, isStart, onChange, onSetStart, onDelete, onClose }) {
  const { nodeType, config } = node.data
  const otherNodes = allNodes.filter((n) => n.id !== node.id)

  function labelFor(n) {
    return `${NODE_TYPE_LABELS[n.data.nodeType]}${n.data.config?.message ? `: ${n.data.config.message.slice(0, 30)}` : ''}`
  }

  function addCondition() {
    onChange({ ...config, conditions: [...(config.conditions || []), { matchType: 'contains', value: '', nextNodeId: null }] })
  }
  function updateCondition(index, patch) {
    const next = [...(config.conditions || [])]
    next[index] = { ...next[index], ...patch }
    onChange({ ...config, conditions: next })
  }
  function removeCondition(index) {
    onChange({ ...config, conditions: (config.conditions || []).filter((_, i) => i !== index) })
  }

  return (
    <Modal open title={`Edit ${NODE_TYPE_LABELS[nodeType]} step`} onClose={onClose}>
      <div className="space-y-4">
        {nodeType === 'MESSAGE' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Message to send</label>
            <textarea
              rows={3}
              value={config.message || ''}
              onChange={(e) => onChange({ ...config, message: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        )}

        {nodeType === 'QUESTION' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Question to ask</label>
              <textarea
                rows={3}
                value={config.message || ''}
                onChange={(e) => onChange({ ...config, message: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Save the reply as</label>
              <input
                value={config.variableName || ''}
                onChange={(e) => onChange({ ...config, variableName: e.target.value })}
                placeholder="e.g. customerName"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </>
        )}

        {nodeType === 'CONDITION' && (
          <>
            <p className="text-xs text-slate-400">
              Checked in order against the contact's last message. The first match wins; if none match, the default branch is used.
            </p>
            <div className="space-y-2">
              {(config.conditions || []).map((c, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 p-2">
                  <select
                    value={c.matchType}
                    onChange={(e) => updateCondition(i, { matchType: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                  >
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                  </select>
                  <input
                    value={c.value}
                    onChange={(e) => updateCondition(i, { value: e.target.value })}
                    placeholder="text to match"
                    className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs"
                  />
                  <select
                    value={c.nextNodeId || ''}
                    onChange={(e) => updateCondition(i, { nextNodeId: e.target.value || null })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                  >
                    <option value="">Go to…</option>
                    {otherNodes.map((n) => (
                      <option key={n.id} value={n.id}>{labelFor(n)}</option>
                    ))}
                  </select>
                  <button onClick={() => removeCondition(i)} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ))}
              <button onClick={addCondition} className="text-xs font-medium text-[#0B1F3A] hover:underline">+ Add condition</button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Default (no match)</label>
              <select
                value={config.defaultNextNodeId || ''}
                onChange={(e) => onChange({ ...config, defaultNextNodeId: e.target.value || null })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">End the flow</option>
                {otherNodes.map((n) => (
                  <option key={n.id} value={n.id}>{labelFor(n)}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {nodeType === 'END' && <p className="text-sm text-slate-500">This step ends the conversation flow.</p>}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <button
            onClick={onSetStart}
            disabled={isStart}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {isStart ? 'This is the start step' : 'Set as start step'}
          </button>
          <button onClick={onDelete} className="text-xs font-medium text-red-500 hover:underline">Delete step</button>
        </div>
      </div>
    </Modal>
  )
}

export default function ChatFlowBuilderPage() {
  const { id } = useParams()
  const [flowMeta, setFlowMeta] = useState({ name: '', triggerType: 'ANY_MESSAGE', startNodeId: null })
  const [keywordsInput, setKeywordsInput] = useState('')
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [editingNodeId, setEditingNodeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEdit = useCallback((nodeId) => setEditingNodeId(nodeId), [])

  function applyFlow(f) {
    setFlowMeta({ name: f.name, triggerType: f.triggerType, startNodeId: f.startNodeId })
    setKeywordsInput((f.triggerKeywords || []).join(', '))
    setNodes(f.nodes.map((n) => toFlowNode(n, f.startNodeId, handleEdit)))
    setEdges(f.edges.map((e) => ({ id: e.id, source: e.fromNodeId, target: e.toNodeId, label: e.label || undefined })))
  }

  function load() {
    setLoading(true)
    api.get(`/whatsapp/flows/${id}`).then((data) => applyFlow(data.flow)).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  function addNode(type) {
    const newId = newClientId()
    const position = { x: 120 + (nodes.length % 4) * 200, y: 100 + Math.floor(nodes.length / 4) * 140 }
    setNodes((nds) => [
      ...nds,
      { id: newId, type: 'flowNode', position, data: { nodeType: type, config: defaultConfigFor(type), isStart: false, onEdit: handleEdit } },
    ])
  }

  function updateNodeConfig(nodeId, config) {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, config } } : n)))
  }

  function deleteNode(nodeId) {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
    if (flowMeta.startNodeId === nodeId) setFlowMeta((m) => ({ ...m, startNodeId: null }))
    setEditingNodeId(null)
  }

  function setStartNode(nodeId) {
    setFlowMeta((m) => ({ ...m, startNodeId: nodeId }))
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isStart: n.id === nodeId } })))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        name: flowMeta.name,
        triggerType: flowMeta.triggerType,
        triggerKeywords: keywordsInput.split(',').map((k) => k.trim()).filter(Boolean),
        startNodeId: flowMeta.startNodeId,
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.data.nodeType,
          data: n.data.config,
          positionX: n.position.x,
          positionY: n.position.y,
        })),
        edges: edges.map((e) => ({ id: e.id, fromNodeId: e.source, toNodeId: e.target, label: e.label })),
      }
      const data = await api.put(`/whatsapp/flows/${id}`, payload)
      applyFlow(data.flow)
      setSuccess('Flow saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const editingNode = nodes.find((n) => n.id === editingNodeId)

  if (loading) return <div className="text-slate-400">Loading…</div>

  return (
    <div>
      <Link to="/admin/whatsapp/flows" className="text-sm text-[#0B1F3A] hover:underline">← All flows</Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Flow name</label>
            <input
              value={flowMeta.name}
              onChange={(e) => setFlowMeta((m) => ({ ...m, name: e.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Trigger</label>
            <select
              value={flowMeta.triggerType}
              onChange={(e) => setFlowMeta((m) => ({ ...m, triggerType: e.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            >
              <option value="ANY_MESSAGE">Any message</option>
              <option value="KEYWORD">Keyword</option>
            </select>
          </div>
          {flowMeta.triggerType === 'KEYWORD' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Keywords (comma-separated)</label>
              <input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="hours, pricing, hello"
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
              />
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save flow'}
        </button>
      </div>

      {error && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {success && <div className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {NODE_TYPES_LIST.map((t) => (
          <button
            key={t}
            onClick={() => addNode(t)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
          >
            + {NODE_TYPE_LABELS[t]}
          </button>
        ))}
        <span className="ml-2 text-xs text-slate-400">
          Click a step to edit it. Drag from a step's bottom handle to another step's top handle to connect them.
        </span>
      </div>

      <div className="mt-3 h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {editingNode && (
        <NodeEditPanel
          node={editingNode}
          allNodes={nodes}
          isStart={flowMeta.startNodeId === editingNode.id}
          onChange={(config) => updateNodeConfig(editingNode.id, config)}
          onSetStart={() => setStartNode(editingNode.id)}
          onDelete={() => deleteNode(editingNode.id)}
          onClose={() => setEditingNodeId(null)}
        />
      )}
    </div>
  )
}
