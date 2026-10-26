// LatestTransactions.jsx
// This component shows the most recent transactions.
// It receives the transactions list from App.jsx and shows only the first 5.
// Each row shows the merchant name, category, date, and the amount.

import React from 'react';
import Panel from './Panel';
import { useFinance } from '../context/FinanceContext';

function LatestTransactions({ transactions: propTransactions }) {
  const finance = useFinance();
  const transactions = propTransactions || finance.transactions || [];
  // Show only the first 5 transactions.
  // The newest ones are at the top of the list.
  const latestTransactions = transactions.slice(0, 5);

  return (
    <Panel title="Latest transactions" action="Show more">
      <div className="list-container">
        {latestTransactions.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: '#8e8d9a', fontSize: '14px' }}>
            No transactions yet. Click &quot;+ Add Transaction&quot; to start.
          </div>
        ) : (
          latestTransactions.map((transaction) => {
            // Work out if this is income (positive) or an expense (negative).
            const isIncome = transaction.amount > 0;

            // Format the amount with a + or - sign and the rupee symbol.
            let formattedAmount;
            if (isIncome) {
              formattedAmount = '+₹' + transaction.amount;
            } else {
              formattedAmount = '-₹' + Math.abs(transaction.amount);
            }

            // Pick a green class for income and a red class for expenses.
            const amountClass = isIncome ? 'text-success' : 'text-danger';

            return (
              <div key={transaction.id} className="list-row">
                <div className="list-row-info">
                  <p className="list-row-name">{transaction.merchant}</p>
                  <p className="list-row-note">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
                <p className={'list-row-value ' + amountClass}>
                  {formattedAmount}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}

export default LatestTransactions;
