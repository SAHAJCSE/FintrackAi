import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { calculateFinancialSummary, getCategoryTotals, formatCurrency } from '../utils/finance';

// AI insights
export const initialInsights = [
  'You spent 72% of your monthly budget. Nice pace — keep dining under ₹2,000.',
  'Dining out is 38% above your 3-month average this week.',
  'Moving ₹5,000 on payday keeps your savings goal on track.',
];

// Subscriptions
export const initialSubscriptions = [
  { name: 'JioCinema Premium', note: 'Entertainment · renews 14 Oct', value: '₹149' },
  { name: 'Cult.fit Gym', note: 'Fitness · renews 02 Oct', value: '₹1,499' },
  { name: 'Hotstar Super', note: 'Not opened in 40 days', value: '₹299' },
];

// Bills
export const initialBills = [
  { name: 'House Rent', note: 'Due 03 Oct', value: '₹15,000' },
  { name: 'Electricity (BSES)', note: 'Due 09 Oct', value: '₹1,850' },
  { name: 'Airtel Broadband', note: 'Due 17 Oct', value: '₹999' },
];

// Investments
export const initialInvestments = [
  { name: 'Nifty 50 Index Fund', note: 'Balanced · moderate risk', value: '12.4% / yr', isPositive: true },
  { name: 'Tata Digital India Fund', note: 'Growth · higher risk', value: '18.2% / yr', isPositive: true },
  { name: 'HDFC Corporate Bond', note: 'Income · low risk', value: '7.1% / yr', isPositive: true },
];

