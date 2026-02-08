import { useMemo } from 'react';

const statusColors = {
  on_track: '#16a34a',
  at_risk: '#d97706',
  blocked: '#dc2626',
  achieved: '#2563eb',
  failed: '#6b7280',
  abandoned: '#6b7280',
};

function GoalTreeItem({ goal, children, selectedId, onSelect, depth = 0 }) {
  const color = statusColors[goal.status] || '#6b7280';
  const isSelected = goal.id === selectedId;
  const timelineCount = (goal.timeline || []).length;

  return (
    <div className="goal-tree__branch">
      <div
        className={`goal-tree__item ${isSelected ? 'goal-tree__item--selected' : ''}`}
        style={{ paddingLeft: 16 + depth * 24 }}
        onClick={() => onSelect(goal.id)}
      >
        <div className="goal-tree__item-left">
          <span className="goal-tree__indicator" style={{ background: color }} />
          <div className="goal-tree__item-text">
            <div className="goal-tree__item-summary">{goal.summary}</div>
            <div className="goal-tree__item-meta">
              <span className="goal-tree__status-label" style={{ color }}>
                {goal.status?.replace('_', ' ')}
              </span>
              <span className="goal-tree__category">{goal.category}</span>
              <span className="goal-tree__dates">
                {goal.first_seen}
              </span>
              {timelineCount > 1 && (
                <span className="goal-tree__event-count">{timelineCount} events</span>
              )}
            </div>
          </div>
        </div>
        {goal.kpis?.length > 0 && (
          <span className="goal-tree__kpi-badge">{goal.kpis.length} KPI{goal.kpis.length > 1 ? 's' : ''}</span>
        )}
      </div>
      {children.length > 0 && (
        <div className="goal-tree__children">
          {children}
        </div>
      )}
    </div>
  );
}

export default function GoalTree({ goals, selectedId, onSelect }) {
  const { roots, childrenMap } = useMemo(() => {
    const childrenMap = {};
    const roots = [];
    for (const g of goals) {
      if (g.parent_id) {
        if (!childrenMap[g.parent_id]) childrenMap[g.parent_id] = [];
        childrenMap[g.parent_id].push(g);
      } else {
        roots.push(g);
      }
    }
    // Sort roots by first_seen
    roots.sort((a, b) => new Date(a.first_seen) - new Date(b.first_seen));
    // Sort children by first_seen
    for (const key of Object.keys(childrenMap)) {
      childrenMap[key].sort((a, b) => new Date(a.first_seen) - new Date(b.first_seen));
    }
    return { roots, childrenMap };
  }, [goals]);

  function renderTree(goal, depth) {
    const kids = childrenMap[goal.id] || [];
    return (
      <GoalTreeItem
        key={goal.id}
        goal={goal}
        selectedId={selectedId}
        onSelect={onSelect}
        depth={depth}
        children={kids.map((child) => renderTree(child, depth + 1))}
      />
    );
  }

  return (
    <div className="goal-tree">
      <div className="goal-tree__header">
        <h2>Goal Hierarchy</h2>
        <span className="goal-tree__count">{goals.length} goals</span>
      </div>
      <div className="goal-tree__list">
        {roots.map((root) => renderTree(root, 0))}
      </div>
    </div>
  );
}
