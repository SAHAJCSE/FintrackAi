import React, { useState } from 'react';
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

// Spending categories tiles
const initialTiles = [
  { label: 'Rent', amount: '₹15,000', colorClass: 'tile-blue' },
  { label: 'Transport', amount: '₹4,500', colorClass: 'tile-pink' },
  { label: 'Health', amount: '₹3,200', colorClass: 'tile-lime' },
  { label: 'Groceries', amount: '₹8,500', colorClass: 'tile-amber' },
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
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Full-screen AI Coach page — replaces the whole dashboard
  if (isAiCoachOpen) {
    return (
      <div className="ai-coach-page">
        <Sidebar
          onAiCoachClick={() => setIsAiCoachOpen(false)}
          onHealthClick={() => setIsHealthOpen(true)}
          onBudgetClick={() => setIsBudgetOpen(true)}
        />
        <main className="ai-coach-main">
          <button
            type="button"
            className="btn-primary ai-coach-back"
            onClick={() => setIsAiCoachOpen(false)}
          >
            ← Back to Dashboard
          </button>
          <AiCoach transactions={transactions} />
        </main>
      </div>
    );
  }

  // Full-screen Financial Health page — replaces the whole dashboard
  if (isHealthOpen) {
    return (
      <div className="health-page">
        <Sidebar
          onAiCoachClick={() => setIsAiCoachOpen(true)}
          onHealthClick={() => setIsHealthOpen(false)}
          onBudgetClick={() => setIsBudgetOpen(true)}
        />
        <main className="health-main">
          <button
            type="button"
            className="btn-primary health-back"
            onClick={() => setIsHealthOpen(false)}
          >
            ← Back to Dashboard
          </button>
          <FinancialHealth />
        </main>
      </div>
    );
  }

  // Full-screen Budget Prediction page — replaces the whole dashboard
  if (isBudgetOpen) {
    return (
      <div className="budget-page">
        <Sidebar
          onAiCoachClick={() => setIsAiCoachOpen(true)}
          onHealthClick={() => setIsHealthOpen(true)}
          onBudgetClick={() => setIsBudgetOpen(false)}
        />
        <main className="budget-main">
          <button
            type="button"
            className="btn-primary budget-back"
            onClick={() => setIsBudgetOpen(false)}
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
      <Sidebar
        onAiCoachClick={() => setIsAiCoachOpen(true)}
        onHealthClick={() => setIsHealthOpen(true)}
        onBudgetClick={() => setIsBudgetOpen(true)}
      />

      <main className="main-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="header-title">Welcome back, Rohan!</h1>
            <p className="header-subtitle">Your AI financial coach — October overview</p>
          </div>
          <div className="header-actions">
            <button type="button" className="btn-primary" onClick={() => setIsAddExpenseOpen(true)}>
              + Add Expense
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left / Middle Columns (2 cols wide on large screens) */}
          <div className="grid-left-col">
            {/* Top 2 Cards: Score & Balance */}
            <div className="two-cards-row">
              <Panel title="Financial health score" action="Read all" onAction={() => setIsHealthOpen(true)}>
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

            {/* 4 Colored Category Tiles */}
            <div className="tiles-grid">
              {initialTiles.map((tile) => (
                <StatTile
                  key={tile.label}
                  label={tile.label}
                  amount={tile.amount}
                  colorClass={tile.colorClass}
                />
              ))}
            </div>

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
