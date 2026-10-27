import React from 'react';
import { useFinance } from '../context/FinanceContext';
import LanguageSelector from './LanguageSelector';
import { translate } from '../utils/i18n';

const navItems = [
  { label: 'Home', title: 'Go to home', page: 'home', icon: 'home', action: 'onHomeClick' },
  { label: 'Dashboard', title: 'View your financial dashboard', page: 'dashboard', icon: 'grid', action: 'onDashboardClick' },
  { label: 'Transactions', title: 'View and manage all transactions', page: 'transactions', icon: 'transactions', action: 'onTransactionsClick' },
  { label: 'Health', title: 'View financial health', page: 'health', icon: 'heart', action: 'onHealthClick' },
  { label: 'Budget', title: 'View budget prediction', page: 'budget', icon: 'chart', action: 'onBudgetClick' },
  { label: 'AI Coach', title: 'Open AI Coach', page: 'aicoach', icon: 'spark', action: 'onAiCoachClick' },
  { label: 'Scanner', title: 'Open receipt scanner', page: 'scanner', icon: 'receipt', action: 'onReceiptScannerClick' },
  { label: 'Voice Finance', title: 'Voice finance management coming soon', page: 'voice', icon: 'microphone', action: 'onVoiceFinanceClick' },
  { label: 'Activity Calendar', title: 'View activity calendar', page: 'nospend', icon: 'calendar', action: 'onNoSpendClick' },
  { label: 'Money River', title: 'View your money river flow', page: 'river', icon: 'river', action: 'onMoneyRiverClick' },
  { label: 'Money Jars', title: 'Manage savings goals and jars', page: 'jars', icon: 'jar', action: 'onJarsClick' },
  { label: 'Split Bills', title: 'Track and split shared group expenses', page: 'split', icon: 'split', action: 'onSplitClick' },
  { label: 'Subscriptions', title: 'Manage all subscriptions & recurring payments', page: 'subscriptions', icon: 'subscription', action: 'onSubscriptionsClick' },
  { label: 'Instant Add', title: 'Instant natural language transaction add', page: 'instant-add', icon: 'zap', action: 'onInstantAddClick' },
];

function NavIcon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    grid: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>,
    transactions: <><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></>,
    receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
    microphone: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="m8 15 2 2 5-5" /></>,
    river: <><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></>,
    jar: <><path d="M8 3h8v2H8z" /><path d="M6 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7z" /><path d="M9 11h6M9 15h4" /></>,
    split: <><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></>,
    subscription: <><rect x="2" y="5" width="20" height="14" rx="2.5" /><line x1="2" y1="10" x2="22" y2="10" /><path d="M6 15h4" /><circle cx="17" cy="15" r="1.5" /></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  };

  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Sidebar(props) {
  const finance = useFinance();
  const activePage = props.activePage || finance.activePage;
  const theme = props.theme || finance.theme;
  const isVisible = props.isVisible !== undefined ? props.isVisible : finance.isSidebarVisible;
  const isOpenMobile = props.isOpenMobile !== undefined ? props.isOpenMobile : finance.isSidebarOpenMobile;
  const onCloseMobile = props.onCloseMobile || finance.closeMobileSidebar;
  const onToggleTheme = props.onToggleTheme || finance.toggleTheme;
  const onHomeClick = props.onHomeClick || (() => finance.navigateTo('home', '/'));
  const onDashboardClick = props.onDashboardClick || (() => finance.navigateTo('dashboard', '/dashboard'));
  const onTransactionsClick = props.onTransactionsClick || (() => finance.navigateTo('transactions', '/transactions'));
  const onHealthClick = props.onHealthClick || (() => finance.navigateTo('health', '/health'));
  const onBudgetClick = props.onBudgetClick || (() => finance.navigateTo('budget', '/budget'));
  const onAiCoachClick = props.onAiCoachClick || (() => finance.navigateTo('aicoach', '/ai-coach'));
  const onReceiptScannerClick = props.onReceiptScannerClick || (() => finance.navigateTo('scanner', '/receipt-scanner'));
  const onNoSpendClick = props.onNoSpendClick || (() => finance.navigateTo('nospend', '/no-spend'));
  const onMoneyRiverClick = props.onMoneyRiverClick || (() => finance.navigateTo('river', '/money-river'));
  const onJarsClick = props.onJarsClick || (() => finance.navigateTo('jars', '/jars'));
  const onSplitClick = props.onSplitClick || (() => finance.navigateTo('split', '/split'));
  const onSubscriptionsClick = props.onSubscriptionsClick || (() => finance.navigateTo('subscriptions', '/subscriptions'));
  const onInstantAddClick = props.onInstantAddClick || (() => finance.navigateTo('instant-add', '/instant-add'));
  const onLogout = props.onLogout || finance.logout;
  const t = (text) => translate(text, finance.language);

  const handleNavClick = (callback) => {
    if (callback) callback();
    if (onCloseMobile) onCloseMobile();
  };

  const actions = {
    onHomeClick,
    onDashboardClick,
    onTransactionsClick,
    onHealthClick,
    onBudgetClick,
    onAiCoachClick,
    onReceiptScannerClick,
    onVoiceFinanceClick: props.onVoiceFinanceClick || (() => finance.navigateTo('voice', '/voice-finance')),
    onNoSpendClick,
    onMoneyRiverClick,
    onJarsClick,
    onSplitClick,
    onSubscriptionsClick,
    onInstantAddClick,
  };

  return (
    <aside className={`sidebar ${!isVisible ? 'sidebar-hidden' : ''} ${isOpenMobile ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-logo">FT</div>
          <span>FinTrack</span>
        </div>
        <button
          type="button"
          className="sidebar-theme-toggle"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            {theme === 'dark'
              ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>
              : <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = item.page === 'transactions'
            ? ['transactions', 'transaction', 'all-transactions'].includes(activePage)
            : item.page === 'nospend'
            ? ['nospend', 'no-spend', 'calendar'].includes(activePage)
            : item.page === 'river'
            ? ['river', 'money-river'].includes(activePage)
            : item.page === 'jars'
            ? ['jars', 'money-jars'].includes(activePage)
            : item.page === 'split'
            ? ['split', 'split-bill', 'split-bills'].includes(activePage)
            : item.page === 'subscriptions'
            ? ['subscriptions', 'subscription', 'recurring'].includes(activePage)
            : item.page === 'instant-add'
            ? ['instant-add', 'instant', 'instant-bar'].includes(activePage)
            : activePage === item.page;

          return (
            <button
              type="button"
              key={item.page}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(actions[item.action])}
              title={t(item.title)}
              aria-label={t(item.title)}
              aria-current={isActive ? 'page' : undefined}
            >
              <NavIcon name={item.icon} />
              <span>{t(item.label)}</span>
            </button>
          );
        })}

        <LanguageSelector className="sidebar-language-selector" />

        {finance.currentUser && (
          <div className="sidebar-user-badge" title={finance.currentUser.email}>
            <div className="sidebar-user-avatar">
              {finance.currentUser.name ? finance.currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{finance.currentUser.name}</span>
              <span className="sidebar-user-email">{finance.currentUser.email}</span>
            </div>
          </div>
        )}

        {onLogout && (
          <button
            type="button"
            className="nav-item nav-logout"
            onClick={() => handleNavClick(onLogout)}
            title={t('Logout')}
            aria-label={t('Logout')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
            </svg>
            <span className="nav-label">{t('Logout')}</span>
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;