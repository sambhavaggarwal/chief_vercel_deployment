import EmailCard from './EmailCard';

export default function DetailPanel({ decision, onClose }) {
  if (!decision) return null;

  return (
    <div className="detail-panel">
      <div className="detail-panel__header">
        <h2>{decision.summary}</h2>
        <button className="detail-panel__close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="detail-panel__meta">
        <div>
          <strong>Status:</strong>{' '}
          <span className={`status-badge status-badge--${decision.status}`}>
            {decision.status}
          </span>
        </div>
        <div>
          <strong>Date:</strong> {decision.date}
        </div>
        <div>
          <strong>Actors:</strong>
          <ul className="detail-panel__actors">
            {decision.actors.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        {decision.parent_id && (
          <div>
            <strong>Parent:</strong> {decision.parent_id}
          </div>
        )}
      </div>

      <h3>Associated Emails ({decision.emails.length})</h3>
      <div className="detail-panel__emails">
        {decision.emails.map((email) => (
          <EmailCard key={email.message_id} email={email} />
        ))}
      </div>
    </div>
  );
}
