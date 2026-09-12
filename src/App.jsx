import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Sidebar from './components/Sidebar';
import Panel from './components/Panel';
import ListRow from './components/ListRow';
import LatestTransactions from './components/LatestTransactions';
import AddExpense from './components/AddExpense';
import AiCoach from './components/AiCoach';
import FinancialHealth from './components/FinancialHealth';
import BudgetPrediction from './components/BudgetPrediction';
import ReceiptScanner from './components/ReceiptScanner';
import SpendingCard from './components/SpendingCard';
import { calculateFinancialSummary, getCategoryTotals, formatCurrency } from './utils/finance';

// AI insights
const initialInsights = [
  'You spent 72% of your monthly budget. Nice pace — keep dining under ₹2,000.',
  'Dining out is 38% above your 3-month average this week.',
  'Moving ₹5,000 on payday keeps your savings goal on track.',
];

// Subscriptions
const initialSubscriptions = [
  { name: 'JioCinema Premium', note: 'Entertainment · renews 14 Oct', value: '₹149' },
  { name: 'Cult.fit Gym', note: 'Fitness · renews 02 Oct', value: '₹1,499' },
  { name: 'Hotstar Super', note: 'Not opened in 40 days', value: '₹299' },
];

// Bills
const initialBills = [
  { name: 'House Rent', note: 'Due 03 Oct', value: '₹15,000' },
  { name: 'Electricity (BSES)', note: 'Due 09 Oct', value: '₹1,850' },
  { name: 'Airtel Broadband', note: 'Due 17 Oct', value: '₹999' },
];

// Investments
const initialInvestments = [
  { name: 'Nifty 50 Index Fund', note: 'Balanced · moderate risk', value: '12.4% / yr', isPositive: true },
  { name: 'Tata Digital India Fund', note: 'Growth · higher risk', value: '18.2% / yr', isPositive: true },
  { name: 'HDFC Corporate Bond', note: 'Income · low risk', value: '7.1% / yr', isPositive: true },
];

