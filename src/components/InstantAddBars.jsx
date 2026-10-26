import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

/**
 * Intelligent Natural Language Parser for FinTrack AI
 * Parses queries like:
 * - "swiggy 450 yesterday"
 * - "chai 40"
 * - "uber 230 2 days ago"
 * - "salary 45k"
 * - "groceries 1,200"
 */
export function parseNaturalLanguageTransaction(text = '') {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();

  // 1. Detect Amount (handles 45k, 1.5k, 1,200, 450, etc.)
  let amount = 0;
  const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  const commaNumberMatch = lower.match(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+(?:\.\d+)?)/i);
  const standardNumberMatch = lower.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)/i);

  if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1000;
  } else if (commaNumberMatch) {
    amount = parseFloat(commaNumberMatch[1].replace(/,/g, ''));
  } else if (standardNumberMatch) {
    amount = parseFloat(standardNumberMatch[1]);
  }

  // 2. Detect Date
  const today = new Date();
  let txDate = today.toISOString().split('T')[0];
  let dateLabel = 'Today';

  if (lower.includes('yesterday')) {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    txDate = d.toISOString().split('T')[0];
    dateLabel = 'Yesterday';
  } else {
    const daysAgoMatch = lower.match(/(\d+)\s*days?\s*ago/);
    if (daysAgoMatch) {
      const days = parseInt(daysAgoMatch[1], 10);
      const d = new Date(today);
      d.setDate(d.getDate() - days);
      txDate = d.toISOString().split('T')[0];
      dateLabel = `${days}d ago`;
    }
  }

  // 3. Detect Category & Type
  let category = 'Food';
  let isIncome = false;
  let categoryIcon = '🍔';

  if (
    lower.includes('salary') ||
    lower.includes('credited') ||
    lower.includes('freelance') ||
    lower.includes('income') ||
    lower.includes('bonus') ||
    lower.includes('dividend')
  ) {
    category = 'Income';
    isIncome = true;
    categoryIcon = '💼';
  } else if (
    lower.includes('grocery') ||
    lower.includes('groceries') ||
    lower.includes('bigbasket') ||
    lower.includes('blinkit') ||
    lower.includes('zepto') ||
    lower.includes('milk') ||
    lower.includes('vegetable')
  ) {
    category = 'Groceries';
    categoryIcon = '🥬';
  } else if (
    lower.includes('uber') ||
    lower.includes('ola') ||
    lower.includes('cab') ||
    lower.includes('auto') ||
    lower.includes('metro') ||
    lower.includes('petrol') ||
    lower.includes('fuel') ||
    lower.includes('transport')
  ) {
    category = 'Transport';
    categoryIcon = '🚗';
  } else if (
    lower.includes('rent') ||
    lower.includes('house') ||
    lower.includes('home') ||
    lower.includes('maintenance')
  ) {
    category = 'Home';
    categoryIcon = '🏠';
  } else if (
    lower.includes('health') ||
    lower.includes('gym') ||
    lower.includes('cult') ||
    lower.includes('doctor') ||
    lower.includes('pharmacy') ||
    lower.includes('medicine')
  ) {
    category = 'Health';
    categoryIcon = '💊';
  } else if (
    lower.includes('shopping') ||
    lower.includes('amazon') ||
    lower.includes('flipkart') ||
    lower.includes('myntra') ||
    lower.includes('zara') ||
    lower.includes('clothes')
  ) {
    category = 'Shopping';
    categoryIcon = '🛍️';
  } else if (
    lower.includes('fun') ||
    lower.includes('netflix') ||
    lower.includes('movie') ||
    lower.includes('hotstar') ||
    lower.includes('spotify') ||
    lower.includes('party') ||
    lower.includes('game')
  ) {
    category = 'Fun';
    categoryIcon = '🎉';
  } else if (
    lower.includes('book') ||
    lower.includes('udemy') ||
    lower.includes('course') ||
    lower.includes('learning') ||
    lower.includes('tuition')
  ) {
    category = 'Learning';
    categoryIcon = '📚';
  } else if (
    lower.includes('bill') ||
    lower.includes('electricity') ||
    lower.includes('wifi') ||
    lower.includes('broadband') ||
    lower.includes('water')
  ) {
    category = 'Bills';
    categoryIcon = '⚡';
  } else {
    // Default food or chai
    category = 'Food';
    categoryIcon = lower.includes('chai') || lower.includes('coffee') || lower.includes('tea') ? '☕' : '🍔';
  }

  // 4. Extract Merchant Name
  // Strip out amount, date keywords, "rs", "inr", etc.
  let cleanName = trimmed
    .replace(/(?:₹|rs\.?|inr)?\s*\d+(?:\.\d+)?\s*k\b/gi, '')
    .replace(/(?:₹|rs\.?|inr)?\s*\d{1,3}(?:,\d{3})+(?:\.\d+)?/gi, '')
    .replace(/(?:₹|rs\.?|inr)?\s*\d+(?:\.\d+)?/gi, '')
    .replace(/\b(?:yesterday|today|\d+\s*days?\s*ago)\b/gi, '')
    .replace(/\b(?:spent|paid|for|at|on|to|in)\b/gi, '')
    .trim();

  // If cleanName is empty, use category as default
  if (!cleanName) {
    cleanName = category === 'Income' ? 'Salary' : category;
  } else {
    // Capitalize words nicely
    cleanName = cleanName
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return {
    raw: trimmed,
    merchant: cleanName,
    amount: isIncome ? amount : -Math.abs(amount),
    displayAmount: amount,
    category,
    categoryIcon,
    date: txDate,
    dateLabel,
    isIncome,
  };
}

