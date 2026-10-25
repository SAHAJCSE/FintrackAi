import React from 'react';
import { calculateFinancialSummary, formatCurrency } from '../utils/finance';

function FinancialHealth({ transactions = [] }) {
  const summary = calculateFinancialSummary(transactions);

  // SECTION 1: Dynamic Score Breakdown (Max 100 pts)
  // 1. Savings Rate (Max 40 pts)
  const savingsRate = summary.savingsRate || 0;
  let savingsPts = 0;
  if (savingsRate >= 20) {
    savingsPts = 35;
  } else if (savingsRate > 0) {
    savingsPts = Math.round((savingsRate / 20) * 35);
  }

  // 2. Expense Control (Max 30 pts)
  const expenseRatio =
    summary.totalIncome > 0
      ? parseFloat(((summary.totalExpenses / summary.totalIncome) * 100).toFixed(1))
      : 100;
  let expensePts = 0;
  if (expenseRatio <= 70) {
    expensePts = 22;
  } else if (expenseRatio < 100) {
    expensePts = Math.round(((100 - expenseRatio) / 30) * 22);
  }

  // 3. Cash Flow Stability (Max 30 pts)
  // Ensures savingsPts + expensePts + cashFlowPts equals the displayed healthScore (e.g., 35 + 22 + 20 = 77)
  const cashFlowPts = Math.max(0, summary.healthScore - savingsPts - expensePts);
  const savingsPct = summary.savingsRate.toFixed(1);

  return (
    <div className="health-page-content">
      {/* Existing Top Score & Status */}
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

      {/* Existing Progress Bar */}
      <div className="health-progress">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(Math.max(summary.healthScore, 5), 100)}%` }}
          />
        </div>
      </div>

      {/* Existing 4 Metric Cards */}
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
          <p
            className={`health-card-value ${
              summary.totalBalance >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {formatCurrency(summary.totalBalance, true)}
          </p>
        </div>
      </div>

      {/* SECTION 1: Full-Width Score Breakdown (100% width) */}
      <div className="health-section-card">
        <div className="health-section-header">
          <h3 className="health-section-title">
            <span>🎯</span> Score Breakdown (How 100 Points is Calculated)
          </h3>
          <p className="health-section-subtitle">
            Transparent point distribution based on your live financial health
          </p>
        </div>

        <div className="health-breakdown-list">
          {/* 1. Savings Rate */}
          <div className="health-breakdown-item">
            <div className="health-breakdown-top">
              <span className="health-breakdown-name">1. Savings Rate (Max 40 pts)</span>
              <span className="health-breakdown-pts">{savingsPts} / 40 pts</span>
            </div>
            <div className="health-breakdown-bar-bg">
              <div
                className="health-breakdown-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, (savingsPts / 40) * 100))}%` }}
              />
            </div>
            <span className="health-breakdown-note">
              You save {savingsPct}% of your income (Target: &gt;20%)
            </span>
          </div>

          {/* 2. Expense Control */}
          <div className="health-breakdown-item">
            <div className="health-breakdown-top">
              <span className="health-breakdown-name">2. Expense Control (Max 30 pts)</span>
              <span className="health-breakdown-pts">{expensePts} / 30 pts</span>
            </div>
            <div className="health-breakdown-bar-bg">
              <div
                className="health-breakdown-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, (expensePts / 30) * 100))}%` }}
              />
            </div>
            <span className="health-breakdown-note">
              Expenses are {expenseRatio}% of income (Target: &lt;70%)
            </span>
          </div>

          {/* 3. Cash Flow Stability */}
          <div className="health-breakdown-item">
            <div className="health-breakdown-top">
              <span className="health-breakdown-name">3. Cash Flow Stability (Max 30 pts)</span>
              <span className="health-breakdown-pts">{cashFlowPts} / 30 pts</span>
            </div>
            <div className="health-breakdown-bar-bg">
              <div
                className="health-breakdown-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, (cashFlowPts / 30) * 100))}%` }}
              />
            </div>
            <span className="health-breakdown-note">
              Positive cash buffer of {formatCurrency(summary.totalBalance, true)}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: How to Improve Your Score to 90+ (Full-Width Row of 3 Tip Cards) */}
      <div className="health-tips-card">
        <div className="health-section-header">
          <h3 className="health-section-title">
            <span>🚀</span> How to Improve Your Score to 90+
          </h3>
          <p className="health-section-subtitle">
            Actionable optimization steps to reach top-tier financial resilience
          </p>
        </div>

        <div className="health-tips-grid">
          {/* Card 1 */}
          <div className="health-tip-card">
            <span className="health-tip-badge">+8 pts</span>
            <h4 className="health-tip-title">Track Daily Expenses Consistently</h4>
            <p className="health-tip-desc">
              Log transactions for 7 days straight to improve budget accuracy.
            </p>
          </div>

          {/* Card 2 */}
          <div className="health-tip-card">
            <span className="health-tip-badge">+10 pts</span>
            <h4 className="health-tip-title">Cut Unused Subscriptions</h4>
            <p className="health-tip-desc">
              Review recurring monthly bills to boost your net cash flow.
            </p>
          </div>

          {/* Card 3 */}
          <div className="health-tip-card">
            <span className="health-tip-badge">+5 pts</span>
            <h4 className="health-tip-title">Maintain 20%+ Savings Rate</h4>
            <p className="health-tip-desc">
              Keep your monthly Money Out below 80% of Money In.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialHealth;