import React from 'react';
import { useFinance } from '../context/FinanceContext';
import LanguageSelector from './LanguageSelector';
import { translate } from '../utils/i18n';

const navItems = [
  { label: 'Home', title: 'Go to home', page: 'home', icon: 'home', action: 'onHomeClick' },
  { label: 'Dashboard', title: 'View your financial dashboard', page: 'dashboard', icon: 'grid', action: 'onDashboardClick' },
  { label: 'Health', title: 'View financial health', page: 'health', icon: 'heart', action: 'onHealthClick' },
  { label: 'Budget', title: 'View budget prediction', page: 'budget', icon: 'chart', action: 'onBudgetClick' },
  { label: 'AI Coach', title: 'Open AI Coach', page: 'aicoach', icon: 'spark', action: 'onAiCoachClick' },
  { label: 'Scanner', title: 'Open receipt scanner', page: 'scanner', icon: 'receipt', action: 'onReceiptScannerClick' },
  { label: 'Voice Finance', title: 'Voice finance management coming soon', page: 'voice', icon: 'microphone', action: 'onVoiceFinanceClick' },
  { label: 'Activity Calendar', title: 'View activity calendar', page: 'nospend', icon: 'calendar', action: 'onNoSpendClick' },
];

function NavIcon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    grid: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></>,
    receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
    microphone: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="m8 15 2 2 5-5" /></>,
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
  const onHealthClick = props.onHealthClick || (() => finance.navigateTo('health', '/health'));
  const onBudgetClick = props.onBudgetClick || (() => finance.navigateTo('budget', '/budget'));
  const onAiCoachClick = props.onAiCoachClick || (() => finance.navigateTo('aicoach', '/ai-coach'));
  const onReceiptScannerClick = props.onReceiptScannerClick || (() => finance.navigateTo('scanner', '/receipt-scanner'));
  const onNoSpendClick = props.onNoSpendClick || (() => finance.navigateTo('nospend', '/no-spend'));
  const onLogout = props.onLogout || finance.logout;
  const t = (text) => translate(text, finance.language);

  const handleNavClick = (callback) => {
    if (callback) callback();
    if (onCloseMobile) onCloseMobile();
  };

  const actions = {
    onHomeClick,
    onDashboardClick,
    onHealthClick,
    onBudgetClick,
    onAiCoachClick,
    onReceiptScannerClick,
    onVoiceFinanceClick: props.onVoiceFinanceClick || (() => finance.navigateTo('voice', '/voice-finance')),
    onNoSpendClick,
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
          const isActive = item.page === 'nospend'
            ? ['nospend', 'no-spend', 'calendar'].includes(activePage)
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
            <span>{t('Logout')}</span>
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;