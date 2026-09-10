// BudgetPrediction.jsx
// This is the dynamic Budget Prediction feature.
// It shows how much you are likely to spend in the next 31 days.
// The number is calculated from your transactions — no AI, no API.
// It updates automatically when you add a new expense.

import React, { useState, useEffect } from 'react';

function BudgetPrediction({ transactions = [] }) {
  // prediction holds the calculated amount shown on screen.
  // It starts at 0 and updates when transactions change.
  const [prediction, setPrediction] = useState(0);

  // This function does the math.
  // It takes the transactions list and returns a predicted number.
  function calculatePrediction(items) {
    // Step 1: add up all the money you spent.
    // We only look at negative amounts because those are expenses.
    let totalSpent = 0;
    for (let i = 0; i < items.length; i = i + 1) {
      if (items[i].amount < 0) {
        totalSpent = totalSpent + Math.abs(items[i].amount);
      }
    }

    // Step 2: count how many expense transactions you have.
    let count = 0;
    for (let i = 0; i < items.length; i = i + 1) {
      if (items[i].amount < 0) {
        count = count + 1;
      }
    }

    // Step 3: if you have no spending history, we cannot predict.
    if (count === 0) {
      return 0;
    }

    // Step 4: work out the average spend per transaction.
    const averagePerTransaction = totalSpent / count;

    // Step 5: assume you will spend about the same each week.
    // Multiply the average by 4 to cover roughly 31 days.
    const estimated = averagePerTransaction * 4;

    // Step 6: round to the nearest 10 for a clean number.
    const rounded = Math.round(estimated / 10) * 10;
    return rounded;
  }

  // This runs every time transactions changes.
  // It recalculates the prediction and updates the screen.
  useEffect(() => {
    const result = calculatePrediction(transactions);
    setPrediction(result);
  }, [transactions]);

  // Work out how much you spent in each category.
  // We use a simple object to store category names and amounts.
  const spendingByCategory = {};
  for (let i = 0; i < transactions.length; i = i + 1) {
    const transaction = transactions[i];
    if (transaction.amount < 0) {
      const category = transaction.category;
      if (spendingByCategory[category] === undefined) {
        spendingByCategory[category] = 0;
      }
      spendingByCategory[category] =
        spendingByCategory[category] + Math.abs(transaction.amount);
    }
  }

  // Turn the object into an array of [category, amount] pairs.
  const categoryEntries = Object.entries(spendingByCategory);

  // Sort the categories so the highest spending is first.
  categoryEntries.sort(function (a, b) {
    return b[1] - a[1];
  });

  // How much did you spend on food?
  // Used for the warning message at the bottom.
  const diningTotal = spendingByCategory['Food'] || 0;

  return (
    <div className="budget-prediction">
      <p className="prediction-amount">₹{prediction.toLocaleString('en-IN')}</p>
      <p className="prediction-sub">Estimated spending for the next 31 days.</p>
      <p className="prediction-warning">
        Possible ₹{Math.round(diningTotal * 0.1 / 10) * 10} overspend on dining by week 5.
      </p>

      {/* Show the per-category breakdown if we have any spending */}
      {categoryEntries.length > 0 && (
        <div className="budget-breakdown">
          <p className="budget-breakdown-title">Spending by category</p>
          <ul className="budget-breakdown-list">
            {categoryEntries.map(function (entry) {
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