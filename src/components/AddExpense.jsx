import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

function AddExpense({ onClose: propOnClose, defaultCategory: propDefaultCategory }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const handleClose = propOnClose || finance.closeAddExpense;
  const initialCategory = propDefaultCategory || finance.addExpenseDefaultCategory || 'Food';

  const [transactionType, setTransactionType] = useState('debit'); // 'debit' = Expense, 'credit' = Income
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialCategory);
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

    // Single source of truth update
    finance.addTransaction({
      merchant: cleanMerchant,   
      amount: finalAmount,
      category: finalCategory,
      date,
    });

    handleClose();
  };

  return (
    <div className="expense-modal-backdrop" onClick={handleClose}>
      <div className="expense-modal" onClick={(event) => event.stopPropagation()}>
        <h3 className="expense-modal-title">
          {transactionType === 'credit' ? t('Add Credit (Income)') : t('Add Debit (Expense)')}
        </h3>

        <form className="expense-form" onSubmit={handleSubmit}>
          {/* Transaction Type Selector */}
          <label className="expense-field">
            <span>{t('Transaction Type')}</span>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              style={{ fontWeight: '600' }}
            >
              <option value="debit">{t('Money debited (Expense)')}</option>
              <option value="credit">{t('Money credited (Income)')}</option>
            </select>
          </label>

          <label className="expense-field">
            <span>{transactionType === 'credit' ? t('Source / Payer') : t('Merchant')}</span>
            <input
              type="text"
              value={merchant}
              onChange={(event) => setMerchant(event.target.value)}
              placeholder={transactionType === 'credit' ? 'e.g. Salary, Freelance' : 'e.g. Swiggy, Uber'}
              required
            />
          </label>

          <label className="expense-field">
            <span>{t('Amount (₹)')}</span>
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
              <span>{t('Category')}</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Groceries', 'Personal', 'Emergency']
                  .map((item) => <option key={item} value={item}>{t(item)}</option>)}
              </select>
            </label>
          )}

          <label className="expense-field">
            <span>{t('Date')}</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>

          <div className="expense-form-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              {t('Cancel')}
            </button>
            <button type="submit" className="btn-primary">
              {transactionType === 'credit' ? t('Add Income') : t('Add Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
