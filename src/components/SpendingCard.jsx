import React from 'react';

function SpendingCard({
  icon,
  name,
  amount,
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
    </div>
  );
}

export default SpendingCard;