// Initial Transactions Dataset
const initialTransactions = [
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
  { id: 16, merchant: ' Domino\'s', amount: -540, category: 'Food', date: '2026-09-08' },
  { id: 17, merchant: 'Amazon Prime', amount: -149, category: 'Entertainment', date: '2026-09-01' },
  { id: 18, merchant: 'Water Bill', amount: -320, category: 'Bills', date: '2026-09-05' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activePage, setActivePage] = useState('home');

  // Derive single-source-of-truth financial metrics
  const financialSummary = calculateFinancialSummary(transactions);
  const categoryTotals = getCategoryTotals(transactions);

  // Dynamic spending categories array reconciled with actual transaction totals
  const spendingCategories = [
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
  ];

  // Sync theme with body class
  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
  }, [theme]);

  // Check URL path on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/receipt-scanner') {
      setActivePage('scanner');
    } else if (path === '/ai-coach') {
      setActivePage('aicoach');
    } else if (path === '/health') {
      setActivePage('health');
    } else if (path === '/budget') {
      setActivePage('budget');
    }
  }, []);

  const navigateTo = (page, path) => {
    setActivePage(page);
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', path);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddExpense = (newExpense) => {
    const numericAmount = Number(newExpense.amount);
    const newTransaction = {
      id: Date.now(),
      merchant: newExpense.merchant,
      amount: numericAmount,
      category: newExpense.category,
      date: newExpense.date || new Date().toISOString().split('T')[0],
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  if (!isLoggedIn) {
    if (isRegistering) {
      return (
        <CreateAccount
          onLogin={() => setIsLoggedIn(true)}
          onBackToLogin={() => setIsRegistering(false)}
        />
      );
    }
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        onNavigateToCreateAccount={() => setIsRegistering(true)}
      />
    );
  }

  // Common navigation handlers for Sidebar
  const sidebarProps = {
    activePage,
    theme,
    onToggleTheme: toggleTheme,
    onHomeClick: () => navigateTo('home', '/'),
    onHealthClick: () => navigateTo('health', '/health'),
    onBudgetClick: () => navigateTo('budget', '/budget'),
    onAiCoachClick: () => navigateTo('aicoach', '/ai-coach'),
    onReceiptScannerClick: () => navigateTo('scanner', '/receipt-scanner'),
  };

  // Dedicated Receipt Scanner page
  if (activePage === 'scanner') {
    return (
      <div className="receipt-scanner-page">
        <Sidebar {...sidebarProps} />
        <main className="receipt-scanner-main">
          <ReceiptScanner
            onBackToDashboard={() => navigateTo('home', '/')}
            onAddExpense={handleAddExpense}
          />
        </main>
      </div>
    );
  }

  // Full-screen AI Coach page
  if (activePage === 'aicoach') {
    return (
      <div className="ai-coach-page">
        <Sidebar {...sidebarProps} />
        <main className="ai-coach-main">
          <button
            type="button"
            className="btn-primary ai-coach-back"
            onClick={() => navigateTo('home', '/')}
          >
            ← Back to Dashboard
          </button>
          <AiCoach transactions={transactions} />
        </main>
      </div>
    );
  }

  // Full-screen Financial Health page
  if (activePage === 'health') {
    return (
      <div className="health-page">
        <Sidebar {...sidebarProps} />
        <main className="health-main">
          <button
            type="button"
            className="btn-primary health-back"
            onClick={() => navigateTo('home', '/')}
          >
            ← Back to Dashboard
          </button>
          <FinancialHealth transactions={transactions} />
        </main>
      </div>
    );
  }

  // Full-screen Budget Prediction page
  if (activePage === 'budget') {
    return (
      <div className="budget-page">
        <Sidebar {...sidebarProps} />
        <main className="budget-main">
          <button
            type="button"
            className="btn-primary budget-back"
            onClick={() => navigateTo('home', '/')}
          >
            ← Back to Dashboard
          </button>
          <BudgetPrediction transactions={transactions} />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {isAddExpenseOpen && (
        <AddExpense
          transactions={transactions}
          setTransactions={setTransactions}
          onClose={() => setIsAddExpenseOpen(false)}
        />
      )}
      <Sidebar {...sidebarProps} />

      <main className="main-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? '☀️ Light Theme' : '🌙 Dark Theme'}
            </button>
            <div>
              <h1 className="header-title">Welcome back, Rohan!</h1>
              <p className="header-subtitle">Your AI financial coach — October overview</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigateTo('scanner', '/receipt-scanner')}
            >
              🧾 Scan Receipt
            </button>
            <button type="button" className="btn-primary" onClick={() => setIsAddExpenseOpen(true)}>
              + Add Transaction
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left / Middle Columns */}
          <div className="grid-left-col">
            {/* Top 2 Cards: Score & Balance */}
            <div className="two-cards-row">
              <Panel title="Financial health score" action="Read all" onAction={() => navigateTo('health', '/health')}>
                <div className="score-row">
                  <span className="score-number">{financialSummary.healthScore}</span>
                  <span className="score-badge text-success">+8 this month</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(Math.max(financialSummary.healthScore, 5), 100)}%` }}
                  ></div>
                </div>
                <p className="score-note">
                  {financialSummary.healthScore >= 75
                    ? 'Strong — savings and cash flow look healthy.'
                    : 'Moderate — monitor discretionary spending.'}
                </p>
              </Panel>

              <Panel title="Total balance">
                <p className={`balance-number ${financialSummary.totalBalance < 0 ? 'text-danger' : ''}`}>
                  {formatCurrency(financialSummary.totalBalance)}
                </p>
                <div className="balance-details">
                  <div>
                    <p className="detail-label">Money in</p>
                    <p className="detail-value text-success">
                      {formatCurrency(financialSummary.totalIncome, true)}
                    </p>
                  </div>
                  <div>
                    <p className="detail-label">Money out</p>
                    <p className="detail-value text-danger">
                      {formatCurrency(-financialSummary.totalExpenses, true)}
                    </p>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Comprehensive 10 Spending Overview Category Cards */}
            <Panel title="Spending Overview" action="Last 3 Months">
              <div className="spending-overview-grid">
                {spendingCategories.map((cat) => (
                  <SpendingCard key={cat.id} {...cat} />
                ))}
              </div>
            </Panel>

            {/* AI Spending Insights */}
            <Panel title="AI spending insights">
              <ul className="insights-list">
                {initialInsights.map((text) => (
                  <li key={text} className="insight-item">
                    <span className="insight-bullet"></span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Budget Prediction & Detected Subscriptions */}
            <div className="two-cards-row">
              <Panel title="Budget prediction">
                <BudgetPrediction transactions={transactions} />
              </Panel>

              <Panel title="Detected subscriptions" action="Show more">
                <div className="list-container">
                  {initialSubscriptions.map((item) => (
                    <ListRow key={item.name} {...item} />
                  ))}
                </div>
                <p className="panel-footer-note">
                  Cancel 1 unused subscription to save ₹299 a month.
                </p>
              </Panel>
            </div>
          </div>

          {/* Right Column */}
          <div className="grid-right-col">
            <Panel title="Bill reminders">
              <div className="list-container">
                {initialBills.map((item) => (
                  <ListRow key={item.name} {...item} />
                ))}
              </div>
            </Panel>

            <Panel title="Investment suggestions">
              <div className="list-container">
                {initialInvestments.map((item) => (
                  <ListRow key={item.name} {...item} />
                ))}
              </div>
            </Panel>

            <LatestTransactions transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
