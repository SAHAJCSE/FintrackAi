import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { calculateFinancialSummary, getCategoryTotals, formatCurrency } from '../utils/finance';

// LocalStorage Keys
export const STORAGE_KEY_TRANSACTIONS = 'fintrack_transactions';
export const STORAGE_KEY_THEME = 'fintrack_theme';
export const STORAGE_KEY_BUDGETS = 'fintrack_budgets';
export const STORAGE_KEY_USERS = 'fintrack_users';
export const STORAGE_KEY_CURRENT_USER = 'fintrack_current_user';

// Default registered user (for demo and initial testing)
export const defaultUsers = [
  {
    id: 'user_demo_1',
    name: 'Rohan Sharma',
    email: 'rohan@example.com',
    password: 'password123',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

// AI insights fallback
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

// Default Category Budgets (monthly target limits in INR)
export const initialCategoryBudgets = {
  Food: 8000,
  Rent: 15000,
  Transport: 4000,
  Shopping: 5000,
  Entertainment: 3000,
  Bills: 18000,
  Health: 3500,
  Groceries: 5000,
  Personal: 3000,
  Emergency: 5000,
  Utilities: 3000,
  Others: 3000,
};

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

/**
 * Safely initialize theme preference from localStorage.
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * Safely initialize monthly category budgets from localStorage.
 */
function getInitialBudgets() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_BUDGETS);
    if (saved === null) {
      return initialCategoryBudgets;
    }
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...initialCategoryBudgets, ...parsed };
    }
    return initialCategoryBudgets;
  } catch {
    return initialCategoryBudgets;
  }
}

/**
 * Safely initialize registered user accounts from localStorage.
 */
function getInitialUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Seed default demo user into localStorage
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch {
    return defaultUsers;
  }
}

/**
 * Safely retrieve active user session from localStorage.
 */
function getInitialCurrentUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.email) {
        return parsed;
      }
    }
  } catch {
    // fallback to null
  }
  return null;
}

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  // 1. Transactions State (Single Source of Truth)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback to initial
    }
    return initialTransactions;
  });

  // Synchronize transactions with localStorage (handles adds, updates, deletes, and empty arrays)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage:', error);
    }
  }, [transactions]);

  // 2. Category Budgets State
  const [categoryBudgets, setCategoryBudgets] = useState(getInitialBudgets);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(categoryBudgets));
    } catch (error) {
      console.error('Failed to save category budgets to localStorage:', error);
    }
  }, [categoryBudgets]);

  // 3. User Accounts and Authentication State (LocalStorage backed)
  const [users, setUsers] = useState(getInitialUsers);
  const [currentUser, setCurrentUser] = useState(getInitialCurrentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getInitialCurrentUser()));
  const [isRegistering, setIsRegistering] = useState(false);

  // Synchronize registered user accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }, [users]);

  // Synchronize active user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (error) {
      console.error('Failed to sync current user session:', error);
    }
  }, [currentUser]);

  // 4. UI & Theme State
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('fintrack_language');
      return ['en', 'hi', 'pa'].includes(savedLanguage) ? savedLanguage : 'en';
    } catch {
      return 'en';
    }
  });
  const [activePage, setActivePage] = useState('home');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [addExpenseDefaultCategory, setAddExpenseDefaultCategory] = useState('Food');
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // 5. Bills & Subscriptions Status
  const [paidBills, setPaidBills] = useState(new Set());
  const [deletedBills, setDeletedBills] = useState(new Set());
  const [deletedSubscriptions, setDeletedSubscriptions] = useState(new Set());

  // Sync theme with body class, html data-theme, and localStorage
  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('fintrack_language', language);
    } catch {
      // ignore
    }
  }, [language]);

  // Sync route on popstate and initial URL
  useEffect(() => {
    const syncRouteFromPath = () => {
      const path = window.location.pathname;
      if (path === '/receipt-scanner') {
        setActivePage('scanner');
      } else if (path === '/voice-finance') {
        setActivePage('voice');
      } else if (path === '/ai-coach') {
        setActivePage('aicoach');
      } else if (path === '/health') {
        setActivePage('health');
      } else if (path === '/budget') {
        setActivePage('budget');
      } else if (path === '/no-spend' || path === '/nospend' || path === '/calendar' || path === '/activity-calendar') {
        setActivePage('nospend');
      } else if (path === '/shortcuts' || path === '/keyboard-shortcuts') {
        setActivePage('shortcuts');
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

  // 6. Centralized Transaction Actions (Immutable state updates)
  const addTransaction = useCallback((newTx) => {
    if (!newTx) return;
    setTransactions((prev) => {
      const currentArr = Array.isArray(prev) ? prev : [];
      const numericAmount = typeof newTx.amount === 'number'
        ? newTx.amount
        : Number(newTx.amount) || 0;

      const formattedTx = {
        id: newTx.id || (Date.now() + Math.floor(Math.random() * 1000)),
        merchant: newTx.merchant ? String(newTx.merchant).trim() : 'Expense',
        amount: numericAmount,
        category: newTx.category ? String(newTx.category).trim() : 'Food',
        date: newTx.date || new Date().toISOString().split('T')[0],
        ...newTx,
      };

      // Ensure clean normalized core fields
      formattedTx.merchant = formattedTx.merchant || 'Expense';
      formattedTx.amount = numericAmount;
      formattedTx.category = formattedTx.category || 'Food';

      return [formattedTx, ...currentArr];
    });
  }, []);

  const updateTransaction = useCallback((id, updatedData) => {
    if (id === undefined || id === null || !updatedData) return;
    setTransactions((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.map((tx) => {
        if (tx.id === id) {
          const updated = {
            ...tx,
            ...updatedData,
            id: tx.id, // ID must remain immutable
          };
          if (updatedData.amount !== undefined) {
            updated.amount = typeof updatedData.amount === 'number'
              ? updatedData.amount
              : Number(updatedData.amount) || 0;
          }
          return updated;
        }
        return tx;
      });
    });
  }, []);

  const deleteTransaction = useCallback((id) => {
    if (id === undefined || id === null) return;
    setTransactions((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.filter((tx) => tx.id !== id);
    });
  }, []);

  const updateCategoryBudget = useCallback((category, amount) => {
    if (!category) return;
    const numericAmount = Math.max(0, Number(amount) || 0);
    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: numericAmount,
    }));
  }, []);

  // 7. Single-source-of-truth Derived Financial Metrics (Memoized)
  const financialSummary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const categoryTotals = useMemo(() => getCategoryTotals(transactions), [transactions]);

  // Derived Spending Categories (Calculated dynamically from transactions, no hardcoded fallbacks)
  const spendingCategories = useMemo(() => [
    {
      id: 'rent',
      icon: 'RE',
      name: 'Rent',
      amount: formatCurrency(categoryTotals['Rent'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-blue',
    },
    {
      id: 'transport',
      icon: 'TR',
      name: 'Transport',
      amount: formatCurrency(categoryTotals['Transport'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-pink',
    },
    {
      id: 'food',
      icon: 'FD',
      name: 'Food & Groceries',
      amount: formatCurrency(categoryTotals['Food'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-lime',
    },
    {
      id: 'health',
      icon: 'HL',
      name: 'Health',
      amount: formatCurrency(categoryTotals['Health'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-cyan',
    },
    {
      id: 'personal',
      icon: 'PE',
      name: 'Personal',
      amount: formatCurrency(categoryTotals['Personal'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-purple',
    },
    {
      id: 'entertainment',
      icon: 'EN',
      name: 'Entertainment',
      amount: formatCurrency(categoryTotals['Entertainment'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-orange',
    },
    {
      id: 'utilities',
      icon: 'UT',
      name: 'Utilities',
      amount: formatCurrency(categoryTotals['Utilities'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-blue-light',
    },
    {
      id: 'emergency',
      icon: 'EM',
      name: 'Emergency',
      amount: formatCurrency(categoryTotals['Emergency'] || 0),
      subtext: 'Saved this month',
      colorClass: 'tile-red',
    },
    {
      id: 'hospital',
      icon: 'HO',
      name: 'Hospital',
      amount: formatCurrency(categoryTotals['Hospital'] || 0),
      subtext: 'Spent this month',
      colorClass: 'tile-cyan',
    },
    {
      id: 'others',
      icon: '⋯',
      name: 'Others',
      amount: formatCurrency((categoryTotals['Others'] || 0) + (categoryTotals['Shopping'] || 0)),
      subtext: 'Spent this month',
      colorClass: 'tile-green',
    },
  ], [categoryTotals]);

  // Derived Budget Usage & Warnings
  const budgetUsage = useMemo(() => {
    const usage = {};
    Object.keys(categoryBudgets).forEach((cat) => {
      const spent = categoryTotals[cat] || 0;
      const budget = categoryBudgets[cat] || 0;
      const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      usage[cat] = {
        spent,
        budget,
        percent,
        remaining: Math.max(0, budget - spent),
        isOver: spent > budget,
        isNearLimit: percent >= 80 && spent <= budget,
      };
    });
    return usage;
  }, [categoryTotals, categoryBudgets]);

  // Derived Real-Time AI Insights generated directly from live transactions and budget usage
  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [
        'No transactions recorded yet. Add your income and expenses to unlock live AI financial coaching.',
        'Set up monthly budgets for Food, Rent, and Transport to monitor overspending.',
        'Track daily expenses consistently to boost your Financial Health Score.',
      ];
    }

    const list = [];

    // 1. Savings rate insight
    if (financialSummary.savingsRate >= 20) {
      list.push(`Strong savings rate of ${financialSummary.savingsRate}% this period. Your savings goal is on track.`);
    } else if (financialSummary.savingsRate > 0) {
      list.push(`Current savings rate is ${financialSummary.savingsRate}%. Increasing savings above 20% strengthens cash flow.`);
    } else if (financialSummary.totalExpenses > 0) {
      list.push(`Expenses exceed income this period (${formatCurrency(financialSummary.totalExpenses)} spent vs ${formatCurrency(financialSummary.totalIncome)} earned). Consider cutting discretionary spending.`);
    }

    // 2. Top spending category insight
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0 && sortedCategories[0][1] > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const pctOfTotal = financialSummary.totalExpenses > 0
        ? Math.round((topAmount / financialSummary.totalExpenses) * 100)
        : 0;
      list.push(`${topCategory} is your highest spending category at ${formatCurrency(topAmount)} (${pctOfTotal}% of total spend).`);
    }

    // 3. Budget pacing or warning insight
    const overBudgetEntry = Object.entries(budgetUsage).find(([, u]) => u.isOver);
    const nearBudgetEntry = Object.entries(budgetUsage).find(([, u]) => u.isNearLimit);
    if (overBudgetEntry) {
      const [cat, u] = overBudgetEntry;
      list.push(`Budget alert: ${cat} is at ${u.percent}% of budget (exceeded by ${formatCurrency(u.spent - u.budget)}).`);
    } else if (nearBudgetEntry) {
      const [cat, u] = nearBudgetEntry;
      list.push(`Pacing note: ${cat} has reached ${u.percent}% of its monthly budget.`);
    } else {
      list.push('All tracked spending categories are currently within your target monthly budgets.');
    }

    return list.slice(0, 3);
  }, [transactions, financialSummary, categoryTotals, budgetUsage]);

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

  // 8. Other Action Handlers

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

  const openShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen(true);
  }, []);

  const closeShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen(false);
  }, []);

  const signup = useCallback((payload) => {
    if (!payload) return { success: false, error: 'Registration details missing.' };

    const cleanName = (payload.name || payload.fullName || '').trim();
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const cleanPassword = (payload.password || '').trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address (e.g. name@domain.com).' };
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Refresh users from localStorage to avoid race conditions
    let currentUsers = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      currentUsers = saved ? JSON.parse(saved) : users;
      if (!Array.isArray(currentUsers)) currentUsers = defaultUsers;
    } catch {
      currentUsers = users;
    }

    const existingUser = currentUsers.find(
      (u) => (u.email || '').toLowerCase() === cleanEmail
    );

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...currentUsers, newUser];
    setUsers(updatedUsers);
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
    } catch (err) {
      console.error('Failed to save updated users list:', err);
    }

    // Safe session without password
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    setCurrentUser(sessionUser);
    setIsLoggedIn(true);
    setIsRegistering(false);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(sessionUser));
    } catch (err) {
      console.error('Failed to save current user session:', err);
    }

    navigateTo('dashboard', '/dashboard');
    return { success: true, user: sessionUser };
  }, [users, navigateTo]);

  const login = useCallback((credentials) => {
    // If called with no credentials (e.g. legacy Quick Demo button), use demo account
    if (!credentials || (!credentials.email && !credentials.password)) {
      const demoAccount = users.find((u) => u.email === 'rohan@example.com') || defaultUsers[0];
      const sessionUser = {
        id: demoAccount.id,
        name: demoAccount.name,
        email: demoAccount.email,
        createdAt: demoAccount.createdAt,
      };

      setCurrentUser(sessionUser);
      setIsLoggedIn(true);
      setIsRegistering(false);
      try {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(sessionUser));
      } catch (err) {
        console.error('Failed to save current user session:', err);
      }

      navigateTo('dashboard', '/dashboard');
      return { success: true, user: sessionUser };
    }

    const cleanEmail = (credentials.email || '').trim().toLowerCase();
    const cleanPassword = (credentials.password || '').trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Refresh users from localStorage
    let currentUsers = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      currentUsers = saved ? JSON.parse(saved) : users;
      if (!Array.isArray(currentUsers)) currentUsers = defaultUsers;
    } catch {
      currentUsers = users;
    }

    const foundUser = currentUsers.find(
      (u) => (u.email || '').toLowerCase() === cleanEmail
    );

    if (!foundUser) {
      return {
        success: false,
        error: 'No account found with this email. Please check your spelling or create an account.',
      };
    }

    if (foundUser.password !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      createdAt: foundUser.createdAt,
    };

    setCurrentUser(sessionUser);
    setIsLoggedIn(true);
    setIsRegistering(false);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(sessionUser));
    } catch (err) {
      console.error('Failed to save current user session:', err);
    }

    navigateTo('dashboard', '/dashboard');
    return { success: true, user: sessionUser };
  }, [users, navigateTo]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsRegistering(false);
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } catch (err) {
      console.error('Failed to remove current user session:', err);
    }
    navigateTo('home', '/');
  }, [navigateTo]);

  // Value object provided to all consumers
  const value = useMemo(() => ({
    // Transactions & mutations
    transactions,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // Budgets & usage
    categoryBudgets,
    setCategoryBudgets,
    updateCategoryBudget,
    budgetUsage,

    // Derived financial metrics
    financialSummary,
    categoryTotals,
    spendingCategories,
    billReminders,
    subscriptions,
    investments: initialInvestments,
    insights,
    markBillPaid,
    removeBill,
    removeSubscription,

    // User accounts & Authentication state & actions
    currentUser,
    setCurrentUser,
    users,
    isLoggedIn,
    setIsLoggedIn,
    isRegistering,
    setIsRegistering,
    signup,
    login,
    logout,

    // Theme state & actions
    theme,
    setTheme,
    toggleTheme,
    language,
    setLanguage,

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
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    openShortcutsModal,
    closeShortcutsModal,
  }), [
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categoryBudgets,
    updateCategoryBudget,
    budgetUsage,
    financialSummary,
    categoryTotals,
    spendingCategories,
    billReminders,
    subscriptions,
    insights,
    markBillPaid,
    removeBill,
    removeSubscription,
    currentUser,
    users,
    isLoggedIn,
    isRegistering,
    signup,
    login,
    logout,
    theme,
    toggleTheme,
    language,
    setLanguage,
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
    isShortcutsModalOpen,
    openShortcutsModal,
    closeShortcutsModal,
  ]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

/**
 * Custom hook to consume the Finance Context.
 * Throws a clear error if invoked outside of FinanceProvider.
 */
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

// Backwards compatibility alias
export const useAppContext = useFinance;
export default FinanceContext;
