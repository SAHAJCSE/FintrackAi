/**
 * Centralized financial utility functions for FinTrack AI
 */

/**
 * Format amount into clean Indian Rupee format (e.g., ₹15,000 or -₹450)
 */
export function formatCurrency(amount, showSign = false) {
  const numericAmount = Number(amount) || 0;
  const absFormatted = Math.abs(numericAmount).toLocaleString('en-IN');

  if (showSign) {
    if (numericAmount > 0) return `+₹${absFormatted}`;
    if (numericAmount < 0) return `-₹${absFormatted}`;
    return `₹${absFormatted}`;
  }

  return numericAmount < 0 ? `-₹${absFormatted}` : `₹${absFormatted}`;
}

/**
 * Standardize category names across the application
 */
export function normalizeCategory(category = '') {
  const lower = String(category).trim().toLowerCase();

  if (lower.includes('food') || lower.includes('groc') || lower.includes('dining')) {
    return 'Food';
  }
  if (lower.includes('trans') || lower.includes('cab') || lower.includes('uber') || lower.includes('ola')) {
    return 'Transport';
  }
  if (lower.includes('rent') || lower.includes('house')) {
    return 'Rent';
  }
  if (lower.includes('health') || lower.includes('gym') || lower.includes('fit')) {
    return 'Health';
  }
  if (lower.includes('hosp') || lower.includes('medic') || lower.includes('doctor')) {
    return 'Hospital';
  }
  if (lower.includes('emerg') || lower.includes('save')) {
    return 'Emergency';
  }
  if (lower.includes('util') || lower.includes('bill') || lower.includes('electr') || lower.includes('water') || lower.includes('broadband')) {
    return 'Utilities';
  }
  if (lower.includes('shop') || lower.includes('amazon') || lower.includes('flipkart')) {
    return 'Shopping';
  }
  if (lower.includes('enter') || lower.includes('movi') || lower.includes('netfl') || lower.includes('hotstar') || lower.includes('spot')) {
    return 'Entertainment';
  }
  if (lower.includes('person')) {
    return 'Personal';
  }

  return category || 'Others';
}

/**
 * Calculate dynamic financial metrics from a single source of truth transactions list
 */
export function calculateFinancialSummary(transactions = []) {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((t) => {
    const amt = Number(t.amount) || 0;
    if (amt > 0) {
      totalIncome += amt;
    } else if (amt < 0) {
      totalExpenses += Math.abs(amt);
    }
  });

  const totalBalance = totalIncome - totalExpenses;
  
  // Safe percentage calculation guarding against division by zero
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // Dynamic health score (base score derived from cash flow ratio and savings rate)
  let healthScore = 50;
  if (totalIncome > 0) {
    const expenseRatio = totalExpenses / totalIncome;
    if (expenseRatio <= 0.5) healthScore = 88;
    else if (expenseRatio <= 0.7) healthScore = 82;
    else if (expenseRatio <= 0.9) healthScore = 65;
    else healthScore = 42;
  }

  return {
    totalIncome,
    totalExpenses,
    totalBalance,
    savingsRate: parseFloat(savingsRate.toFixed(1)),
    healthScore,
  };
}

/**
 * Aggregate spending by normalized category
 */
export function getCategoryTotals(transactions = []) {
  const totals = {};

  transactions.forEach((t) => {
    const amt = Number(t.amount) || 0;
    if (amt < 0) {
      const cat = normalizeCategory(t.category);
      totals[cat] = (totals[cat] || 0) + Math.abs(amt);
    }
  });

  return totals;
}
