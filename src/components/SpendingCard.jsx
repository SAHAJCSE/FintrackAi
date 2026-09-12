import React from 'react';

function SpendingCard({
  icon,
  name,
  amount,
  percentage,
  subtext = 'Spent this month',
  colorClass,
}) {
  return (
    <div className={`spending-card ${colorClass}`}>
      {/* Top Row: Icon Container */}
      <div className="card-top-row">
        <div className="card-icon-circle">{icon}</div>
      </div>

      {/* Main Content: Spending Amount & Title */}
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-amount">{amount}</p>
        <p className="card-subtext">{subtext}</p>
      </div>

      {/* Progress Bar */}
      <div className="card-progress-container">
        <div
          className="card-progress-fill"
          style={{ width: `${Math.min(Math.max(percentage || 0, 5), 100)}%` }}
        />
      </div>
    </div>
  );
}

export default SpendingCard;
