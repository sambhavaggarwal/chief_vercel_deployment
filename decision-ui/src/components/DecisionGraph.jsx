import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DecisionNode from './DecisionNode';

const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;
const X_GAP = 60;
const Y_GAP = 40;

const nodeTypes = { decision: DecisionNode };

function buildLayout(decisions, selectedId) {
  // Compute depth for each decision (distance from root)
  const byId = Object.fromEntries(decisions.map((d) => [d.id, d]));
  const depthMap = {};

  function getDepth(id) {
    if (depthMap[id] !== undefined) return depthMap[id];
    const d = byId[id];
    if (!d || !d.parent_id) {
      depthMap[id] = 0;
    } else {
      depthMap[id] = getDepth(d.parent_id) + 1;
    }
    return depthMap[id];
  }

  decisions.forEach((d) => getDepth(d.id));

  // Sort by date to assign x positions
  const sorted = [...decisions].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const minDate = new Date(sorted[0].date).getTime();
  const maxDate = new Date(sorted[sorted.length - 1].date).getTime();
  const dateRange = maxDate - minDate || 1;

  // Canvas width scales with number of decisions
  const canvasWidth = Math.max(1200, sorted.length * (NODE_WIDTH + X_GAP));

  // Group by (date, depth) bucket and spread nodes within each bucket
  const bucketCounters = {};
  const nodes = sorted.map((d) => {
    const t = (new Date(d.date).getTime() - minDate) / dateRange;
    const depth = depthMap[d.id];
    const bucketKey = `${t}-${depth}`;
    const bucketIndex = bucketCounters[bucketKey] || 0;
    bucketCounters[bucketKey] = bucketIndex + 1;

    const x = 50 + t * (canvasWidth - NODE_WIDTH - 100) + bucketIndex * (NODE_WIDTH + X_GAP);
    const y = 50 + depth * (NODE_HEIGHT + Y_GAP);

    return {
      id: d.id,
      type: 'decision',
      position: { x, y },
      data: { decision: d, selected: d.id === selectedId },
    };
  });

  const edges = decisions
    .filter((d) => d.parent_id)
    .map((d) => ({
      id: `e-${d.parent_id}-${d.id}`,
      source: d.parent_id,
      target: d.id,
      type: 'smoothstep',
      animated: d.status === 'pending',
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    }));

  return { nodes, edges };
}

export default function DecisionGraph({ decisions, selectedId, onSelect }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildLayout(decisions, selectedId),
    [decisions, selectedId],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep nodes in sync when selectedId changes
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_event, node) => {
      onSelect(node.id);
    },
    [onSelect],
  );

  return (
    <div className="decision-graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
