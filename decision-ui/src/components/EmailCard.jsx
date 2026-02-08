import { useState } from 'react';

export default function EmailCard({ email }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="email-card" onClick={() => setExpanded(!expanded)}>
      <div className="email-card__header">
        <span className="email-card__subject">{email.subject}</span>
        <span className="email-card__date">{email.date}</span>
      </div>
      <div className="email-card__meta">
        <span>From: {email.from}</span>
        <span>To: {email.to}</span>
      </div>
      {expanded && (
        <pre className="email-card__body">{email.body}</pre>
      )}
      <div className="email-card__toggle">
        {expanded ? 'Click to collapse' : 'Click to expand'}
      </div>
    </div>
  );
}
