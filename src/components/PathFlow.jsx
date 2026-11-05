import { useEffect, useMemo } from 'react'
import { ReactFlow, ReactFlowProvider, Handle, Position, useReactFlow, useStore, MarkerType } from '@xyflow/react'
import { motion } from 'framer-motion'
import { TREE } from '../data/tree'
import { TESTS, SHORT } from '../data/tests'
import { Icon } from '../lib/icons'
import { cn } from '../lib/utils'

const COLORS = {
  light: { primary: '#5846E8', teal: '#19C9B2', mute: '#9AA3C4' },
  dark: { primary: '#8B7CFF', teal: '#2DD4BF', mute: '#4A5688' },
}

function QNode({ data }) {
  const st = data.status
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0, boxShadow: st === 'current' ? ['0 0 0 0 rgba(120,100,255,.45)', '0 0 0 10px rgba(120,100,255,0)'] : '0 0 0 0 rgba(0,0,0,0)' }}
      transition={{ duration: 0.45, boxShadow: st === 'current' ? { repeat: Infinity, duration: 1.8 } : { duration: 0 } }}
      className={cn(
        'w-[172px] rounded-xl border px-2.5 py-2',
        st === 'current' && 'border-primary bg-soft',
        st === 'result' && 'border-teal bg-teal-soft',
        st === 'done' && 'border-primary/40 bg-card'
      )}
    >
      <Handle type="target" position={Position.Top} className="!size-1.5 !min-h-0 !min-w-0 !border-0 !bg-primary" />
      <div className="flex items-center gap-2">
        <span className={cn('grid size-6 shrink-0 place-items-center rounded-md', st === 'result' ? 'bg-teal text-[#04201C]' : 'bg-soft text-primary')}>
          <Icon name={data.icon} className="size-3.5" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-[9.5px] font-medium uppercase tracking-wide text-muted-foreground">{data.criterion}</div>
          <div className="truncate text-[12.5px] font-semibold text-foreground">{data.answer}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!size-1.5 !min-h-0 !min-w-0 !border-0 !bg-primary" />
      <Handle type="source" id="r" position={Position.Right} className="!size-1.5 !min-h-0 !min-w-0 !border-0 !bg-transparent" />
    </motion.div>
  )
}
function GhostNode({ data }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="w-[98px] rounded-lg border border-dashed border-border bg-card/60 px-2 py-1.5 text-center text-[10.5px] text-muted-foreground">
      <Handle type="target" position={Position.Left} className="!size-1 !min-h-0 !min-w-0 !border-0 !bg-transparent" />
      {data.label}
    </motion.div>
  )
}
const nodeTypes = { q: QNode, ghost: GhostNode }

function build(path, expert, theme) {
  const c = COLORS[theme]
  const nodes = [], edges = []
  const Y = 88
  path.forEach((step, i) => {
    const q = TREE.nodes[step.nodeId]
    const opt = q.options.find((o) => o.id === step.optionId)
    nodes.push({ id: `s${i}`, type: 'q', position: { x: 0, y: i * Y }, data: { criterion: q.criterion, answer: opt.short, icon: q.icon, status: 'done' }, draggable: false })
    if (expert) {
      q.options.filter((o) => o.id !== step.optionId).forEach((o, k) => {
        nodes.push({ id: `g${i}_${k}`, type: 'ghost', position: { x: 194, y: i * Y + 10 + k * 36 }, data: { label: o.short }, draggable: false })
        edges.push({ id: `ge${i}_${k}`, source: `s${i}`, sourceHandle: 'r', target: `g${i}_${k}`, type: 'smoothstep', style: { stroke: c.mute, strokeDasharray: '4 4', strokeWidth: 1.4 } })
      })
    }
  })
  return { nodes, edges, c }
}

function Inner({ path, current, expert, theme, height }) {
  const { fitView } = useReactFlow()
  const boxW = useStore((st) => st.width)
  const boxH = useStore((st) => st.height)
  const { nodes, edges } = useMemo(() => {
    const { nodes, edges, c } = build(path, expert, theme)
    const n = path.length, Y = 88
    const cur = TREE.nodes[current]
    const isLeaf = cur.type === 'leaf'
    nodes.push({
      id: 'cur', type: 'q', position: { x: 0, y: n * Y }, draggable: false,
      data: isLeaf
        ? { criterion: 'Test recommandé', answer: SHORT[cur.test], icon: 'FlaskConical', status: 'result' }
        : { criterion: cur.criterion, answer: 'En cours…', icon: cur.icon, status: 'current' },
    })
    for (let i = 0; i < n; i++) {
      const last = i === n - 1
      const color = last ? c.teal : c.primary
      edges.push({
        id: `e${i}`, source: `s${i}`, target: i === n - 1 ? 'cur' : `s${i + 1}`, type: 'smoothstep', animated: last,
        style: { stroke: color, strokeWidth: 2.4 }, markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      })
    }
    return { nodes, edges }
  }, [path, current, expert, theme])

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.16, duration: 500, maxZoom: 1 }), 80)
    return () => clearTimeout(t)
  }, [nodes.length, expert, fitView, height, boxW, boxH])

  return (
    <ReactFlow
      nodes={nodes} edges={edges} nodeTypes={nodeTypes} colorMode={theme}
      fitView fitViewOptions={{ padding: 0.16, maxZoom: 1 }} minZoom={0.3} maxZoom={1.4}
      nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
      zoomOnScroll={false} preventScrolling={false} panOnDrag
      proOptions={{ hideAttribution: false }}
    />
  )
}

export function PathFlow({ path, current, expert, theme, height = 300 }) {
  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-border bg-muted/40" role="img" aria-label="Schéma du chemin suivi dans l’arbre de décision">
      <ReactFlowProvider>
        <Inner path={path} current={current} expert={expert} theme={theme} height={height} />
      </ReactFlowProvider>
    </div>
  )
}
