import React, { useState, useEffect, useMemo } from 'react';
import './NoSpendHeatmap.css';
import { formatCurrency } from '../utils/finance';

// Helper to format Date to YYYY-MM-DD
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format human-friendly date: e.g. "Sunday, October 25, 2026"
function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function NoSpendHeatmap({ transactions = [], onAddExpense }) {
  // Clear any legacy check-in or essential categories storage
  useEffect(() => {
    try {
      localStorage.removeItem('fintrack_nospend_checkins');
      localStorage.removeItem('fintrack_essential_categories');
    } catch (e) {
      // ignore
    }
  }, []);

  // Real local date & year
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatDateKey(today), [today]);
  const currentYear = useMemo(() => today.getFullYear(), [today]);

  // Selected date for inspector & calendar
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Monthly Calendar navigation state
  const [viewYear, setViewYear] = useState(currentYear);
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11

  // Local state for user-logged expenses on calendar (persisted in localStorage)
  const [customTransactions, setCustomTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem('fintrack_user_calendar_txs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading user calendar txs:', e);
    }
    return [];
  });

  // Quick expense form state in Selected Date Inspector
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newMerchant, setNewMerchant] = useState('');
  const [newCategory, setNewCategory] = useState('Food');

  // Filter ONLY real user-created transactions (exclude all pre-loaded sample data)
  const userTransactions = useMemo(() => {
    const fromProps = (Array.isArray(transactions) ? transactions : []).filter(
      (tx) => tx && (tx.userAdded || (typeof tx.id === 'number' && tx.id > 1000000000))
    );
    // Combine with local customTransactions, avoiding duplicates by id
    const seenIds = new Set(fromProps.map((t) => t.id));
    const combined = [...fromProps];
    customTransactions.forEach((tx) => {
      if (!seenIds.has(tx.id)) {
        combined.push(tx);
        seenIds.add(tx.id);
      }
    });
    return combined;
  }, [transactions, customTransactions]);

  // Group user transactions by date
  const txByDate = useMemo(() => {
    const map = {};
    userTransactions.forEach((tx) => {
      if (!tx || !tx.date) return;
      const d = String(tx.date).trim();
      if (!map[d]) {
        map[d] = [];
      }
      map[d].push(tx);
    });
    return map;
  }, [userTransactions]);

  // Compute spend stats & GitHub green shades for each date
  const getDateStats = (dateStr) => {
    const txList = txByDate[dateStr] || [];

    // Filter expenses only (amount < 0)
    let totalSpent = 0;
    let totalIncome = 0;

    txList.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (amt < 0) {
        totalSpent += Math.abs(amt);
      } else if (amt > 0) {
        totalIncome += amt;
      }
    });

    // Rule: ₹0 / No logged expenses: Empty dark square (#161b22)
    if (totalSpent === 0) {
      return {
        dateStr,
        totalSpent: 0,
        totalIncome,
        color: '#161b22',
        borderColor: '#21262d',
        label: totalIncome > 0 ? `Income Logged (${formatCurrency(totalIncome)})` : 'No expenses logged',
        status: 'empty',
        transactions: txList,
      };
    }

    // Rule: ₹1 – ₹500 spent: Light Green (#0e4429)
    if (totalSpent >= 1 && totalSpent <= 500) {
      return {
        dateStr,
        totalSpent,
        totalIncome,
        color: '#0e4429',
        borderColor: '#175a37',
        label: `Spent ${formatCurrency(-totalSpent)} (Light Activity)`,
        status: 'level-1',
        transactions: txList,
      };
    }

    // Rule: ₹501 – ₹2,000 spent: Medium Green (#006d32)
    if (totalSpent >= 501 && totalSpent <= 2000) {
      return {
        dateStr,
        totalSpent,
        totalIncome,
        color: '#006d32',
        borderColor: '#00873e',
        label: `Spent ${formatCurrency(-totalSpent)} (Medium Activity)`,
        status: 'level-2',
        transactions: txList,
      };
    }

    // Rule: ₹2,001 – ₹5,000 spent: Bright Green (#26a641)
    if (totalSpent >= 2001 && totalSpent <= 5000) {
      return {
        dateStr,
        totalSpent,
        totalIncome,
        color: '#26a641',
        borderColor: '#2ec24d',
        label: `Spent ${formatCurrency(-totalSpent)} (High Activity)`,
        status: 'level-3',
        transactions: txList,
      };
    }

    // Rule: > ₹5,000 spent (Heavy spend / Rent / Bills day): Neon Green (#39d353)
    return {
      dateStr,
      totalSpent,
      totalIncome,
      color: '#39d353',
      borderColor: '#46eb62',
      label: `Spent ${formatCurrency(-totalSpent)} (Heavy Spending Day)`,
      status: 'level-4',
      transactions: txList,
    };
  };

  // Handle adding an expense to the selected date
  const handleSaveExpense = (e) => {
    e.preventDefault();
    const val = parseFloat(newAmount);
    if (isNaN(val) || val <= 0) return;

    const newTx = {
      id: Date.now(),
      merchant: newMerchant.trim() || 'Expense',
      amount: -Math.abs(val),
      category: newCategory,
      date: selectedDate,
      userAdded: true,
    };

    // Update local state and persist
    setCustomTransactions((prev) => {
      const next = [newTx, ...prev];
      try {
        localStorage.setItem('fintrack_user_calendar_txs', JSON.stringify(next));
      } catch (err) {
        console.warn('Error saving custom txs:', err);
      }
      return next;
    });

    if (onAddExpense) {
      onAddExpense(newTx);
    }

    setNewAmount('');
    setNewMerchant('');
    setIsAddingExpense(false);
  };

  // 3 Live Real-Life Metrics:
  // 1. Active Logging Days (Total days with at least 1 logged expense)
  // 2. Total Spent This Month (₹)
  // 3. Daily Average Spend (₹)
  const { activeDaysCount, totalSpentMonth, dailyAverage } = useMemo(() => {
    let activeDays = 0;
    let totalAllYear = 0;
    let totalMonth = 0;

    const thisMonthPrefix = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    Object.entries(txByDate).forEach(([dStr, txList]) => {
      let dayExpense = 0;
      txList.forEach((t) => {
        const amt = Number(t.amount) || 0;
        if (amt < 0) dayExpense += Math.abs(amt);
      });

      if (dayExpense > 0) {
        activeDays += 1;
        totalAllYear += dayExpense;

        if (dStr.startsWith(thisMonthPrefix)) {
          totalMonth += dayExpense;
        }
      }
    });

    const avgSpend = activeDays > 0 ? Math.round(totalAllYear / activeDays) : 0;

    return {
      activeDaysCount: activeDays,
      totalSpentMonth: totalMonth,
      dailyAverage: avgSpend,
    };
  }, [txByDate, currentYear, today]);

  // 52-Week Full Calendar Grid for Current Year
  const { weeks, monthHeaders } = useMemo(() => {
    const jan1 = new Date(currentYear, 0, 1);
    const dec31 = new Date(currentYear, 11, 31);

    // Week starts on Sunday
    const startDate = new Date(jan1);
    startDate.setDate(jan1.getDate() - jan1.getDay());

    const endDate = new Date(dec31);
    endDate.setDate(dec31.getDate() + (6 - dec31.getDay()));

    const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const numWeeks = Math.ceil(diffDays / 7);

    const weekList = [];
    for (let w = 0; w < numWeeks; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + (w * 7 + d));
        const inYear = dayDate.getFullYear() === currentYear;
        const dStr = formatDateKey(dayDate);
        days.push({
          date: dayDate,
          dateStr: dStr,
          inYear,
          dayOfWeek: d,
        });
      }
      weekList.push(days);
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const headers = months.map((monthName, idx) => {
      const firstDay = new Date(currentYear, idx, 1);
      const dayDiff = Math.floor((firstDay - startDate) / (1000 * 60 * 60 * 24));
      const weekCol = Math.floor(dayDiff / 7);
      return {
        name: monthName,
        weekCol,
      };
    });

    return {
      weeks: weekList,
      monthHeaders: headers,
    };
  }, [currentYear]);

  // Selected date statistics
  const selectedStats = useMemo(() => {
    return getDateStats(selectedDate);
  }, [selectedDate, txByDate]);

  // Monthly Calendar Navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(currentYear);
    setViewMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  // Build Monthly Calendar cells
  const monthlyCalendarCells = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const daysCount = new Date(viewYear, viewMonth + 1, 0).getDate(); // 28-31

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ empty: true, key: `empty-${i}` });
    }

    for (let day = 1; day <= daysCount; day++) {
      const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const stats = getDateStats(dStr);
      cells.push({
        empty: false,
        key: dStr,
        dayNumber: day,
        dateStr: dStr,
        stats,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedDate,
      });
    }

    return cells;
  }, [viewYear, viewMonth, selectedDate, todayStr, txByDate]);

  const viewMonthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="ns-container">
      {/* Header Card */}
      <div className="ns-header">
        <div className="ns-header-left">
          <h1 className="ns-title">📅 Activity Calendar & Spending Heatmap</h1>
          <p className="ns-subtitle">
            Visual GitHub-style expense tracker. Every day starts clean and dark until you log real expenses.
          </p>
        </div>

        <div className="ns-header-right">
          <button
            type="button"
            className="ns-btn-checkin"
            onClick={() => {
              setSelectedDate(todayStr);
              setIsAddingExpense(true);
            }}
            title="Log an expense for today"
          >
            ➕ Log Expense for Today
          </button>
        </div>
      </div>

      {/* 3 Practical Real-Life Metrics */}
      <div className="ns-stats-grid">
        <div className="ns-stat-card">
          <div className="ns-stat-icon-wrapper ns-stat-icon-streak">📅</div>
          <div className="ns-stat-info">
            <span className="ns-stat-label">Active Logging Days</span>
            <span className="ns-stat-value">
              {activeDaysCount} {activeDaysCount === 1 ? 'Day' : 'Days'}
            </span>
            <span className="ns-stat-subtext">Days with at least 1 expense logged</span>
          </div>
        </div>

        <div className="ns-stat-card">
          <div className="ns-stat-icon-wrapper ns-stat-icon-total">💰</div>
          <div className="ns-stat-info">
            <span className="ns-stat-label">Total Spent This Month</span>
            <span className="ns-stat-value">{formatCurrency(totalSpentMonth)}</span>
            <span className="ns-stat-subtext">Expenses in current month</span>
          </div>
        </div>

        <div className="ns-stat-card">
          <div className="ns-stat-icon-wrapper ns-stat-icon-best">📊</div>
          <div className="ns-stat-info">
            <span className="ns-stat-label">Daily Average Spend</span>
            <span className="ns-stat-value">{formatCurrency(dailyAverage)}</span>
            <span className="ns-stat-subtext">Average per active spending day</span>
          </div>
        </div>
      </div>

      {/* 52-Week Full-Year GitHub / LeetCode Heatmap */}
      <div className="ns-card">
        <div className="ns-card-header">
          <div className="ns-card-title-group">
            <h3 className="ns-card-title">📅 {currentYear} Spending Heatmap (52 Weeks)</h3>
            <p className="ns-card-subtitle">
              Squares are dark by default. Green shades represent daily spend volume. Click any cell to inspect or log an expense.
            </p>
          </div>
        </div>

        <div className="ns-heatmap-wrapper">
          <div className="ns-heatmap-container">
            {/* Month labels across top */}
            <div className="ns-months-row">
              <div /> {/* Spacer for Sun-Sat labels */}
              {monthHeaders.map((m) => (
                <div
                  key={m.name}
                  className="ns-month-item"
                  style={{ gridColumnStart: m.weekCol + 2 }}
                >
                  {m.name}
                </div>
              ))}
            </div>

            {/* Heatmap Grid Body */}
            <div className="ns-heatmap-body">
              {/* Day Labels on the Left (Sun-Sat) */}
              <div className="ns-day-labels">
                <span className="ns-day-label">Sun</span>
                <span className="ns-day-label">Mon</span>
                <span className="ns-day-label">Tue</span>
                <span className="ns-day-label">Wed</span>
                <span className="ns-day-label">Thu</span>
                <span className="ns-day-label">Fri</span>
                <span className="ns-day-label">Sat</span>
              </div>

              {/* 53 Week Columns */}
              {weeks.map((week, wIdx) => (
                <div key={`week-${wIdx}`} className="ns-week-col">
                  {week.map((dayItem, dIdx) => {
                    if (!dayItem.inYear) {
                      return <div key={`ph-${wIdx}-${dIdx}`} className="ns-cell ns-cell-placeholder" />;
                    }

                    const stats = getDateStats(dayItem.dateStr);
                    const isSelected = dayItem.dateStr === selectedDate;
                    const isToday = dayItem.dateStr === todayStr;

                    return (
                      <div
                        key={dayItem.dateStr}
                        className={`ns-cell ${isSelected ? 'ns-cell-selected' : ''} ${
                          isToday ? 'ns-cell-today' : ''
                        }`}
                        style={{
                          backgroundColor: stats.color,
                          borderColor: stats.borderColor,
                        }}
                        onClick={() => setSelectedDate(dayItem.dateStr)}
                        title={`${dayItem.dateStr}: ${stats.label}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="ns-legend-row">
          <span className="ns-legend-note">
            Selected: <strong>{selectedDate}</strong>
          </span>

          <div className="ns-legend-items">
            <div className="ns-legend-item">
              <span className="ns-legend-color" style={{ backgroundColor: '#161b22', borderColor: '#21262d' }} />
              <span>₹0 / No Expenses</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color" style={{ backgroundColor: '#0e4429', borderColor: '#175a37' }} />
              <span>₹1 – ₹500</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color" style={{ backgroundColor: '#006d32', borderColor: '#00873e' }} />
              <span>₹501 – ₹2,000</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color" style={{ backgroundColor: '#26a641', borderColor: '#2ec24d' }} />
              <span>₹2,001 – ₹5,000</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color" style={{ backgroundColor: '#39d353', borderColor: '#46eb62' }} />
              <span>&gt; ₹5,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Monthly Calendar + Selected Date Inspector */}
      <div className="ns-lower-grid">
        {/* Monthly Calendar View */}
        <div className="ns-card">
          <div className="ns-cal-header">
            <h3 className="ns-cal-title">
              <span>🗓️</span> {viewMonthName}
            </h3>

            <div className="ns-cal-nav">
              <button
                type="button"
                className="ns-btn-secondary"
                onClick={handleJumpToToday}
                title="Jump to today"
              >
                Today
              </button>
              <button
                type="button"
                className="ns-cal-nav-btn"
                onClick={handlePrevMonth}
                title="Previous Month"
              >
                ‹
              </button>
              <button
                type="button"
                className="ns-cal-nav-btn"
                onClick={handleNextMonth}
                title="Next Month"
              >
                ›
              </button>
            </div>
          </div>

          <div className="ns-cal-grid">
            <div className="ns-cal-day-header">Sun</div>
            <div className="ns-cal-day-header">Mon</div>
            <div className="ns-cal-day-header">Tue</div>
            <div className="ns-cal-day-header">Wed</div>
            <div className="ns-cal-day-header">Thu</div>
            <div className="ns-cal-day-header">Fri</div>
            <div className="ns-cal-day-header">Sat</div>

            {monthlyCalendarCells.map((cell) => {
              if (cell.empty) {
                return <div key={cell.key} className="ns-cal-cell ns-cal-cell-empty" />;
              }

              const { stats, dayNumber, dateStr, isToday, isSelected } = cell;

              return (
                <div
                  key={cell.key}
                  className={`ns-cal-cell ${isSelected ? 'ns-cal-cell-selected' : ''} ${
                    isToday ? 'ns-cal-cell-today' : ''
                  }`}
                  style={{
                    backgroundColor: stats.status === 'empty' ? '#161b22' : 'rgba(22, 27, 34, 0.9)',
                    borderColor: isSelected ? '#38bdf8' : stats.borderColor,
                  }}
                  onClick={() => setSelectedDate(dateStr)}
                  title={`${dateStr}: ${stats.label}`}
                >
                  <div className="ns-cal-cell-top">
                    <span className="ns-cal-day-num">{dayNumber}</span>
                    {isToday && <span className="ns-cal-today-badge">TODAY</span>}
                  </div>

                  <div className="ns-cal-cell-bottom">
                    <span
                      className="ns-cal-indicator-dot"
                      style={{ backgroundColor: stats.color }}
                    />
                    {stats.totalSpent > 0 && (
                      <span
                        className="ns-cal-spend-tag"
                        style={{
                          backgroundColor: stats.color,
                          color: '#ffffff',
                        }}
                      >
                        ₹{stats.totalSpent.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Inspector Panel */}
        <div className="ns-card ns-inspector">
          <div className="ns-inspector-header">
            <span className="ns-card-subtitle">Selected Date Inspector</span>
            <h3 className="ns-inspector-date">{formatReadableDate(selectedDate)}</h3>

            {/* Status Badge */}
            <div
              className={`ns-inspector-badge ${
                selectedStats.status === 'level-4'
                  ? 'ns-badge-level-4'
                  : selectedStats.status === 'level-3'
                  ? 'ns-badge-level-3'
                  : selectedStats.status === 'level-2'
                  ? 'ns-badge-level-2'
                  : selectedStats.status === 'level-1'
                  ? 'ns-badge-level-1'
                  : 'ns-badge-unlogged'
              }`}
            >
              <span>{selectedStats.totalSpent > 0 ? '🟢' : '⚪'}</span>
              <span>{selectedStats.label}</span>
            </div>
          </div>

          {/* Quick Expense Logging Button / Form */}
          {!isAddingExpense ? (
            <button
              type="button"
              className="ns-inspector-action ns-btn-toggle-on"
              onClick={() => setIsAddingExpense(true)}
            >
              ➕ Log Expense for {selectedDate}
            </button>
          ) : (
            <form onSubmit={handleSaveExpense} className="ns-add-expense-form">
              <span className="ns-form-title">Log Expense on {selectedDate}</span>
              <div className="ns-form-row">
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  className="ns-form-input"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  min="1"
                  step="any"
                  required
                  autoFocus
                />
                <select
                  className="ns-form-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Food">Food</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Health">Health</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Merchant / Note (e.g., Grocery, Cafe, Amazon)"
                className="ns-form-input"
                value={newMerchant}
                onChange={(e) => setNewMerchant(e.target.value)}
              />

              <div className="ns-form-actions">
                <button type="submit" className="ns-btn-submit">
                  Save Expense
                </button>
                <button
                  type="button"
                  className="ns-btn-cancel"
                  onClick={() => setIsAddingExpense(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Breakdown Metrics for Selected Date */}
          <div className="ns-inspector-metrics">
            <div className="ns-metric-box">
              <span className="ns-metric-title">Total Spent</span>
              <span
                className={`ns-metric-value ${
                  selectedStats.totalSpent > 0 ? 'ns-text-danger' : 'ns-text-muted'
                }`}
              >
                {formatCurrency(-selectedStats.totalSpent)}
              </span>
            </div>

            <div className="ns-metric-box">
              <span className="ns-metric-title">Transactions</span>
              <span className="ns-metric-value">{selectedStats.transactions.length}</span>
            </div>
          </div>

          {/* Real Expenses on Selected Date */}
          <div className="ns-tx-section">
            <span className="ns-tx-title">
              Logged Expenses ({selectedStats.transactions.length})
            </span>

            {selectedStats.transactions.length === 0 ? (
              <div className="ns-tx-empty">No transactions recorded on this date.</div>
            ) : (
              <div className="ns-tx-list">
                {selectedStats.transactions.map((tx) => {
                  const amt = Number(tx.amount) || 0;
                  const cat = (tx.category || '').trim();

                  return (
                    <div key={tx.id || Math.random()} className="ns-tx-item">
                      <div className="ns-tx-left">
                        <span className="ns-tx-merchant">{tx.merchant || 'Expense'}</span>
                        <span className="ns-tx-cat-tag">
                          <span>🏷️</span>
                          <span>{cat}</span>
                        </span>
                      </div>

                      <span
                        className={`ns-tx-amount ${amt < 0 ? 'ns-text-danger' : 'ns-text-success'}`}
                      >
                        {formatCurrency(amt, amt > 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoSpendHeatmap;
