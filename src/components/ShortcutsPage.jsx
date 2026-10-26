import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';
import { SHORTCUTS_DATA } from './ShortcutsModal';

function ShortcutsPage({ onBackToDashboard, onToggleSidebar }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const handleBack = onBackToDashboard || (() => finance.navigateTo('dashboard', '/dashboard'));
  const handleToggleSidebar = onToggleSidebar || finance.toggleSidebar;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredData = useMemo(() => {
    let list = SHORTCUTS_DATA;

    if (selectedFilter !== 'all') {
      list = list.filter((cat) => {
        if (selectedFilter === 'tabs') return cat.category.toLowerCase().includes('tab');
        if (selectedFilter === 'actions') return cat.category.toLowerCase().includes('action');
        return true;
      });
    }

    if (!searchTerm.trim()) return list;

    const query = searchTerm.toLowerCase().trim();
    return list
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.primary.some((k) => k.toLowerCase().includes(query)) ||
            item.alt.some((k) => k.toLowerCase().includes(query))
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [searchTerm, selectedFilter]);

  const handleAction = (item) => {
    if (item.page) {
      finance.navigateTo(item.page, item.path);
    } else if (item.action === 'openAddExpense') {
      finance.openAddExpense('Food');
    } else if (item.action === 'toggleSidebar') {
      finance.toggleSidebar();
    } else if (item.action === 'toggleTheme') {
      finance.toggleTheme();
    } else if (item.action === 'close') {
      handleBack();
    }
  };

  return (
    <div className="shortcuts-page-container">
      {/* Top Header Bar */}
      <div className="view-header-bar">
        {handleToggleSidebar && (
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={handleToggleSidebar}
            title={t('Toggle Sidebar Menu')}
            aria-label={t('Toggle Sidebar Menu')}
          >
            ☰
          </button>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={handleBack}
        >
          ← {t('Back to Dashboard')}
        </button>
      </div>

      {/* Hero Banner */}
      <header className="shortcuts-page-hero">
        <div className="shortcuts-hero-badge">⌨️ {t('Shortcuts Directory')}</div>
        <h1 className="shortcuts-hero-title">{t('Keyboard Shortcuts for Every Tab')}</h1>
        <p className="shortcuts-hero-subtitle">
          {t('Speed up your personal finance workflow with fast shortcuts implemented across all tabs and features.')}
        </p>

        {/* Search & Filter Controls */}
        <div className="shortcuts-controls-row">
          <div className="shortcuts-search-box">
            <svg className="shortcuts-search-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t('Search shortcuts by tab name, key or action...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shortcuts-hero-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="shortcuts-clear-btn"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className="shortcuts-filter-tabs">
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'all' ? 'filter-pill-active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              {t('All Shortcuts')}
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'tabs' ? 'filter-pill-active' : ''}`}
              onClick={() => setSelectedFilter('tabs')}
            >
              {t('Tabs & Navigation')}
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'actions' ? 'filter-pill-active' : ''}`}
              onClick={() => setSelectedFilter('actions')}
            >
              {t('Actions & Tools')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="shortcuts-page-content">
        {filteredData.length === 0 ? (
          <div className="shortcuts-no-results">
            <p>{t('No shortcuts found matching')} &quot;{searchTerm}&quot;</p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '12px' }}
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
            >
              {t('Show all shortcuts')}
            </button>
          </div>
        ) : (
          filteredData.map((group) => (
            <section key={group.category} className="shortcuts-section-block">
              <div className="shortcuts-section-header">
                <h2>{t(group.category)}</h2>
                <span className="shortcuts-count-pill">{group.items.length} {t('shortcuts')}</span>
              </div>

              <div className="shortcuts-cards-grid">
                {group.items.map((item) => {
                  const isCurrentTab = item.page && finance.activePage === item.page;
                  return (
                    <div
                      key={item.id}
                      className={`shortcut-page-card ${isCurrentTab ? 'shortcut-page-card-active' : ''}`}
                      onClick={() => handleAction(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAction(item);
                        }
                      }}
                    >
                      <div className="shortcut-page-card-header">
                        <span className="shortcut-page-icon">{item.icon}</span>
                        <div className="shortcut-page-title-box">
                          <h3 className="shortcut-page-title">
                            {t(item.name)}
                            {isCurrentTab && (
                              <span className="shortcut-current-indicator">{t('Active')}</span>
                            )}
                          </h3>
                          <p className="shortcut-page-desc">{t(item.description)}</p>
                        </div>
                      </div>

                      <div className="shortcut-page-card-footer">
                        <div className="shortcut-keys-cluster">
                          <div className="shortcut-pill-group">
                            <span className="shortcut-label-sub">{t('Primary')}:</span>
                            {item.primary.map((k, i) => (
                              <React.Fragment key={k + i}>
                                <kbd className="page-kbd">{k}</kbd>
                                {i < item.primary.length - 1 && <span className="page-plus">+</span>}
                              </React.Fragment>
                            ))}
                          </div>

                          {item.alt && item.alt.length > 0 && (
                            <div className="shortcut-pill-group">
                              <span className="shortcut-label-sub">{t('Alternate')}:</span>
                              {item.alt.map((k, i) => (
                                <React.Fragment key={k + i}>
                                  <kbd className="page-kbd page-kbd-alt">{k}</kbd>
                                  {i < item.alt.length - 1 && <span className="page-plus">+</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>

                        {item.page && (
                          <button
                            type="button"
                            className="shortcut-page-go-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(item);
                            }}
                          >
                            {isCurrentTab ? t('Currently on this tab') : `${t('Jump to tab')} →`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}

        {/* Tip Box */}
        <div className="shortcuts-info-banner">
          <div className="shortcuts-info-icon">⚡</div>
          <div>
            <h4>{t('How keyboard shortcuts work')}</h4>
            <p>
              {t('Shortcuts are active globally across the application. Both two-handed combinations (Ctrl+Alt+Key) and quick single-hand shortcuts (Alt+Number) work immediately. If you are typing inside an input field, shortcuts are safely paused to avoid interruptions.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortcutsPage;
