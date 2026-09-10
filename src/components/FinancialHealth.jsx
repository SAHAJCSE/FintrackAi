// FinancialHealth.jsx
// This is the full-screen Financial Health page.
// It opens when you click "Read all" on the dashboard
// or click the "Health" button in the sidebar.
// It shows the health score, a progress bar, and summary cards.

import React from 'react';

function FinancialHealth() {
  return (
    <div className="health-page-content">
      <div className="health-hero">
        <div className="health-score">
          <span className="health-score-number">82</span>
          <span className="health-score-out-of">/ 100</span>
        </div>
        <p className="health-badge text-success">+8 this month</p>
        <p className="health-note">Strong — savings and cash flow look healthy.</p>
      </div>

      <div className="health-progress">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: '82%' }}></div>
        </div>
      </div>

      <div className="health-grid">
        <div className="health-card">
          <p className="health-card-label">Money in</p>
          <p className="health-card-value text-success">+₹45,000.00</p>
        </div>

        <div className="health-card">
          <p className="health-card-label">Money out</p>
          <p className="health-card-value text-danger">-₹18,650.00</p>
        </div>

        <div className="health-card">
          <p className="health-card-label">Savings rate</p>
          <p className="health-card-value">58.4%</p>
        </div>

        <div className="health-card">
          <p className="health-card-label">Debt</p>
          <p className="health-card-value">₹0</p>
        </div>
      </div>
    </div>
  );
}

export default FinancialHealth;