import React from 'react';
import { calculateFinancialSummary, formatCurrency } from '../utils/finance';

function FinancialHealth({ transactions = [] }) {
  const summary = calculateFinancialSummary(transactions);

  return (
    <div className="health-page-content">
      <div className="health-hero">
        <div className="health-score">
          <span className="health-score-number">{summary.healthScore}</span>
          <span className="health-score-out-of">/ 100</span>
        </div>
        <p className="health-badge text-success">+8 this month</p>
        <p className="health-note">
          {summary.healthScore >= 75
            ? 'Strong — savings and cash flow look healthy.'
            : summary.healthScore >= 50
            ? 'Moderate — monitor your dining and discretionary expenses.'
            : 'Caution — expenses exceed target budget thresholds.'}
        </p>
      </div>

      <div className="health-progress">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(Math.max(summary.healthScore, 5), 100)}%` }}
          />
        </div>
      </div>

      <div className="health-grid">
        <div className="health-card">
          <p className="health-card-label">Money in</p>
          <p className="health-card-value text-success">
            {formatCurrency(summary.totalIncome, true)}
          </p>
        </div>

        <div className="health-card">
          <p className="health-card-label">Money out</p>
          <p className="health-card-value text-danger">
            {formatCurrency(-summary.totalExpenses, true)}
          </p>
        </div>

        <div className="health-card">
          <p className="health-card-label">Savings rate</p>
          <p className="health-card-value">{summary.savingsRate}%</p>
        </div>

        <div className="health-card">
          <p className="health-card-label">Net Cash Flow</p>
          <p className={`health-card-value ${summary.totalBalance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(summary.totalBalance, true)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FinancialHealth;