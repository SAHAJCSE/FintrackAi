import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

// Standard transaction categories matching the application
const CATEGORIES = [
  'Food',
  'Rent',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Groceries',
  'Income',
  'Personal',
  'Others',
];

function TransactionsPage() {
  const {
    transactions = [],
    updateTransaction,
    deleteTransaction,
    openAddExpense,
    language,
  } = useFinance();

  const t = (text) => translate(text, language);

  // Search & Date Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Edit Modal State
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editMerchant, setEditMerchant] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('Food');
  const [editDate, setEditDate] = useState('');
  const [editType, setEditType] = useState('expense'); // 'income' or 'expense'

  // Filtered transactions (derived purely from FinanceContext transactions)
  const filteredTransactions = useMemo(() => {
    let list = Array.isArray(transactions) ? [...transactions] : [];

    // Search filter: matching name or merchant
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((tx) =>
        (tx.merchant || '').toLowerCase().includes(q)
      );
    }

    // Date filter: exact date match
    if (selectedDate) {
      list = list.filter((tx) => tx.date === selectedDate);
    }

    return list;
  }, [transactions, searchQuery, selectedDate]);

  // Open Edit Modal with pre-filled transaction data
  const handleOpenEdit = (tx) => {
    const isIncome = Number(tx.amount) > 0;
    setEditingTransaction(tx);
    setEditMerchant(tx.merchant || '');
    setEditAmount(String(Math.abs(Number(tx.amount) || 0)));
    setEditType(isIncome ? 'income' : 'expense');
    setEditCategory(tx.category || (isIncome ? 'Income' : 'Food'));
    setEditDate(tx.date || new Date().toISOString().split('T')[0]);
  };

  const handleCloseEdit = () => {
    setEditingTransaction(null);
  };

  // Save changes to the existing transaction
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTransaction) return;

    const trimmedMerchant = editMerchant.trim();
    if (!trimmedMerchant) {
      alert('Transaction name or merchant is required.');
      return;
    }

    const numericAmount = Number(editAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    // Income is positive, expense is negative
    const finalAmount = editType === 'income' ? Math.abs(numericAmount) : -Math.abs(numericAmount);
    const finalCategory = editType === 'income' && (!editCategory || editCategory === 'Food')
      ? 'Income'
      : editCategory;

    updateTransaction(editingTransaction.id, {
      merchant: trimmedMerchant,
      amount: finalAmount,
      category: finalCategory,
      date: editDate || editingTransaction.date,
    });

    triggerToast(`Updated "${trimmedMerchant}" successfully`);
    handleCloseEdit();
  };

  // Delete transaction with confirmation
  const handleDelete = (tx) => {
    const isIncome = Number(tx.amount) > 0;
    const formattedAmt = `${isIncome ? '+' : '-'}₹${Math.abs(Number(tx.amount) || 0).toLocaleString('en-IN')}`;
    const confirmed = window.confirm(
      `Are you sure you want to delete this transaction?\n\n"${tx.merchant}" (${formattedAmt})`
    );

    if (confirmed) {
      deleteTransaction(tx.id);
      triggerToast(`Deleted "${tx.merchant}"`);
      if (editingTransaction && editingTransaction.id === tx.id) {
        handleCloseEdit();
      }
    }
  };

  const clearDateFilter = () => {
    setSelectedDate('');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDate('');
  };

  return (
    <div className="tx-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="tx-toast-notification">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* 1. Header */}
      <div className="tx-page-header">
        <div>
          <h1 className="tx-page-title">Transactions</h1>
          <p className="tx-page-subtitle">
            All your recorded income and expenses in one place.
          </p>
        </div>
        <button
          type="button"
          className="tx-btn-primary"
          onClick={() => openAddExpense('Food')}
        >
          + Add Transaction
        </button>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="tx-filter-bar">
        {/* Search Box */}
        <div className="tx-search-box">
          <span className="tx-search-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="tx-search-input"
            placeholder="Search by name or merchant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions by name or merchant"
          />
          {searchQuery && (
            <button
              type="button"
              className="tx-input-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Date Picker Box */}
        <div className="tx-date-box">
          <label htmlFor="tx-date-filter" className="tx-date-label">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Date:</span>
          </label>
          <input
            id="tx-date-filter"
            type="date"
            className="tx-date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            aria-label="Filter transactions by date"
          />
          {selectedDate && (
            <button
              type="button"
              className="tx-date-clear-btn"
              onClick={clearDateFilter}
              title="Clear date filter"
            >
              Clear
            </button>
          )}
        </div>

        {/* Clear All Filters button */}
        {(searchQuery || selectedDate) && (
          <button
            type="button"
            className="tx-clear-all-btn"
            onClick={clearAllFilters}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* 3. Transactions Content (Table or Empty State) */}
      {transactions.length === 0 ? (
        /* Empty state: No transactions recorded at all */
        <div className="tx-empty-state">
          <div className="tx-empty-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <line x1="6" y1="15" x2="10" y2="15" />
            </svg>
          </div>
          <h3>No transactions recorded</h3>
          <p>You haven't recorded any transactions yet. Add your income and expenses to start tracking.</p>
          <button
            type="button"
            className="tx-btn-primary"
            onClick={() => openAddExpense('Food')}
          >
            + Add Transaction
          </button>
        </div>
      ) : filteredTransactions.length === 0 ? (
        /* Helpful empty state when search or date returns no matches */
        <div className="tx-empty-state">
          <div className="tx-empty-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3>No matching transactions</h3>
          <p>
            {searchQuery && selectedDate
              ? `No transactions found matching "${searchQuery}" on ${selectedDate}.`
              : searchQuery
              ? `No transactions found matching "${searchQuery}".`
              : `No transactions recorded on ${selectedDate}.`}
          </p>
          <button
            type="button"
            className="tx-btn-secondary"
            onClick={clearAllFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Clean Transactions Table */
        <div className="tx-table-container">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Transaction / Merchant</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const isIncome = Number(tx.amount) > 0;
                const absAmount = Math.abs(Number(tx.amount) || 0).toLocaleString('en-IN');
                const formattedAmount = isIncome ? `+₹${absAmount}` : `-₹${absAmount}`;

                return (
                  <tr key={tx.id} className="tx-row">
                    <td>
                      <div className="tx-merchant-wrap">
                        <span className="tx-merchant-name">{tx.merchant}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="tx-category-badge"
                        style={{
                          background: 'var(--bg-secondary, #161a22)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: 'var(--text-main, #f5f5f7)',
                        }}
                      >
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className="tx-date-cell">{tx.date || '—'}</span>
                    </td>
                    <td>
                      <span className={`tx-type-badge ${isIncome ? 'type-income' : 'type-expense'}`}>
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td>
                      <span className={`tx-amount-cell ${isIncome ? 'amount-income' : 'amount-expense'}`}>
                        {formattedAmount}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="tx-action-btn-group">
                        <button
                          type="button"
                          className="tx-btn-edit"
                          onClick={() => handleOpenEdit(tx)}
                          title={`Edit ${tx.merchant}`}
                          aria-label={`Edit ${tx.merchant}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="tx-btn-delete"
                          onClick={() => handleDelete(tx)}
                          title={`Delete ${tx.merchant}`}
                          aria-label={`Delete ${tx.merchant}`}
                        >
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Edit Transaction Modal */}
      {editingTransaction && (
        <div className="tx-modal-backdrop" onClick={handleCloseEdit}>
          <div className="tx-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="tx-modal-header">
              <h2>Edit Transaction</h2>
              <button
                type="button"
                className="tx-modal-close"
                onClick={handleCloseEdit}
                aria-label="Close edit modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="tx-modal-form">
              {/* Type: Expense vs Income */}
              <div className="tx-form-group">
                <label htmlFor="tx-edit-type">Transaction Type</label>
                <select
                  id="tx-edit-type"
                  className="tx-form-input"
                  value={editType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setEditType(newType);
                    if (newType === 'income' && editCategory === 'Food') {
                      setEditCategory('Income');
                    } else if (newType === 'expense' && editCategory === 'Income') {
                      setEditCategory('Food');
                    }
                  }}
                >
                  <option value="expense">Money debited (Expense)</option>
                  <option value="income">Money credited (Income)</option>
                </select>
              </div>

              {/* Merchant / Source */}
              <div className="tx-form-group">
                <label htmlFor="tx-edit-merchant">
                  {editType === 'income' ? 'Source / Payer *' : 'Merchant / Name *'}
                </label>
                <input
                  id="tx-edit-merchant"
                  type="text"
                  required
                  className="tx-form-input"
                  value={editMerchant}
                  onChange={(e) => setEditMerchant(e.target.value)}
                  placeholder="e.g. Swiggy, Salary, Uber"
                />
              </div>

              {/* Amount & Category row */}
              <div className="tx-form-row">
                <div className="tx-form-group flex-1">
                  <label htmlFor="tx-edit-amount">Amount (₹) *</label>
                  <input
                    id="tx-edit-amount"
                    type="number"
                    min="0.01"
                    step="any"
                    required
                    className="tx-form-input"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="e.g. 850"
                  />
                </div>

                <div className="tx-form-group flex-1">
                  <label htmlFor="tx-edit-cat">Category</label>
                  <select
                    id="tx-edit-cat"
                    className="tx-form-input"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="tx-form-group">
                <label htmlFor="tx-edit-date">Date *</label>
                <input
                  id="tx-edit-date"
                  type="date"
                  required
                  className="tx-form-input"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="tx-modal-footer">
                <button
                  type="button"
                  className="tx-btn-ghost"
                  onClick={handleCloseEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tx-btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;
