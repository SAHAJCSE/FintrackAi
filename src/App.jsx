import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import StatTile from './components/StatTile';
import Panel from './components/Panel';
import ListRow from './components/ListRow';

// Spending categories tiles
const initialTiles = [
  { label: 'Rent', amount: '$1410.00', colorClass: 'tile-blue' },
  { label: 'Transport', amount: '$410.00', colorClass: 'tile-pink' },
  { label: 'Health', amount: '$325.90', colorClass: 'tile-lime' },
  { label: 'Groceries', amount: '$290.13', colorClass: 'tile-amber' },
];

// AI insights
const initialInsights = [
  'You spent 72% of your monthly budget. Nice pace — keep dining under $200.',
  'Dining out is 38% above your 3-month average this week.',
  'Moving $200 on payday keeps your savings goal on track.',
];

// Subscriptions
const initialSubscriptions = [
  { name: 'Streamly Plus', note: 'Entertainment · renews 14 Oct', value: '$15.99' },
  { name: 'FitLoop Gym', note: 'Fitness · renews 02 Oct', value: '$39.00' },
  { name: 'CloudNote', note: 'Not opened in 40 days', value: '$7.99' },
];

// Bills
const initialBills = [
  { name: 'Rent', note: 'Due 03 Oct', value: '$1450' },
  { name: 'Electricity', note: 'Due 09 Oct', value: '$88' },
  { name: 'Internet', note: 'Due 17 Oct', value: '$52' },
];

// Investments
const initialInvestments = [
  { name: 'Index Diversify Fund', note: 'Balanced · moderate risk', value: '6.4% / yr', isPositive: true },
  { name: 'Tech Momentum ETF', note: 'Growth · higher risk', value: '11.2% / yr', isPositive: true },
  { name: 'Bond Ladder', note: 'Income · low risk', value: '4.1% / yr', isPositive: true },
];

// Transactions
const initialTransactions = [
  { name: 'Figma', note: '1 day ago', value: '-$300.00' },
  { name: 'Payment received', note: '1 day ago', value: '+$490.00' },
  { name: 'Webflow', note: '1 day ago', value: '-$41.00' },
  { name: 'Airbnb', note: '4 days ago', value: '-$241.65' },
  { name: 'Spotify', note: '8 days ago', value: '-$9.00' },
];


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />


      <main className="main-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="header-title">Welcome back, Kim!</h1>
            <p className="header-subtitle">Your AI financial coach — October overview</p>
          </div>
          <button type="button" className="btn-primary">
            Scan receipt
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left / Middle Columns (2 cols wide on large screens) */}
          <div className="grid-left-col">
            {/* Top 2 Cards: Score & Balance */}
            <div className="two-cards-row">
              <Panel title="Financial health score" action="Read all">
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
                <p className="balance-number">$12,530.00</p>
                <div className="balance-details">
                  <div>
                    <p className="detail-label">Money in</p>
                    <p className="detail-value text-success">+$590.00</p>
                  </div>
                  <div>
                    <p className="detail-label">Money out</p>
                    <p className="detail-value text-danger">-$660.13</p>
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
                <p className="prediction-amount">$2,410</p>
                <p className="prediction-sub">Estimated spending for the next 31 days.</p>
                <p className="prediction-warning">Possible $140 overspend on dining by week 5.</p>
              </Panel>

              <Panel title="Detected subscriptions" action="Show more">
                <div className="list-container">
                  {initialSubscriptions.map((item) => (
                    <ListRow key={item.name} {...item} />
                  ))}
                </div>
                <p className="panel-footer-note">
                  Cancel 1 unused subscription to save $7.99 a month.
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

            <Panel title="Latest transactions" action="Show more">
              <div className="list-container">
                {initialTransactions.map((item) => (
                  <ListRow key={item.name} {...item} />
                ))}
              </div>
            </Panel>

            <Panel title="Voice assistant">
              <p className="voice-text">
                Ask things like &ldquo;How much did I spend on food?&rdquo;
              </p>
              <button type="button" className="btn-voice">
                Hold to speak
              </button>
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
