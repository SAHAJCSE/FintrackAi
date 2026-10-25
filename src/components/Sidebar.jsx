import React from 'react';

function Sidebar({
  activePage = 'home',
  theme = 'dark',
  isVisible = true,
  isOpenMobile = false,
  onCloseMobile,
  onToggleTheme,
  onHomeClick,
  onDashboardClick,
  onHealthClick,
  onBudgetClick,
  onAiCoachClick,
  onReceiptScannerClick,
  onNoSpendClick,
  onLogout,
}) {
  const handleNavClick = (callback) => {
    if (callback) callback();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className={`sidebar ${!isVisible ? 'sidebar-hidden' : ''} ${isOpenMobile ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">FT</div>
        
        {/* Theme Changes Button at Top Left */}
        <button
          type="button"
          className="sidebar-theme-toggle"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => handleNavClick(onHomeClick)}
          title="Home Page"
        >
          <span className="nav-dot" />
          <span>Home</span>
        </div>

        <div
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick(onDashboardClick)}
          title="Financial Dashboard"
        >
          <span className="nav-dot" />
          <span>Dashboard</span>
        </div>

        <div
          className={`nav-item ${activePage === 'health' ? 'active' : ''}`}
          onClick={() => handleNavClick(onHealthClick)}
          title="Financial Health"
        >
          <span className="nav-dot" />
          <span>Health</span>
        </div>

        <div
          className={`nav-item ${activePage === 'budget' ? 'active' : ''}`}
          onClick={() => handleNavClick(onBudgetClick)}
          title="Budget Prediction"
        >
          <span className="nav-dot" />
          <span>Budget</span>
        </div>

        <div
          className={`nav-item ${activePage === 'aicoach' ? 'active' : ''}`}
          onClick={() => handleNavClick(onAiCoachClick)}
          title="AI Coach"
        >
          <span className="nav-dot" />
          <span>AI Coach</span>
        </div>

        <div
          className={`nav-item ${activePage === 'scanner' || activePage === 'receipt-scanner' ? 'active' : ''}`}
          onClick={() => handleNavClick(onReceiptScannerClick)}
          title="Receipt Scanner"
        >
          <span className="nav-dot" />
          <span>Scanner</span>
        </div>

        <div
          className={`nav-item ${activePage === 'nospend' || activePage === 'no-spend' || activePage === 'calendar' ? 'active' : ''}`}
          onClick={() => handleNavClick(onNoSpendClick)}
          title="Activity Calendar"
        >
          <span className="nav-dot" />
          <span>📅 Activity Calendar</span>
        </div>

        {onLogout && (
          <div
            className="nav-item"
            onClick={() => handleNavClick(onLogout)}
            title="Log Out"
            style={{ marginTop: '14px', cursor: 'pointer' }}
          >
            <span className="nav-dot" style={{ background: '#f87171' }} />
            <span style={{ color: '#f87171' }}>Logout</span>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;