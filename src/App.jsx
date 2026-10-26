import React from 'react';
import { useFinance } from './context/FinanceContext';
import HomePage from './components/HomePage';
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
import NoSpendHeatmap from './components/NoSpendHeatmap';
import { formatCurrency } from './utils/finance';

function App() {
  const {
    transactions,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    financialSummary,
    spendingCategories,
    billReminders,
    subscriptions,
    investments,
    insights,
    markBillPaid,
    removeBill,
    removeSubscription,

    isLoggedIn,
    setIsLoggedIn,
    isRegistering,
    setIsRegistering,
    login,
    logout,

    theme,
    toggleTheme,

    activePage,
    navigateTo,
    isSidebarVisible,
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
  } = useFinance();

  // 1. Dedicated Minimal Animated Home Page (Public Landing - Shown before login)
  if (activePage === 'home') {
    return (
      <HomePage
        onNavigateToDashboard={() => {
          if (!isLoggedIn) {
            navigateTo('login', '/login');
          } else {
            navigateTo('dashboard', '/dashboard');
          }
        }}
        onNavigateToLogin={() => navigateTo('login', '/login')}
        onNavigateToScanner={() => {
          if (!isLoggedIn) {
            navigateTo('login', '/login');
          } else {
            navigateTo('scanner', '/receipt-scanner');
          }
        }}
        onNavigateToAiCoach={() => {
          if (!isLoggedIn) {
            navigateTo('login', '/login');
          } else {
            navigateTo('aicoach', '/ai-coach');
          }
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          navigateTo('home', '/');
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  // 2. Authentication Gate: If not logged in, user MUST sign in before seeing Dashboard & features
  if (!isLoggedIn) {
    if (activePage === 'register' || isRegistering) {
      return (
        <CreateAccount
          onLogin={() => {
            setIsLoggedIn(true);
            setIsRegistering(false);
            navigateTo('dashboard', '/dashboard');
          }}
          onBackToLogin={() => {
            setIsRegistering(false);
            navigateTo('login', '/login');
          }}
          onBackToHome={() => navigateTo('home', '/')}
        />
      );
    }
    return (
      <Login
        onLogin={() => {
          setIsLoggedIn(true);
          navigateTo('dashboard', '/dashboard');
        }}
        onNavigateToCreateAccount={() => {
          setIsRegistering(true);
          navigateTo('register', '/register');
        }}
        onBackToHome={() => navigateTo('home', '/')}
      />
    );
  }

  // Common navigation handlers for Sidebar (Authenticated session)
  const sidebarProps = {
    activePage: activePage === 'home' ? 'home' : (activePage === 'dashboard' ? 'dashboard' : activePage),
    theme,
    isVisible: isSidebarVisible,
    isOpenMobile: isSidebarOpenMobile,
    onCloseMobile: () => setIsSidebarOpenMobile(false),
    onToggleTheme: toggleTheme,
    onHomeClick: () => navigateTo('home', '/'),
    onDashboardClick: () => navigateTo('dashboard', '/dashboard'),
    onHealthClick: () => navigateTo('health', '/health'),
    onBudgetClick: () => navigateTo('budget', '/budget'),
    onAiCoachClick: () => navigateTo('aicoach', '/ai-coach'),
    onReceiptScannerClick: () => navigateTo('scanner', '/receipt-scanner'),
    onNoSpendClick: () => navigateTo('nospend', '/no-spend'),
    onLogout: () => {
      setIsLoggedIn(false);
      navigateTo('home', '/');
    },
  };

  // Dedicated Receipt Scanner page
  if (activePage === 'scanner') {
    return (
      <div className="receipt-scanner-page">
        {isSidebarOpenMobile && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
        )}
        <Sidebar {...sidebarProps} />
        <main className="receipt-scanner-main">
          <ReceiptScanner
            onBackToDashboard={() => navigateTo('dashboard', '/dashboard')}
            onAddExpense={addTransaction}
            onToggleSidebar={toggleSidebar}
          />
        </main>
      </div>
    );
  }

  // Full-screen AI Coach page
  if (activePage === 'aicoach') {
    return (
      <div className="ai-coach-page">
        {isSidebarOpenMobile && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
        )}
        <Sidebar {...sidebarProps} />
        <main className="ai-coach-main">
          <div className="view-header-bar">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              title="Toggle Sidebar Menu"
            >
              ☰
            </button>
            <button
              type="button"
              className="btn-primary ai-coach-back"
              onClick={() => navigateTo('dashboard', '/dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
          <AiCoach transactions={transactions} />
        </main>
      </div>
    );
  }

  // Full-screen Financial Health page
  if (activePage === 'health') {
    return (
      <div className="health-page">
        {isSidebarOpenMobile && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
        )}
        <Sidebar {...sidebarProps} />
        <main className="health-main">
          <div className="view-header-bar">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              title="Toggle Sidebar Menu"
            >
              ☰
            </button>
            <button
              type="button"
              className="btn-primary health-back"
              onClick={() => navigateTo('dashboard', '/dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
          <FinancialHealth transactions={transactions} />
        </main>
      </div>
    );
  }

  // Full-screen Budget Prediction page
  if (activePage === 'budget') {
    return (
      <div className="budget-page">
        {isSidebarOpenMobile && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
        )}
        <Sidebar {...sidebarProps} />
        <main className="budget-main">
          <div className="view-header-bar">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              title="Toggle Sidebar Menu"
            >
              ☰
            </button>
            <button
              type="button"
              className="btn-primary budget-back"
              onClick={() => navigateTo('dashboard', '/dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
          <BudgetPrediction transactions={transactions} />
        </main>
      </div>
    );
  }

  // Isolated No-Spend Streak Heatmap page
  if (activePage === 'nospend') {
    return (
      <div className="ns-page-wrapper">
        {isSidebarOpenMobile && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
        )}
        <Sidebar {...sidebarProps} />
        <main className="ns-main-container">
          <div className="view-header-bar">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              title="Toggle Sidebar Menu"
            >
              ☰
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigateTo('dashboard', '/dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
          <NoSpendHeatmap
            transactions={transactions}
            onAddExpense={addTransaction}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {isSidebarOpenMobile && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
      )}
      {isAddExpenseOpen && (
        <AddExpense
          onClose={closeAddExpense}
          defaultCategory={addExpenseDefaultCategory}
        />
      )}
      <Sidebar {...sidebarProps} />

      <main className="main-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            {/* Universal Sidebar Toggle Icon Button */}
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              title="Toggle Sidebar Menu"
            >
              ☰
            </button>

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
              onClick={() => navigateTo('home', '/')}
              title="Return to Home Landing Page"
            >
              🏠 Home
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigateTo('scanner', '/receipt-scanner')}
            >
              🧾 Scan Receipt
            </button>
            <button type="button" className="btn-primary" onClick={() => openAddExpense('Food')}>
              + Add Transaction
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsLoggedIn(false);
                navigateTo('home', '/');
              }}
              title="Log out of FinTrack AI"
              style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
            >
              Logout
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
                {insights.map((text) => (
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
                {subscriptions.map((item) => (
                  <ListRow
                    key={item.name}
                    {...item}
                    onDelete={() => removeSubscription(item.name)}
                  />
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
            <Panel
              title="Bill reminders"
              action="Add bill"
              onAction={() => openAddExpense('Bills')}
            >
              <div className="list-container">
                {billReminders.map((item) => (
                  <ListRow
                    key={item.id}
                    {...item}
                    onPaid={() => markBillPaid(item.id)}
                    onDelete={() => removeBill(item.id)}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Investment suggestions">
              <div className="list-container">
                {investments.map((item) => (
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
