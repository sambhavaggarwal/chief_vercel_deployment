import EmailCard from './EmailCard';

const categoryColors = {
  strategic: '#7c3aed',
  financial: '#2563eb',
  operational: '#0891b2',
  regulatory: '#d97706',
  legal: '#dc2626',
};

export default function GoalDetailPanel({ goal, goals, onClose, onNavigate }) {
  if (!goal) return null;

  const color = categoryColors[goal.category] || '#6b7280';
  const parent = goals?.find((g) => g.id === goal.parent_id);
  const children = goals?.filter((g) => g.parent_id === goal.id) || [];
  const emails = goal.emails || [];

  return (
    <div className="detail-panel">
      <div className="detail-panel__header">
        <h2>{goal.summary}</h2>
        <button className="detail-panel__close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="detail-panel__meta">
        <div className="detail-panel__meta-row">
          <strong>Category</strong>
          <span className="goal-category-badge" style={{ background: color, color: '#fff' }}>
            {goal.category}
          </span>
        </div>
        {goal.kpis?.length > 0 && (
          <div className="detail-panel__meta-row detail-panel__meta-row--top">
            <strong>KPIs</strong>
            <ul className="goal-kpi-list">
              {goal.kpis.map((kpi, i) => (
                <li key={i} className="goal-kpi-item">{kpi}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {parent && (
        <div className="detail-panel__links">
          <strong>Parent goal:</strong>
          <button className="detail-panel__link-btn" onClick={() => onNavigate(parent.id)}>
            <span className="detail-panel__link-indicator" style={{ background: categoryColors[parent.category] || '#6b7280' }} />
            {parent.summary}
          </button>
        </div>
      )}

      {children.length > 0 && (
        <div className="detail-panel__links">
          <strong>Sub-goals ({children.length}):</strong>
          {children.map((child) => (
            <button key={child.id} className="detail-panel__link-btn" onClick={() => onNavigate(child.id)}>
              <span className="detail-panel__link-indicator" style={{ background: categoryColors[child.category] || '#6b7280' }} />
              {child.summary}
            </button>
          ))}
        </div>
      )}

      <h3>Associated Emails ({emails.length})</h3>
      <div className="detail-panel__emails">
        {emails.map((email) => (
          <EmailCard key={email.message_id} email={email} />
        ))}
        {emails.length === 0 && (
          <p className="detail-panel__empty">No emails matched to this goal.</p>
        )}
      </div>
    </div>
  );
}
