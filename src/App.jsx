import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import StatTile from './components/StatTile';
import Panel from './components/Panel';
import ListRow from './components/ListRow';
import LatestTransactions from './components/LatestTransactions';
import AddExpense from './components/AddExpense';
import AiCoach from './components/AiCoach';
import FinancialHealth from './components/FinancialHealth';
import BudgetPrediction from './components/BudgetPrediction';
import ReceiptScanner from './components/ReceiptScanner';
import SpendingCard from './components/SpendingCard';

// 10 Spending Overview categories data with vibrant pastel colors
const spendingCategories = [
  {
    id: 'rent',
    icon: '🏠',
    name: 'Rent',
    amount: '₹15,000',
    percentage: 78,
    subtext: 'Spent this month',
    colorClass: 'tile-blue',
  },
  {
    id: 'transport',
    icon: '🚌',
    name: 'Transport',
    amount: '₹4,500',
    percentage: 56,
    subtext: 'Spent this month',
    colorClass: 'tile-pink',
  },
  {
    id: 'food',
    icon: '🍴',
    name: 'Food & Groceries',
    amount: '₹8,500',
    percentage: 72,
    subtext: 'Spent this month',
    colorClass: 'tile-lime',
  },
  {
    id: 'health',
    icon: '❤️',
    name: 'Health',
    amount: '₹3,200',
    percentage: 48,
    subtext: 'Spent this month',
    colorClass: 'tile-cyan',
  },
  {
    id: 'personal',
    icon: '👤',
    name: 'Personal',
    amount: '₹2,800',
    percentage: 62,
    subtext: 'Spent this month',
    colorClass: 'tile-purple',
  },
  {
    id: 'entertainment',
    icon: '🎮',
    name: 'Entertainment',
    amount: '₹2,100',
    percentage: 45,
    subtext: 'Spent this month',
    colorClass: 'tile-orange',
  },
  {
    id: 'utilities',
    icon: '⚡',
    name: 'Utilities',
    amount: '₹1,950',
    percentage: 38,
    subtext: 'Spent this month',
    colorClass: 'tile-blue-light',
  },
  {
    id: 'emergency',
    icon: '🛡️',
    name: 'Emergency',
    amount: '₹5,000',
    percentage: 85,
    subtext: 'Saved this month',
    colorClass: 'tile-red',
  },
  {
    id: 'hospital',
    icon: '🏥',
    name: 'Hospital',
    amount: '₹2,600',
    percentage: 40,
    subtext: 'Spent this month',
    colorClass: 'tile-cyan',
  },
  {
    id: 'others',
    icon: '⋯',
    name: 'Others',
    amount: '₹1,200',
    percentage: 21,
    subtext: 'Spent this month',
    colorClass: 'tile-green',
  },
];

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

// Transactions
const initialTransactions = [
  { id: 1, merchant: 'Swiggy', amount: -850, category: 'Food', date: '10 Sep 2026' },
  { id: 2, merchant: 'Salary', amount: 45000, category: 'Income', date: '01 Sep 2026' },
  { id: 3, merchant: 'Flipkart', amount: -1299, category: 'Shopping', date: '28 Aug 2026' },
  { id: 4, merchant: 'Hotstar', amount: -499, category: 'Entertainment', date: '25 Aug 2026' },
  { id: 5, merchant: 'Ola Cabs', amount: -350, category: 'Transport', date: '22 Aug 2026' },
  { id: 6, merchant: 'Freelance Work', amount: 12000, category: 'Income', date: '18 Aug 2026' },
  { id: 7, merchant: 'Zomato', amount: -620, category: 'Food', date: '15 Sep 2026' },
  { id: 8, merchant: 'Netflix', amount: -649, category: 'Entertainment', date: '14 Sep 2026' },
  { id: 9, merchant: 'Electricity (BSES)', amount: -1850, category: 'Bills', date: '09 Sep 2026' },
  { id: 10, merchant: 'Airtel Broadband', amount: -999, category: 'Bills', date: '17 Sep 2026' },
  { id: 11, merchant: 'Spotify', amount: -199, category: 'Entertainment', date: '12 Sep 2026' },
  { id: 12, merchant: 'BigBasket', amount: -1420, category: 'Groceries', date: '11 Sep 2026' },
  { id: 13, merchant: 'House Rent', amount: -15000, category: 'Bills', date: '03 Sep 2026' },
  { id: 14, merchant: 'Cult.fit Gym', amount: -1499, category: 'Health', date: '02 Sep 2026' },
  { id: 15, merchant: 'Dunzo', amount: -380, category: 'Transport', date: '09 Sep 2026' },
  { id: 16, merchant: ' Domino\'s', amount: -540, category: 'Food', date: '08 Sep 2026' },
  { id: 17, merchant: 'Amazon Prime', amount: -149, category: 'Entertainment', date: '01 Sep 2026' },
  { id: 18, merchant: 'Water Bill', amount: -320, category: 'Bills', date: '05 Sep 2026' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Active view state: 'home' | 'health' | 'budget' | 'aicoach' | 'scanner'
  const [activePage, setActivePage] = useState('home');

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
    const newTransaction = {
      id: Date.now(),
      merchant: newExpense.merchant,
      amount: newExpense.amount,
      category: newExpense.category,
      date: newExpense.date,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
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
          <FinancialHealth />
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
            {/* Top-Left Theme Changes Button */}
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
              + Add Expense
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
                  <span className="score-number">82</span>
                  <span className="score-badge text-success">+8 this month</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: '82%' }}></div>
                </div>
                <p className="score-note">Strong — savings and cash flow look healthy.</p>
              </Panel>

              <Panel title="Total balance">
                <p className="balance-number">₹1,25,300.00</p>
                <div className="balance-details">
                  <div>
                    <p className="detail-label">Money in</p>
                    <p className="detail-value text-success">+₹45,000.00</p>
                  </div>
                  <div>
                    <p className="detail-label">Money out</p>
                    <p className="detail-value text-danger">-₹18,650.00</p>
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