// Initial Transactions Dataset
export const initialTransactions = [
  { id: 1, merchant: 'Swiggy', amount: -850, category: 'Food', date: '2026-09-10' },
  { id: 2, merchant: 'Salary', amount: 45000, category: 'Income', date: '2026-09-01' },
  { id: 3, merchant: 'Flipkart', amount: -1299, category: 'Shopping', date: '2026-08-28' },
  { id: 4, merchant: 'Hotstar', amount: -499, category: 'Entertainment', date: '2026-08-25' },
  { id: 5, merchant: 'Ola Cabs', amount: -350, category: 'Transport', date: '2026-08-22' },
  { id: 6, merchant: 'Freelance Work', amount: 12000, category: 'Income', date: '2026-08-18' },
  { id: 7, merchant: 'Zomato', amount: -620, category: 'Food', date: '2026-09-15' },
  { id: 8, merchant: 'Netflix', amount: -649, category: 'Entertainment', date: '2026-09-14' },
  { id: 9, merchant: 'Electricity (BSES)', amount: -1850, category: 'Bills', date: '2026-09-09' },
  { id: 10, merchant: 'Airtel Broadband', amount: -999, category: 'Bills', date: '2026-09-17' },
  { id: 11, merchant: 'Spotify', amount: -199, category: 'Entertainment', date: '2026-09-12' },
  { id: 12, merchant: 'BigBasket', amount: -1420, category: 'Groceries', date: '2026-09-11' },
  { id: 13, merchant: 'House Rent', amount: -15000, category: 'Bills', date: '2026-09-03' },
  { id: 14, merchant: 'Cult.fit Gym', amount: -1499, category: 'Health', date: '2026-09-02' },
  { id: 15, merchant: 'Dunzo', amount: -380, category: 'Transport', date: '2026-09-09' },
  { id: 16, merchant: 'Domino\'s', amount: -540, category: 'Food', date: '2026-09-08' },
  { id: 17, merchant: 'Amazon Prime', amount: -149, category: 'Entertainment', date: '2026-09-01' },
  { id: 18, merchant: 'Water Bill', amount: -320, category: 'Bills', date: '2026-09-05' },
];

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  // 1. Transactions State (Single Source of Truth)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback to initial
    }
    return initialTransactions;
  });

  // Persist transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  // 2. Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // 3. UI & Theme State
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('fintrack_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activePage, setActivePage] = useState('home');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [addExpenseDefaultCategory, setAddExpenseDefaultCategory] = useState('Food');

  // 4. Bills & Subscriptions Status
  const [paidBills, setPaidBills] = useState(new Set());
  const [deletedBills, setDeletedBills] = useState(new Set());
  const [deletedSubscriptions, setDeletedSubscriptions] = useState(new Set());

  // Sync theme with body class, html data-theme, and localStorage
  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('fintrack_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Sync route on popstate and initial URL
  useEffect(() => {
    const syncRouteFromPath = () => {
      const path = window.location.pathname;
      if (path === '/receipt-scanner') {
        setActivePage('scanner');
      } else if (path === '/ai-coach') {
        setActivePage('aicoach');
      } else if (path === '/health') {
        setActivePage('health');
      } else if (path === '/budget') {
        setActivePage('budget');
      } else if (path === '/no-spend' || path === '/nospend' || path === '/calendar' || path === '/activity-calendar') {
        setActivePage('nospend');
      } else if (path === '/dashboard') {
        setActivePage('dashboard');
      } else if (path === '/login') {
        setActivePage('login');
      } else if (path === '/register') {
        setActivePage('register');
      } else {
        setActivePage('home');
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, []);

  // 5. Single-source-of-truth Derived Financial Metrics (Memoized)
  const financialSummary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const categoryTotals = useMemo(() => getCategoryTotals(transactions), [transactions]);

  // Reconciled spending categories
  const spendingCategories = useMemo(() => [
    {
      id: 'rent',
      icon: '🏠',
      name: 'Rent',
      amount: formatCurrency(categoryTotals['Rent'] || 15000),
      subtext: 'Spent this month',
      colorClass: 'tile-blue',
    },
    {
      id: 'transport',
      icon: '🚌',
      name: 'Transport',
      amount: formatCurrency(categoryTotals['Transport'] || 4500),
      subtext: 'Spent this month',
      colorClass: 'tile-pink',
    },
    {
      id: 'food',
      icon: '🍴',
      name: 'Food & Groceries',
      amount: formatCurrency(categoryTotals['Food'] || 8500),
      subtext: 'Spent this month',
      colorClass: 'tile-lime',
    },
    {
      id: 'health',
      icon: '❤️',
      name: 'Health',
      amount: formatCurrency(categoryTotals['Health'] || 3200),
      subtext: 'Spent this month',
      colorClass: 'tile-cyan',
    },
    {
      id: 'personal',
      icon: '👤',
      name: 'Personal',
      amount: formatCurrency(categoryTotals['Personal'] || 2800),
      subtext: 'Spent this month',
      colorClass: 'tile-purple',
    },
    {
      id: 'entertainment',
      icon: '🎮',
      name: 'Entertainment',
      amount: formatCurrency(categoryTotals['Entertainment'] || 2100),
      subtext: 'Spent this month',
      colorClass: 'tile-orange',
    },
    {
      id: 'utilities',
      icon: '⚡',
      name: 'Utilities',
      amount: formatCurrency(categoryTotals['Utilities'] || 1950),
      subtext: 'Spent this month',
      colorClass: 'tile-blue-light',
    },
    {
      id: 'emergency',
      icon: '🛡️',
      name: 'Emergency',
      amount: formatCurrency(categoryTotals['Emergency'] || 5000),
      subtext: 'Saved this month',
      colorClass: 'tile-red',
    },
    {
      id: 'hospital',
      icon: '🏥',
      name: 'Hospital',
      amount: formatCurrency(categoryTotals['Hospital'] || 2600),
      subtext: 'Spent this month',
      colorClass: 'tile-cyan',
    },
    {
      id: 'others',
      icon: '⋯',
      name: 'Others',
      amount: formatCurrency(categoryTotals['Others'] || categoryTotals['Shopping'] || 1200),
      subtext: 'Spent this month',
      colorClass: 'tile-green',
    },
  ], [categoryTotals]);

  // Reconciled Bill Reminders derived from transactions
  const billReminders = useMemo(() => {
    return transactions
      .filter((t) => t.category === 'Bills' && !deletedBills.has(t.id))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((t) => ({
        id: t.id,
        name: t.merchant,
        note: `Due ${new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`,
        value: formatCurrency(t.amount),
        paid: paidBills.has(t.id),
      }));
  }, [transactions, deletedBills, paidBills]);

  // Reconciled Subscriptions list
  const subscriptions = useMemo(() => {
    return initialSubscriptions.filter((sub) => !deletedSubscriptions.has(sub.name));
  }, [deletedSubscriptions]);

  // 6. Action Handlers (All wrapped in useCallback for performance)
  const addTransaction = useCallback((newTx) => {
    setTransactions((prev) => {
      const currentArr = Array.isArray(prev) ? prev : [];
      const formattedTx = {
        id: Date.now(),
        merchant: newTx.merchant || 'Expense',
        amount: typeof newTx.amount === 'number' ? newTx.amount : -Math.abs(Number(newTx.amount) || 0),
        category: newTx.category || 'Food',
        date: newTx.date || new Date().toISOString().split('T')[0],
      };
      return [formattedTx, ...currentArr];
    });
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const markBillPaid = useCallback((id) => {
    setPaidBills((prev) => new Set([...prev, id]));
  }, []);

  const removeBill = useCallback((id) => {
    setDeletedBills((prev) => new Set([...prev, id]));
  }, []);

  const removeSubscription = useCallback((name) => {
    setDeletedSubscriptions((prev) => new Set([...prev, name]));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const navigateTo = useCallback((page, path) => {
    setActivePage(page);
    setIsSidebarOpenMobile(false);
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', path);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpenMobile((prev) => !prev);
    } else {
      setIsSidebarOpenMobile(false);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsSidebarOpenMobile(false);
  }, []);

  const openAddExpense = useCallback((defaultCategory = 'Food') => {
    setAddExpenseDefaultCategory(defaultCategory);
    setIsAddExpenseOpen(true);
  }, []);

  const closeAddExpense = useCallback(() => {
    setIsAddExpenseOpen(false);
  }, []);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    setIsRegistering(false);
    navigateTo('dashboard', '/dashboard');
  }, [navigateTo]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    navigateTo('home', '/');
  }, [navigateTo]);

  // Value object provided to all consumers
  const value = useMemo(() => ({
    // Data & derived metrics
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    financialSummary,
    categoryTotals,
    spendingCategories,
    billReminders,
    subscriptions,
    investments: initialInvestments,
    insights: initialInsights,
    markBillPaid,
    removeBill,
    removeSubscription,

    // Auth state & actions
    isLoggedIn,
    setIsLoggedIn,
    isRegistering,
    setIsRegistering,
    login,
    logout,

    // Theme state & actions
    theme,
    setTheme,
    toggleTheme,

    // Navigation & UI state & actions
    activePage,
    setActivePage,
    navigateTo,
    isSidebarVisible,
    setIsSidebarVisible,
    isSidebarOpenMobile,
    setIsSidebarOpenMobile,
    toggleSidebar,
    closeMobileSidebar,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    addExpenseDefaultCategory,
    setAddExpenseDefaultCategory,
    openAddExpense,
    closeAddExpense,
  }), [
    transactions,
    addTransaction,
    deleteTransaction,
    financialSummary,
    categoryTotals,
    spendingCategories,
    billReminders,
    subscriptions,
    markBillPaid,
    removeBill,
    removeSubscription,
    isLoggedIn,
    isRegistering,
    login,
    logout,
    theme,
    toggleTheme,
    activePage,
    navigateTo,
    isSidebarVisible,
    isSidebarOpenMobile,
    toggleSidebar,
    closeMobileSidebar,
    isAddExpenseOpen,
    addExpenseDefaultCategory,
    openAddExpense,
    closeAddExpense,
  ]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

// Custom hook to consume the Finance Context
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

// Alias for flexibility
export const useAppContext = useFinance;
export default FinanceContext;
