import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useFinance } from './context/FinanceContext';
import HomePage from './components/HomePage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import NotFound from './components/NotFound';
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
import VoiceFinancePage from './components/VoiceFinancePage';
import MoneyRiver from './components/MoneyRiver';
import Jars from './components/Jars';
import Split from './components/Split';
import InstantAddBars from './components/InstantAddBars';
import Subscriptions from './components/Subscriptions';
import TransactionsPage from './components/TransactionsPage';
import ShortcutsModal from './components/ShortcutsModal';
import ShortcutsPage from './components/ShortcutsPage';
import { formatCurrency } from './utils/finance';
import { translate } from './utils/i18n';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useFinance();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useFinance();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }
  return children;
}

function App() {
  const {
    transactions,
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

    currentUser,
    isLoggedIn,
    setIsLoggedIn,
    isRegistering,
    setIsRegistering,
    logout,

    theme,
    toggleTheme,
    language,

    activePage,
    navigateTo,
    isSidebarVisible,
    isSidebarOpenMobile,
    setIsSidebarOpenMobile,
    toggleSidebar,
    isAddExpenseOpen,
    addExpenseDefaultCategory,
    openAddExpense,
    closeAddExpense,
    isShortcutsModalOpen,
    openShortcutsModal,
    closeShortcutsModal,
  } = useFinance();
  const t = (text) => translate(text, language);

  // Global Keyboard Shortcuts (working across all tabs and views)
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement
        && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

      // Dismiss modals with Escape even if typing
      if (event.key === 'Escape') {
        if (isShortcutsModalOpen) {
          closeShortcutsModal();
          return;
        }
        if (isAddExpenseOpen) {
          closeAddExpense();
          return;
        }
      }

      if (isTyping) return;

      const key = event.key ? event.key.toLowerCase() : '';
      const code = event.code || '';
      const isCtrl = event.ctrlKey || event.metaKey;
      const isAlt = event.altKey;
      const isShift = event.shiftKey;

      // 1. Showcase all shortcuts on dedicated Shortcuts page: '?' (Shift+/) or Ctrl+K or Ctrl+/
      if (
        (key === '?' || (isShift && (key === '/' || code === 'Slash'))) ||
        (isCtrl && (key === 'k' || code === 'KeyK')) ||
        (isCtrl && (key === '/' || code === 'Slash'))
      ) {
        event.preventDefault();
        if (activePage === 'shortcuts') {
          navigateTo('dashboard', '/dashboard');
        } else {
          navigateTo('shortcuts', '/shortcuts');
        }
        return;
      }

      const isKey = (letter, keyName) => (
        key === letter.toLowerCase() ||
        code === `Key${letter.toUpperCase()}` ||
        code === keyName
      );

      // Modifier combo for tab switching: (Ctrl+Alt) OR (Alt alone) OR (Ctrl+Shift)
      const isCombo = (isCtrl && isAlt) || (isAlt && !isCtrl) || (isCtrl && isShift);

      // If not logged in, any internal tab shortcut routes to login
      if (!isLoggedIn) {
        if (isCombo && (isKey('d') || isKey('s') || isKey('h') || isKey('b') || isKey('a') || isKey('c') || isKey('v') || isKey('m') || isKey('j') || isKey('p') || isKey('u') || isKey('i'))) {
          event.preventDefault();
          navigateTo('login', '/login');
        }
        return;
      }

      // Tab 1: Dashboard (Ctrl+Alt+D, Alt+D, Alt+1)
      if ((isCombo && isKey('d')) || (isAlt && (key === '1' || code === 'Digit1'))) {
        event.preventDefault();
        navigateTo('dashboard', '/dashboard');
        closeShortcutsModal();
        return;
      }

      // Tab 2: Receipt Scanner (Ctrl+Alt+S, Alt+S, Alt+2)
      if ((isCombo && isKey('s')) || (isAlt && (key === '2' || code === 'Digit2'))) {
        event.preventDefault();
        navigateTo('scanner', '/receipt-scanner');
        closeShortcutsModal();
        return;
      }

      // Tab 3: Financial Health (Ctrl+Alt+H, Alt+H, Alt+3)
      if ((isCombo && isKey('h')) || (isAlt && (key === '3' || code === 'Digit3'))) {
        event.preventDefault();
        navigateTo('health', '/health');
        closeShortcutsModal();
        return;
      }

      // Tab 4: Budget (Ctrl+Alt+B, Alt+B, Alt+4)
      if ((isCombo && isKey('b')) || (isAlt && (key === '4' || code === 'Digit4'))) {
        event.preventDefault();
        navigateTo('budget', '/budget');
        closeShortcutsModal();
        return;
      }

      // Tab 5: AI Coach (Ctrl+Alt+A, Alt+A, Alt+5)
      if ((isCombo && isKey('a')) || (isAlt && (key === '5' || code === 'Digit5'))) {
        event.preventDefault();
        navigateTo('aicoach', '/ai-coach');
        closeShortcutsModal();
        return;
      }

      // Tab 6: Activity Calendar / No-Spend Heatmap (Ctrl+Alt+C, Alt+C, Alt+6)
      if ((isCombo && isKey('c')) || (isAlt && (key === '6' || code === 'Digit6'))) {
        event.preventDefault();
        navigateTo('nospend', '/no-spend');
        closeShortcutsModal();
        return;
      }

      // Tab 7: Voice Finance (Ctrl+Alt+V, Alt+V, Alt+7)
      if ((isCombo && isKey('v')) || (isAlt && (key === '7' || code === 'Digit7'))) {
        event.preventDefault();
        navigateTo('voice', '/voice-finance');
        closeShortcutsModal();
        return;
      }

      // Tab 8: Money River (Ctrl+Alt+M, Alt+M, Alt+8)
      if ((isCombo && isKey('m')) || (isAlt && (key === '8' || code === 'Digit8'))) {
        event.preventDefault();
        navigateTo('river', '/money-river');
        closeShortcutsModal();
        return;
      }

      // Tab 9: Money Jars (Ctrl+Alt+J, Alt+J, Alt+9)
      if ((isCombo && isKey('j')) || (isAlt && (key === '9' || code === 'Digit9'))) {
        event.preventDefault();
        navigateTo('jars', '/jars');
        closeShortcutsModal();
        return;
      }

      // Tab 10: Split Bills (Ctrl+Alt+P, Alt+P, Alt+0)
      if ((isCombo && isKey('p')) || (isAlt && (key === '0' || code === 'Digit0'))) {
        event.preventDefault();
        navigateTo('split', '/split');
        closeShortcutsModal();
        return;
      }

      // Tab 11: Subscriptions (Ctrl+Alt+U, Alt+U)
      if (isCombo && isKey('u')) {
        event.preventDefault();
        navigateTo('subscriptions', '/subscriptions');
        closeShortcutsModal();
        return;
      }

      // Tab 12: Instant Add NLP (Ctrl+Alt+I, Alt+I)
      if (isCombo && isKey('i')) {
        event.preventDefault();
        navigateTo('instant-add', '/instant-add');
        closeShortcutsModal();
        return;
      }

      // All Shortcuts Directory (Ctrl+Alt+K)
      if (isCombo && isKey('k')) {
        event.preventDefault();
        navigateTo('shortcuts', '/shortcuts');
        closeShortcutsModal();
        return;
      }

      // Home landing page (Ctrl+Alt+Backspace)
      if (isCombo && (key === 'backspace' || code === 'Backspace')) {
        event.preventDefault();
        navigateTo('home', '/');
        closeShortcutsModal();
        return;
      }

      // Quick Add Transaction: "+" or "="
      if (key === '+' || key === '=') {
        event.preventDefault();
        openAddExpense('Food');
        return;
      }

      // Toggle Left Sidebar: Ctrl+B or Alt+B (without shift)
      if ((isCtrl && !isShift && isKey('b')) || (isAlt && !isCtrl && !isShift && key === 'b')) {
        event.preventDefault();
        toggleSidebar();
        return;
      }

      // Toggle Theme: Ctrl+T or Alt+T
      if (isCombo && isKey('t')) {
        event.preventDefault();
        toggleTheme();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activePage,
    isLoggedIn,
    navigateTo,
    isShortcutsModalOpen,
    isAddExpenseOpen,
    openAddExpense,
    closeAddExpense,
    openShortcutsModal,
    closeShortcutsModal,
    toggleSidebar,
    toggleTheme,
  ]);

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
    onTransactionsClick: () => navigateTo('transactions', '/transactions'),
    onHealthClick: () => navigateTo('health', '/health'),
    onBudgetClick: () => navigateTo('budget', '/budget'),
    onAiCoachClick: () => navigateTo('aicoach', '/ai-coach'),
    onReceiptScannerClick: () => navigateTo('scanner', '/receipt-scanner'),
    onNoSpendClick: () => navigateTo('nospend', '/no-spend'),
    onMoneyRiverClick: () => navigateTo('river', '/money-river'),
    onJarsClick: () => navigateTo('jars', '/jars'),
    onSplitClick: () => navigateTo('split', '/split'),
    onSubscriptionsClick: () => navigateTo('subscriptions', '/subscriptions'),
    onInstantAddClick: () => navigateTo('instant-add', '/instant-add'),
    onVoiceFinanceClick: () => navigateTo('voice', '/voice-finance'),
    onLogout: logout,
  };

  const renderWithSidebar = (pageClass, mainClass, content) => (
    <div className={pageClass}>
      {isSidebarOpenMobile && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
      )}
      <Sidebar {...sidebarProps} />
      <main className={mainClass}>
        {content}
      </main>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-container">
      {isSidebarOpenMobile && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpenMobile(false)} />
      )}
      <Sidebar {...sidebarProps} />

      <main className="main-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
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
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </button>
            <div>
              <h1 className="header-title">
                {t('Welcome back')}, {currentUser?.name?.split(' ')[0] || 'Rohan'}!
              </h1>
              <p className="header-subtitle">{t('Your AI financial coach — October overview')}</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn-secondary shortcuts-page-header-btn"
              onClick={() => navigateTo('shortcuts', '/shortcuts')}
              title={t('View keyboard shortcuts for every tab')}
            >
              ⌨️ {t('Shortcuts')}
            </button>
            <button type="button" className="btn-primary" onClick={() => openAddExpense('Food')}>
              {t('+ Add Transaction')}
            </button>
          </div>
        </header>

        {/* Dashboard Instant Add NLP Bar */}
        <div className="dashboard-instant-add-banner">
          <InstantAddBars onAddTransaction={addTransaction} />
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left / Middle Columns */}
          <div className="grid-left-col">
            <div className="two-cards-row">
              <Panel title={t('Financial health score')} action={t('Read all')} onAction={() => navigateTo('health', '/health')}>
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

              <Panel title={t('Total balance')}>
                <p className={`balance-number ${financialSummary.totalBalance < 0 ? 'text-danger' : ''}`}>
                  {formatCurrency(financialSummary.totalBalance)}
                </p>
                <div className="balance-details">
                  <div>
                    <p className="detail-label">{t('Money in')}</p>
                    <p className="detail-value text-success">
                      {formatCurrency(financialSummary.totalIncome, true)}
                    </p>
                  </div>
                  <div>
                    <p className="detail-label">{t('Money out')}</p>
                    <p className="detail-value text-danger">
                      {formatCurrency(-financialSummary.totalExpenses, true)}
                    </p>
                  </div>
                </div>
              </Panel>
            </div>

            <Panel title={t('Spending Overview')} action="Last 3 Months">
              <div className="spending-overview-grid">
                {spendingCategories.map((cat) => (
                  <SpendingCard key={cat.id} {...cat} />
                ))}
              </div>
            </Panel>

            <Panel title={t('AI spending insights')}>
              <ul className="insights-list">
                {insights.map((text) => (
                  <li key={text} className="insight-item">
                    <span className="insight-bullet"></span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <div className="two-cards-row">
              <Panel title={t('Budget prediction')}>
                <BudgetPrediction transactions={transactions} />
              </Panel>

              <Panel
                title={t('Detected subscriptions')}
                action={t('Show more')}
                onAction={() => navigateTo('subscriptions', '/subscriptions')}
              >
                <div className="list-container">
                  {subscriptions.map((item) => (
                    <ListRow
                      key={item.id || item.name}
                      {...item}
                      onDelete={() => removeSubscription(item.id || item.name)}
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
              title={t('Bill reminders')}
              action={t('Add bill')}
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

            <Panel title={t('Investment suggestions')}>
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

  return (
    <>
      {isAddExpenseOpen && (
        <AddExpense
          onClose={closeAddExpense}
          defaultCategory={addExpenseDefaultCategory}
        />
      )}
      {isShortcutsModalOpen && (
        <ShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={closeShortcutsModal}
        />
      )}

      <Routes>
        {/* Public Landing */}
        <Route
          path="/"
          element={
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
              onLogout={logout}
              theme={theme}
              onToggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
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
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
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
            </PublicOnlyRoute>
          }
        />

        {/* Authenticated Feature routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {renderDashboard()}
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt-scanner"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'receipt-scanner-page',
                'receipt-scanner-main',
                <ReceiptScanner
                  onBackToDashboard={() => navigateTo('dashboard', '/dashboard')}
                  onAddExpense={addTransaction}
                  onToggleSidebar={toggleSidebar}
                />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/voice-finance"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'voice-finance-page',
                'voice-finance-main',
                <VoiceFinancePage
                  onBackToDashboard={() => navigateTo('dashboard', '/dashboard')}
                  onToggleSidebar={toggleSidebar}
                />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-coach"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'ai-coach-page',
                'ai-coach-main',
                <>
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
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/health"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'health-page',
                'health-main',
                <>
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
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'budget-page',
                'budget-main',
                <>
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
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/no-spend"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'ns-page-wrapper',
                'ns-main-container',
                <>
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
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/money-river"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'money-river-page-wrapper',
                'money-river-main',
                <>
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
                  <MoneyRiver transactions={transactions} />
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/jars"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'jars-page-wrapper',
                'jars-main',
                <>
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
                  <Jars />
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/split"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'split-page-wrapper',
                'split-main',
                <>
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
                  <Split />
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'subscriptions-page-wrapper',
                'subscriptions-main',
                <>
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
                      className="theme-toggle-btn"
                      onClick={toggleTheme}
                      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                      {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => navigateTo('dashboard', '/dashboard')}
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <Subscriptions
                    onBackToDashboard={() => navigateTo('dashboard', '/dashboard')}
                    onToggleSidebar={toggleSidebar}
                  />
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'transactions-page-wrapper',
                'transactions-main',
                <>
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
                      className="theme-toggle-btn"
                      onClick={toggleTheme}
                      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                      {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => navigateTo('dashboard', '/dashboard')}
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <TransactionsPage
                    onBackToDashboard={() => navigateTo('dashboard', '/dashboard')}
                    onToggleSidebar={toggleSidebar}
                  />
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/instant-add"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'instant-add-page-wrapper',
                'instant-add-main',
                <>
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
                      className="theme-toggle-btn"
                      onClick={toggleTheme}
                      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                      {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => navigateTo('dashboard', '/dashboard')}
                    >
                      ← Back to Dashboard
                    </button>
                  </div>

                  <div className="instant-add-view-content">
                    <div className="instant-add-hero-header">
                      <div className="instant-hero-badge">⚡ Instant Natural Language Add</div>
                      <h1 className="instant-hero-title">Type Like You Talk</h1>
                      <p className="instant-hero-desc">
                        Add income or expense transactions in seconds with smart auto-detection of amounts, dates, and categories.
                      </p>
                    </div>

                    <div className="instant-add-card">
                      <InstantAddBars onAddTransaction={addTransaction} />
                    </div>

                    <div className="instant-recent-section">
                      <LatestTransactions
                        transactions={transactions}
                        onDeleteTransaction={deleteTransaction}
                        onEditTransaction={updateTransaction}
                        onAddTransaction={openAddExpense}
                      />
                    </div>
                  </div>
                </>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/shortcuts"
          element={
            <ProtectedRoute>
              {renderWithSidebar(
                'shortcuts-page-wrapper',
                'shortcuts-page-main',
                <ShortcutsPage
                  onBackToDashboard={() => navigateTo('dashboard', '/dashboard')}
                  onToggleSidebar={toggleSidebar}
                />
              )}
            </ProtectedRoute>
          }
        />

        {/* Aliases & Redirects */}
        <Route path="/scanner" element={<Navigate to="/receipt-scanner" replace />} />
        <Route path="/voice" element={<Navigate to="/voice-finance" replace />} />
        <Route path="/aicoach" element={<Navigate to="/ai-coach" replace />} />
        <Route path="/nospend" element={<Navigate to="/no-spend" replace />} />
        <Route path="/calendar" element={<Navigate to="/no-spend" replace />} />
        <Route path="/activity-calendar" element={<Navigate to="/no-spend" replace />} />
        <Route path="/river" element={<Navigate to="/money-river" replace />} />
        <Route path="/money-jars" element={<Navigate to="/jars" replace />} />
        <Route path="/split-bill" element={<Navigate to="/split" replace />} />
        <Route path="/split-bills" element={<Navigate to="/split" replace />} />
        <Route path="/instant" element={<Navigate to="/instant-add" replace />} />
        <Route path="/instant-bar" element={<Navigate to="/instant-add" replace />} />
        <Route path="/keyboard-shortcuts" element={<Navigate to="/shortcuts" replace />} />
        <Route path="/subscription" element={<Navigate to="/subscriptions" replace />} />
        <Route path="/recurring" element={<Navigate to="/subscriptions" replace />} />
        <Route path="/transaction" element={<Navigate to="/transactions" replace />} />
        <Route path="/all-transactions" element={<Navigate to="/transactions" replace />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
