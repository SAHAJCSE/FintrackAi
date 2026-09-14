import React, { useState } from 'react';

function AddExpense({ transactions, setTransactions, onClose, defaultCategory }) {
  const [transactionType, setTransactionType] = useState('debit'); // 'debit' = Expense, 'credit' = Income
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMerchant = merchant.trim();

    if (!cleanMerchant) {
      alert('Merchant or source name is required.');
      return;
    }

    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    // Debit = negative amount (Expense), Credit = positive amount (Income)
    const finalAmount = transactionType === 'credit' ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);
    const finalCategory = transactionType === 'credit' ? 'Income' : category;

    const newTransaction = {
      id: Date.now(),
      merchant: cleanMerchant,
      amount: finalAmount,
      category: finalCategory,
      date: date || new Date().toISOString().split('T')[0],
    };

    // Prepend to top of transactions state so it appears immediately in Latest Transactions
    setTransactions([newTransaction, ...transactions]);

    setMerchant('');
    setAmount('');
    setCategory('Food');
    setDate('');
    onClose();
  };

  return (
    <div className="expense-modal-backdrop" onClick={onClose}>
      <div className="expense-modal" onClick={(event) => event.stopPropagation()}>
        <h3 className="expense-modal-title">
          {transactionType === 'credit' ? 'Add Credit (Income)' : 'Add Debit (Expense)'}
        </h3>

        <form className="expense-form" onSubmit={handleSubmit}>
          {/* Transaction Type Selector */}
          <label className="expense-field">
            <span>Transaction Type</span>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              style={{ fontWeight: '600' }}
            >
              <option value="debit">🔴 Money Debited (Expense)</option>
              <option value="credit">🟢 Money Credited (Income)</option>
            </select>
          </label>

          <label className="expense-field">
            <span>{transactionType === 'credit' ? 'Source / Payer' : 'Merchant'}</span>
            <input
              type="text"
              value={merchant}
              onChange={(event) => setMerchant(event.target.value)}
              placeholder={transactionType === 'credit' ? 'e.g. Salary, Freelance' : 'e.g. Swiggy, Uber'}
              required
            />
          </label>

          <label className="expense-field">
            <span>Amount (₹)</span>
            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="e.g. 850"
              min="1"
              step="0.01"
              required
            />
          </label>

          {transactionType === 'debit' && (
            <label className="expense-field">
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Health">Health</option>
                <option value="Groceries">Groceries</option>
                <option value="Personal">Personal</option>
                <option value="Emergency">Emergency</option>
              </select>
            </label>
          )}

          <label className="expense-field">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>

          <div className="expense-form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {transactionType === 'credit' ? 'Add Income' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