export default function InstantAddBar({ onAddTransaction }) {
  const finance = useFinance ? useFinance() : null;
  const dispatchAdd = onAddTransaction || finance?.addTransaction;

  const [inputText, setInputText] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [flashSuccess, setFlashSuccess] = useState(null);

  const parsed = useMemo(() => {
    return parseNaturalLanguageTransaction(inputText);
  }, [inputText]);

  const handleApplySample = (sample) => {
    setInputText(sample);
    // Trigger smooth string formatting & addition
    executeAdd(sample);
  };

  const executeAdd = (textToAdd) => {
    const result = parseNaturalLanguageTransaction(textToAdd || inputText);
    if (!result || !result.displayAmount || result.displayAmount <= 0) {
      return;
    }

    // Step 1: Trigger smart string formatting animation
    setIsFormatting(true);

    setTimeout(() => {
      // Step 2: Dispatch formatted transaction to single source of truth
      if (dispatchAdd) {
        dispatchAdd({
          id: Date.now(),
          merchant: result.merchant,
          amount: result.amount,
          category: result.category,
          date: result.date,
        });
      }

      // Step 3: Flash success toast badge
      setFlashSuccess({
        merchant: result.merchant,
        amount: result.displayAmount,
        category: result.category,
        isIncome: result.isIncome,
        icon: result.categoryIcon,
      });

      setInputText('');
      setIsFormatting(false);

      setTimeout(() => {
        setFlashSuccess(null);
      }, 3200);
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    executeAdd(inputText);
  };

  const trySamples = [
    'chai 40',
    'swiggy 450 yesterday',
    'uber 230 2 days ago',
    'salary 45k',
    'groceries 1,200',
  ];

  return (
    <div className="instant-add-container">
      {/* Main Natural Language Search/Add Bar */}
      <form onSubmit={handleSubmit} className="instant-add-form">
        <div className={`instant-add-pill ${isFormatting ? 'is-formatting' : ''}`}>
          <span className="instant-add-sparkle" aria-hidden="true">
            ✦
          </span>
          <input
            type="text"
            className="instant-add-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type like you talk — “swiggy 450 yesterday”"
            autoComplete="off"
            spellCheck="false"
          />

          <button
            type="submit"
            className="instant-add-submit-btn"
            title="Instant Add (Enter)"
            disabled={!inputText.trim()}
            aria-label="Add transaction"
          >
            <svg
              className="send-arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
            </svg>
          </button>
        </div>
      </form>

      {/* Live String Formatting Preview Banner (Shown while typing) */}
      {parsed && parsed.displayAmount > 0 && !isFormatting && (
        <div className="instant-format-preview" aria-live="polite">
          <span className="format-preview-label">Parsing string:</span>
          <div className="format-preview-chips">
            <span className="format-chip chip-merchant">
              <strong>Merchant:</strong> {parsed.merchant}
            </span>
            <span className="format-chip chip-amount">
              <strong>Amount:</strong> {parsed.isIncome ? '+' : '-'}₹
              {parsed.displayAmount.toLocaleString('en-IN')}
            </span>
            <span className="format-chip chip-category">
              <span>{parsed.categoryIcon}</span>
              <strong>Category:</strong> {parsed.category}
            </span>
            <span className="format-chip chip-date">
              <strong>Date:</strong> {parsed.dateLabel}
            </span>
          </div>
          <button
            type="button"
            className="format-confirm-btn"
            onClick={() => executeAdd(inputText)}
          >
            Confirm +
          </button>
        </div>
      )}

      {/* Formatting Transformation Animation State */}
      {isFormatting && (
        <div className="instant-formatting-indicator">
          <span className="instant-format-spinner" />
          <span>Formatting natural language string &amp; adding to transactions...</span>
        </div>
      )}

      {/* Success Notification Banner */}
      {flashSuccess && (
        <div className="instant-add-toast">
          <span className="toast-icon">✨</span>
          <div className="toast-msg">
            Formatted &amp; added <strong>{flashSuccess.merchant}</strong> (
            <span className={flashSuccess.isIncome ? 'text-success' : 'text-danger'}>
              {flashSuccess.isIncome ? '+' : '-'}₹
              {flashSuccess.amount.toLocaleString('en-IN')}
            </span>
            ) to <strong>{flashSuccess.category}</strong>!
          </div>
        </div>
      )}

      {/* "Try:" Quick Example Chips */}
      <div className="instant-add-try-row">
        <span className="try-label">Try:</span>
        <div className="try-chips-list">
          {trySamples.map((sample) => (
            <button
              key={sample}
              type="button"
              className="try-chip-btn"
              onClick={() => handleApplySample(sample)}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { InstantAddBar, InstantAddBar as InstantAddBars };
