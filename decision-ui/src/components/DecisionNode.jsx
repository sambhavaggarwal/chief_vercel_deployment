import { Handle, Position } from '@xyflow/react';

const statusColors = {
  made: '#2563eb',
  pending: '#f59e0b',
  rejected: '#ef4444',
};

export default function DecisionNode({ data }) {
  const { decision, selected } = data;
  const color = statusColors[decision.status] || '#6b7280';

  return (
    <div
      className={`decision-node ${selected ? 'decision-node--selected' : ''}`}
      style={{ borderLeftColor: color }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="decision-node__status" style={{ background: color }}>
        {decision.status}
      </div>
      <div className="decision-node__summary">{decision.summary}</div>
      <div className="decision-node__date">{decision.date}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
