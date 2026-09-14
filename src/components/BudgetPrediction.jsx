import React, { useState, useEffect } from 'react';

function BudgetPrediction({ transactions = [] }) {
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

  return (
    <div className="budget-prediction">
      <p className="prediction-amount">₹{prediction.toLocaleString('en-IN')}</p>
      <p className="prediction-sub">Total spending across all categories for this period.</p>
      {diningTotal > 0 && (
        <p className="prediction-warning">
          Possible ₹{Math.round(diningTotal * 0.1 / 10) * 10} overspend on dining by week 5.
        </p>
      )}

      {categoryEntries.length > 0 && (
        <div className="budget-breakdown">
          <p className="budget-breakdown-title">Spending by category</p>
          <ul className="budget-breakdown-list">
            {categoryEntries.map((entry) => {
              const category = entry[0];
              const amount = entry[1];
              return (
                <li key={category} className="budget-breakdown-row">
                  <span className="budget-breakdown-name">{category}</span>
                  <span className="budget-breakdown-value">
                    ₹{Math.round(amount).toLocaleString('en-IN')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BudgetPrediction;