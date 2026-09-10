import React from 'react';
import Panel from './Panel';

// LatestTransactions component displays the recent 5 transactions
// It receives the transactions array via props from App.jsx
function LatestTransactions({ transactions = [] }) {
  // Show only the latest 5 transactions
  const latestTransactions = transactions.slice(0, 5);

  return (
    <Panel title="Latest transactions" action="Show more">
      <div className="list-container">
        {latestTransactions.map((transaction) => {
          // If amount is positive, display it as income (+ and green)
          // If amount is negative, display it as expense (- and red)
          const isIncome = transaction.amount > 0;
          const formattedAmount = isIncome
            ? `+₹${transaction.amount}`
            : `-₹${Math.abs(transaction.amount)}`;
          const amountClass = isIncome ? 'text-success' : 'text-danger';

          return (
            <div key={transaction.id} className="list-row">
              <div className="list-row-info">
                <p className="list-row-name">{transaction.merchant}</p>
                <p className="list-row-note">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
              <p className={`list-row-value ${amountClass}`}>
                {formattedAmount}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export default LatestTransactions;
