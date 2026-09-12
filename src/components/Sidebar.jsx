import React from 'react';

function Sidebar({
  activePage = 'home',
  theme = 'dark',
  onToggleTheme,
  onHomeClick,
  onHealthClick,
  onBudgetClick,
  onAiCoachClick,
  onReceiptScannerClick,
}) {
  return (
    <aside className="sidebar">
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
          onClick={onHomeClick}
        >
          <span className="nav-dot" />
          <span>Home</span>
        </div>

        <div
          className={`nav-item ${activePage === 'health' ? 'active' : ''}`}
          onClick={onHealthClick}
        >
          <span className="nav-dot" />
          <span>Health</span>
        </div>

        <div
          className={`nav-item ${activePage === 'budget' ? 'active' : ''}`}
          onClick={onBudgetClick}
        >
          <span className="nav-dot" />
          <span>Budget</span>
        </div>

        <div
          className={`nav-item ${activePage === 'aicoach' ? 'active' : ''}`}
          onClick={onAiCoachClick}
        >
          <span className="nav-dot" />
          <span>AI Coach</span>
        </div>

        <div
          className={`nav-item ${activePage === 'scanner' || activePage === 'receipt-scanner' ? 'active' : ''}`}
          onClick={onReceiptScannerClick}
          title="Receipt Scanner"
        >
          <span className="nav-dot" />
          <span>Scanner</span>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;