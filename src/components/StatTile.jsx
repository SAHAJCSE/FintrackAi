import React from 'react';

// Colored tile representing a spending category
function StatTile({ label, amount, colorClass }) {
  return (
    <div className={`stat-tile ${colorClass}`}>
      <div className="stat-tile-icon">
        {label.slice(0, 1)}
      </div>
      <p className="stat-tile-amount">{amount}</p>
      <p className="stat-tile-label">{label}</p>
    </div>
  );
}

export default StatTile;
