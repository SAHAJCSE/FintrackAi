import React, { useState, useEffect, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import { translate } from '../utils/i18n';

function BudgetPrediction({ transactions: propTransactions }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const transactions = propTransactions || finance.transactions || [];
  const budgetUsage = finance.budgetUsage || {};
  const [prediction, setPrediction] = useState(0);

  // Calculates total expense sum so top prediction equals the sum of all category expenses below
  function calculatePrediction(items) {
    let totalSpent = 0;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].amount < 0) {
        totalSpent += Math.abs(items[i].amount);
      }
    }
    return Math.round(totalSpent);
  }

  useEffect(() => {
    const result = calculatePrediction(transactions);
    setPrediction(result);
  }, [transactions]);

  // Aggregate spending by category
  const spendingByCategory = {};
  for (let i = 0; i < transactions.length; i += 1) {
    const transaction = transactions[i];
    if (transaction.amount < 0) {
      const category = transaction.category;
      spendingByCategory[category] = (spendingByCategory[category] || 0) + Math.abs(transaction.amount);
    }
  }

  const categoryEntries = Object.entries(spendingByCategory);
  categoryEntries.sort((a, b) => b[1] - a[1]);

  const diningTotal = spendingByCategory['Food'] || 0;

  // Active category budget warning
  const activeWarning = useMemo(() => {
    const overEntry = Object.entries(budgetUsage).find(([, u]) => u.isOver);
    if (overEntry) {
      const [cat, u] = overEntry;
      return `Alert: ${cat} exceeded monthly budget by ${formatCurrency(u.spent - u.budget)}.`;
    }
    const nearEntry = Object.entries(budgetUsage).find(([, u]) => u.isNearLimit);
    if (nearEntry) {
      const [cat, u] = nearEntry;
      return `Notice: ${cat} is at ${u.percent}% of its monthly budget limit.`;
    }
    if (diningTotal > 2000) {
      return `Possible ₹${Math.round(diningTotal * 0.1 / 10) * 10} overspend on dining by week 5.`;
    }
    return null;
  }, [budgetUsage, diningTotal]);

  return (
    <div className="budget-prediction">
      <p className="prediction-amount">₹{prediction.toLocaleString('en-IN')}</p>
      <p className="prediction-sub">{t('Total spending across all categories for this period.')}</p>
      {activeWarning ? (
        <p className="prediction-warning">
          {activeWarning}
        </p>
      ) : diningTotal > 0 ? (
        <p className="prediction-warning">
          {t('Possible overspend on dining by week 5.').replace('{amount}', `₹${Math.round(diningTotal * 0.1 / 10) * 10}`)}
        </p>
      ) : null}

      {categoryEntries.length > 0 ? (
        <div className="budget-breakdown">
          <p className="budget-breakdown-title">{t('Spending by category')}</p>
          <ul className="budget-breakdown-list">
            {categoryEntries.map((entry) => {
              const category = entry[0];
              const amount = entry[1];
              return (
                <li key={category} className="budget-breakdown-row">
                  <span className="budget-breakdown-name">{t(category)}</span>
                  <span className="budget-breakdown-value">
                    ₹{Math.round(amount).toLocaleString('en-IN')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p style={{ color: '#8e8d9a', fontSize: '13px', marginTop: '12px', fontStyle: 'italic' }}>
          No category expenses recorded yet.
        </p>
      )}
    </div>
  );
}

export default BudgetPrediction;