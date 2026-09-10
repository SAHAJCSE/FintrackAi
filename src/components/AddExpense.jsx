import React, { useState } from 'react';

function AddExpense({ transactions, setTransactions, onClose }) {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMerchant = merchant.trim();

    if (!cleanMerchant) {
      alert('Merchant is required.');
      return;
    }

    const parsedAmount = Number(amount);

    if (parsedAmount <= 0) {
      alert('Amount must be greater than 0.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      merchant: cleanMerchant,
      amount: parsedAmount,
      category,
      date,
    };

    setTransactions([...transactions, newTransaction]);

    setMerchant('');
    setAmount('');
    setCategory('Food');
    setDate('');
    onClose();
  };

  return (
    <div className="expense-modal-backdrop" onClick={onClose}>
      <div className="expense-modal" onClick={(event) => event.stopPropagation()}>
        <h3 className="expense-modal-title">Add Expense</h3>

        <form className="expense-form" onSubmit={handleSubmit}>
          <label className="expense-field">
            <span>Merchant</span>
            <input
              type="text"
              value={merchant}
              onChange={(event) => setMerchant(event.target.value)}
              placeholder="Swiggy"
            />
          </label>

          <label className="expense-field">
            <span>Amount</span>
            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="850"
              min="1"
              step="0.01"
            />
          </label>

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
            </select>
          </label>

          <label className="expense-field">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          <div className="expense-form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
