import React, { useState, useMemo } from 'react';
import './NoSpendHeatmap.css';
import { formatCurrency } from '../utils/finance';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

// Helper to format Date to YYYY-MM-DD
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format human-friendly date: e.g. "Sunday, October 25, 2026"
function formatReadableDate(dateStr, locale = 'en-US') {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function NoSpendHeatmap({ transactions: propTransactions, onAddExpense: propOnAddExpense }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const dateLocale = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN' }[finance.language] || 'en-IN';
  const weekdayLabels = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
    pa: ['ਐਤ', 'ਸੋਮ', 'ਮੰਗਲ', 'ਬੁੱਧ', 'ਵੀਰ', 'ਸ਼ੁੱਕਰ', 'ਸ਼ਨੀ'],
  }[finance.language] || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const transactions = propTransactions || finance.transactions || [];
  const onAddExpense = propOnAddExpense || finance.addTransaction;

  // Real local date & year
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatDateKey(today), [today]);
  const currentYear = useMemo(() => today.getFullYear(), [today]);

  const [heatmapYear, setHeatmapYear] = useState(() => {
    try {
      const savedYear = Number(localStorage.getItem('fintrack_activity_calendar_year'));
      return Number.isInteger(savedYear) && savedYear >= 1970 && savedYear <= 9999
        ? savedYear
        : currentYear;
    } catch {
      return currentYear;
    }
  });
  // Selected date for inspector & calendar
  const [selectedDate, setSelectedDate] = useState(() => (
    heatmapYear === currentYear ? todayStr : `${heatmapYear}-01-01`
  ));
  // Monthly Calendar navigation state
  const [viewYear, setViewYear] = useState(heatmapYear);
  const [viewMonth, setViewMonth] = useState(heatmapYear === currentYear ? today.getMonth() : 0); // 0-11

  // Quick expense form state in Selected Date Inspector
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newMerchant, setNewMerchant] = useState('');
  const [newCategory, setNewCategory] = useState('Food');

  // Group the shared FinanceContext transactions by calendar date.
  const txByDate = useMemo(() => {
    const map = {};
    (Array.isArray(transactions) ? transactions : []).forEach((tx) => {
      if (!tx || !tx.date) return;
      const dateKey = String(tx.date).trim().slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(tx);
    });
    return map;
  }, [transactions]);

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

    // Income is shown in the selected-day detail list but never colors the heatmap.
    if (totalSpent === 0) {
      return {
        dateStr,
        totalSpent: 0,
        totalIncome,
        color: finance.theme === 'light' ? '#f1f5f9' : '#161a22',
        borderColor: finance.theme === 'light' ? '#e2e8f0' : '#29313a',
        label: totalIncome > 0 ? `Income Logged (${formatCurrency(totalIncome)})` : 'No expenses logged',
        status: 'empty',
        transactions: txList,
      };
    }

    // Spending bands use the same thresholds as the legend.
    if (totalSpent >= 1 && totalSpent <= 500) {
      return {
        dateStr,
        totalSpent,
        totalIncome,
        color: '#dcfce7',
        borderColor: '#bbf7d0',
        label: `Spent ${formatCurrency(-totalSpent)} (Light Activity)`,
        status: 'level-1',
        transactions: txList,
      };
    }

    if (totalSpent >= 501 && totalSpent <= 2000) {
      return {
        dateStr,
        totalSpent,
        totalIncome,
        color: '#86efac',
        borderColor: '#4ade80',
        label: `Spent ${formatCurrency(-totalSpent)} (Medium Activity)`,
        status: 'level-2',
        transactions: txList,
      };
    }

    if (totalSpent >= 2001 && totalSpent <= 5000) {
      return {
        dateStr,
        totalSpent,
        totalIncome,
        color: '#22c55e',
        borderColor: '#16a34a',
        label: `Spent ${formatCurrency(-totalSpent)} (High Activity)`,
        status: 'level-3',
        transactions: txList,
      };
    }

    return {
      dateStr,
      totalSpent,
      totalIncome,
      color: '#15803d',
      borderColor: '#166534',
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
      merchant: newMerchant.trim() || 'Expense',
      amount: -Math.abs(val),
      category: newCategory,
      date: selectedDate,
    };

    onAddExpense(newTx);

    setNewAmount('');
    setNewMerchant('');
    setIsAddingExpense(false);
  };

  // 3 Live Real-Life Metrics:
  // 1. Active Logging Days (Total days with at least 1 logged expense)
  // 2. Total Spent This Month (₹)
  // 3. Daily Average Spend (₹)
  const { activeDaysCount, totalSpentMonth, dailyAverage } = useMemo(() => {
    let totalMonth = 0;
    let activeDays = 0;

    const thisMonthPrefix = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    Object.entries(txByDate).forEach(([dStr, txList]) => {
      let dayExpense = 0;
      txList.forEach((t) => {
        const amt = Number(t.amount) || 0;
        if (amt < 0) dayExpense += Math.abs(amt);
      });

      if (dayExpense > 0) {
        if (dStr.startsWith(thisMonthPrefix)) {
          activeDays += 1;
          totalMonth += dayExpense;
        }
      }
    });

    const avgSpend = activeDays > 0 ? Math.round(totalMonth / activeDays) : 0;

    return {
      activeDaysCount: activeDays,
      totalSpentMonth: totalMonth,
      dailyAverage: avgSpend,
    };
  }, [txByDate, currentYear, today]);

  // Full-year calendar grid; some years span 53 Sunday-to-Saturday columns.
  const { weeks, monthHeaders } = useMemo(() => {
    const jan1 = new Date(heatmapYear, 0, 1);
    const dec31 = new Date(heatmapYear, 11, 31);

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
        const inYear = dayDate.getFullYear() === heatmapYear;
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

    const months = Array.from({ length: 12 }, (_, month) => (
      new Date(heatmapYear, month, 1).toLocaleDateString(dateLocale, { month: 'short' })
    ));
    const headers = months.map((monthName, idx) => {
      const firstDay = new Date(heatmapYear, idx, 1);
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
  }, [heatmapYear, dateLocale]);

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
    changeHeatmapYear(currentYear, todayStr);
    setViewMonth(today.getMonth());
  };

  const changeHeatmapYear = (year, selectedDay = `${year}-01-01`) => {
    setHeatmapYear(year);
    setSelectedDate(selectedDay);
    setViewYear(year);
    setViewMonth(0);
    try {
      localStorage.setItem('fintrack_activity_calendar_year', String(year));
    } catch {
      // Keep the year selection for this session if storage is unavailable.
    }
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

  const viewMonthName = new Date(viewYear, viewMonth, 1).toLocaleDateString(dateLocale, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="ns-container">
      <div className="ns-header">
        <div className="ns-header-left">
          <span className="ns-breadcrumb">{t('Dashboard')} <span aria-hidden="true">/</span> {t('Activity Calendar')}</span>
          <h1 className="ns-title">{t('Activity Calendar & Spending Heatmap')}</h1>
          <p className="ns-subtitle">
            {t('Visualize your spending patterns, track your activity and stay consistent with your financial goals.')}
          </p>
        </div>

        <div className="ns-header-right">
          <button
            type="button"
            className="ns-btn-checkin"
            onClick={() => {
              setIsAddingExpense(true);
              document.getElementById('ns-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            title={`${t('Log Expense')} · ${selectedDate}`}
          >
            + {t('Log Expense')}
          </button>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="ns-stats-grid">
        <div className="ns-stat-card">
          <div className="ns-stat-icon-wrapper ns-stat-icon-streak" aria-hidden="true">▦</div>
          <div className="ns-stat-info">
            <span className="ns-stat-label">{t('Active Logging Days')}</span>
            <span className="ns-stat-value">{activeDaysCount}</span>
            <span className="ns-stat-subtext">{t('Days with at least 1 expense logged.')}</span>
          </div>
        </div>

        <div className="ns-stat-card">
          <div className="ns-stat-icon-wrapper ns-stat-icon-total" aria-hidden="true">₹</div>
          <div className="ns-stat-info">
            <span className="ns-stat-label">{t('Total Spent This Month')}</span>
            <span className="ns-stat-value">{formatCurrency(totalSpentMonth)}</span>
            <span className="ns-stat-subtext">{t('Expenses in current month.')}</span>
          </div>
        </div>

        <div className="ns-stat-card">
          <div className="ns-stat-icon-wrapper ns-stat-icon-best" aria-hidden="true">↗</div>
          <div className="ns-stat-info">
            <span className="ns-stat-label">{t('Daily Average Spend')}</span>
            <span className="ns-stat-value">{formatCurrency(dailyAverage)}</span>
            <span className="ns-stat-subtext">{t('Average per active spending day.')}</span>
          </div>
        </div>
      </div>

      {/* Full-year spending heatmap */}
      <div className="ns-card">
        <div className="ns-card-header">
          <div className="ns-card-title-group">
            <h3 className="ns-card-title">{heatmapYear} {t('Spending Heatmap')}</h3>
            <p className="ns-card-subtitle">
              {t('Each square represents a day. Darker greens indicate higher spending.')}
            </p>
          </div>
          <div className="ns-year-controls"           aria-label={t('Choose heatmap year')}>
            <button
              type="button"
              className="ns-cal-nav-btn"
              onClick={() => changeHeatmapYear(heatmapYear - 1)}
              aria-label={t('Previous year')}
            >
              ‹
            </button>
            <span className="ns-year-label">{heatmapYear}</span>
            <button
              type="button"
              className="ns-cal-nav-btn"
              onClick={() => changeHeatmapYear(heatmapYear + 1)}
              aria-label={t('Next year')}
            >
              ›
            </button>
          </div>
        </div>

        <div className="ns-heatmap-wrapper">
          <div className="ns-heatmap-container">
            <div className="ns-months-row" style={{ gridTemplateColumns: `36px repeat(${weeks.length}, 1fr)` }}>
              <div />
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

            <div className="ns-heatmap-body" style={{ gridTemplateColumns: `36px repeat(${weeks.length}, 1fr)` }}>
              <div className="ns-day-labels">
                    {weekdayLabels.map((label) => <span key={label} className="ns-day-label">{label}</span>)}
              </div>

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
                      <button
                        type="button"
                        key={dayItem.dateStr}
                        className={`ns-cell ${isSelected ? 'ns-cell-selected' : ''} ${
                          isToday ? 'ns-cell-today' : ''
                        }`}
                        style={{
                          backgroundColor: stats.color,
                          borderColor: stats.borderColor,
                        }}
                        onClick={() => setSelectedDate(dayItem.dateStr)}
                        aria-label={`${formatReadableDate(dayItem.dateStr, dateLocale)}: ${stats.label}`}
                        title={`${dayItem.dateStr}: ${stats.label}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ns-legend-row">
          <span className="ns-legend-note">
            {t('Selected:')} <strong>{formatReadableDate(selectedDate, dateLocale)}</strong>
          </span>

          <div className="ns-legend-items">
            <div className="ns-legend-item">
              <span className="ns-legend-color ns-level-empty" />
              <span>{t('₹0 / No Expenses')}</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color ns-level-one" />
              <span>{t('₹1–₹500')}</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color ns-level-two" />
              <span>{t('₹501–₹2,000')}</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color ns-level-three" />
              <span>{t('₹2,001–₹5,000')}</span>
            </div>
            <div className="ns-legend-item">
              <span className="ns-legend-color ns-level-four" />
              <span>{t('Above ₹5,000')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Month calendar and selected-day detail */}
      <div className="ns-lower-grid">
        <div className="ns-card">
          <div className="ns-cal-header">
            <h3 className="ns-cal-title">{viewMonthName}</h3>
            <div className="ns-cal-nav">
              <button
                type="button"
                className="ns-btn-secondary"
                onClick={handleJumpToToday}
                title={t('Jump to today')}
              >
                {t('Today')}
              </button>
              <button
                type="button"
                className="ns-cal-nav-btn"
                onClick={handlePrevMonth}
                title={t('Previous Month')}
              >
                ‹
              </button>
              <button
                type="button"
                className="ns-cal-nav-btn"
                onClick={handleNextMonth}
                title={t('Next Month')}
              >
                ›
              </button>
            </div>
          </div>

          <div className="ns-cal-grid">
            {weekdayLabels.map((label) => <div key={label} className="ns-cal-day-header">{label}</div>)}

            {monthlyCalendarCells.map((cell) => {
              if (cell.empty) {
                return <div key={cell.key} className="ns-cal-cell ns-cal-cell-empty" />;
              }

              const { stats, dayNumber, dateStr, isToday, isSelected } = cell;
              return (
                <button
                  type="button"
                  key={cell.key}
                  className={`ns-cal-cell ${isSelected ? 'ns-cal-cell-selected' : ''} ${
                    isToday ? 'ns-cal-cell-today' : ''
                  }`}
                  style={{
                    ...(stats.status === 'empty' ? {} : { backgroundColor: stats.color }),
                    borderColor: isSelected ? '#15803d' : stats.borderColor,
                  }}
                  onClick={() => {
                    const year = Number(dateStr.slice(0, 4));
                    if (year !== heatmapYear) changeHeatmapYear(year, dateStr);
                    else setSelectedDate(dateStr);
                  }}
                  title={`${dateStr}: ${stats.label}`}
                >
                  <div className="ns-cal-cell-top">
                    <span className="ns-cal-day-num">{dayNumber}</span>
                    {isToday && <span className="ns-cal-today-badge">{t('Today').toUpperCase()}</span>}
                  </div>
                  <div className="ns-cal-cell-bottom">
                    <span className="ns-cal-indicator-dot" style={{ backgroundColor: stats.color }} />
                    {stats.totalSpent > 0 && (
                      <span className="ns-cal-spend-tag" style={{ backgroundColor: stats.color, color: '#0f172a' }}>
                        ₹{stats.totalSpent.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ns-card ns-inspector" id="ns-inspector">
          <div className="ns-inspector-header">
            <span className="ns-card-subtitle">{t('Selected date')}</span>
            <h3 className="ns-inspector-date">{formatReadableDate(selectedDate, dateLocale)}</h3>
            <div className="ns-inspector-badge ns-badge-unlogged">
              {selectedStats.totalSpent > 0
                ? `${formatCurrency(selectedStats.totalSpent)} ${t('spent')}`
                : t('No expenses logged')}
            </div>
          </div>
          <button
            type="button"
            className="ns-details-link"
            onClick={() => document.getElementById('ns-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            {t('View details')} <span aria-hidden="true">→</span>
          </button>
          {!isAddingExpense ? (
            <button
              type="button"
              className="ns-inspector-action ns-btn-toggle-on"
              onClick={() => setIsAddingExpense(true)}
            >
              + {t('Log Expense')} · {selectedDate}
            </button>
          ) : (
            <form onSubmit={handleSaveExpense} className="ns-add-expense-form">
              <span className="ns-form-title">{t('Log Expense')} · {selectedDate}</span>
              <div className="ns-form-row">
                <input
                  type="number"
                  placeholder={t('Amount (₹)')}
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
                  {['Food', 'Groceries', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Rent', 'Utilities', 'Health', 'Others']
                    .map((category) => <option key={category} value={category}>{t(category)}</option>)}
                </select>
              </div>
              <input
                type="text"
                placeholder={t('Merchant or note')}
                className="ns-form-input"
                value={newMerchant}
                onChange={(e) => setNewMerchant(e.target.value)}
              />
              <div className="ns-form-actions">
                <button type="submit" className="ns-btn-submit">{t('Save Expense')}</button>
                <button type="button" className="ns-btn-cancel" onClick={() => setIsAddingExpense(false)}>
                  {t('Cancel')}
                </button>
              </div>
            </form>
          )}
          <div className="ns-inspector-metrics">
            <div className="ns-metric-box">
              <span className="ns-metric-title">{t('Total expenses')}</span>
              <span className={`ns-metric-value ${selectedStats.totalSpent > 0 ? 'ns-text-danger' : 'ns-text-muted'}`}>
                {formatCurrency(selectedStats.totalSpent)}
              </span>
            </div>
            <div className="ns-metric-box">
              <span className="ns-metric-title">{t('Transactions')}</span>
              <span className="ns-metric-value">{selectedStats.transactions.length}</span>
            </div>
          </div>
          <div className="ns-tx-section">
            <span className="ns-tx-title">{t('Transactions')} ({selectedStats.transactions.length})</span>
            {selectedStats.transactions.length === 0 ? (
              <div className="ns-tx-empty">{t('No transactions recorded on this date.')}</div>
            ) : (
              <div className="ns-tx-list">
                {selectedStats.transactions.map((tx, index) => {
                  const amt = Number(tx.amount) || 0;
                  return (
                    <div key={tx.id ?? `${tx.date}-${tx.merchant}-${index}`} className="ns-tx-item">
                      <div className="ns-tx-left">
                        <span className="ns-tx-merchant">{tx.merchant || 'Expense'}</span>
                        <span className="ns-tx-cat-tag">{tx.category || 'Uncategorized'}</span>
                      </div>
                      <span className={`ns-tx-amount ${amt < 0 ? 'ns-text-danger' : 'ns-text-success'}`}>
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
