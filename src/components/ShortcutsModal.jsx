import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

export const SHORTCUTS_DATA = [
  {
    category: 'Tabs & Navigation',
    items: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Overview, health score, balance & recent activity',
        primary: ['Ctrl', 'Alt', 'D'],
        alt: ['Alt', '1'],
        page: 'dashboard',
        path: '/dashboard',
        icon: '📊',
      },
      {
        id: 'transactions',
        name: 'Transactions',
        description: 'View, search, filter, edit, and delete all transactions',
        primary: ['Ctrl', 'Alt', 'T'],
        alt: ['Alt', 'T'],
        page: 'transactions',
        path: '/transactions',
        icon: '💳',
      },
      {
        id: 'scanner',
        name: 'Receipt Scanner',
        description: 'Extract and log expenses directly from receipt photos',
        primary: ['Ctrl', 'Alt', 'S'],
        alt: ['Alt', '2'],
        page: 'scanner',
        path: '/receipt-scanner',
        icon: '🧾',
      },
      {
        id: 'health',
        name: 'Financial Health',
        description: 'Comprehensive health score, liquidity & savings breakdown',
        primary: ['Ctrl', 'Alt', 'H'],
        alt: ['Alt', '3'],
        page: 'health',
        path: '/health',
        icon: '❤️',
      },
      {
        id: 'budget',
        name: 'Budget Prediction',
        description: 'Category pacing, overspend alerts & ML projections',
        primary: ['Ctrl', 'Alt', 'B'],
        alt: ['Alt', '4'],
        page: 'budget',
        path: '/budget',
        icon: '📈',
      },
      {
        id: 'aicoach',
        name: 'AI Financial Coach',
        description: 'Interactive AI coaching on spending habits and budget',
        primary: ['Ctrl', 'Alt', 'A'],
        alt: ['Alt', '5'],
        page: 'aicoach',
        path: '/ai-coach',
        icon: '✨',
      },
      {
        id: 'nospend',
        name: 'Activity Calendar',
        description: 'No-spend streak calendar and daily expense heatmaps',
        primary: ['Ctrl', 'Alt', 'C'],
        alt: ['Alt', '6'],
        page: 'nospend',
        path: '/no-spend',
        icon: '📅',
      },
      {
        id: 'voice',
        name: 'Voice Finance',
        description: 'Hands-free voice finance management & dictation',
        primary: ['Ctrl', 'Alt', 'V'],
        alt: ['Alt', '7'],
        page: 'voice',
        path: '/voice-finance',
        icon: '🎙️',
      },
      {
        id: 'river',
        name: 'Money River',
        description: 'Visual Sankey flow diagram of income, expenses, and savings',
        primary: ['Ctrl', 'Alt', 'M'],
        alt: ['Alt', '8'],
        page: 'river',
        path: '/money-river',
        icon: '🌊',
      },
      {
        id: 'jars',
        name: 'Money Jars',
        description: 'Interactive savings jars with live balance synchronization',
        primary: ['Ctrl', 'Alt', 'J'],
        alt: ['Alt', 'J'],
        page: 'jars',
        path: '/jars',
        icon: '🍯',
      },
      {
        id: 'split',
        name: 'Split Bills',
        description: 'Split shared expenses with friends and track settlements',
        primary: ['Ctrl', 'Alt', 'P'],
        alt: ['Alt', 'P'],
        page: 'split',
        path: '/split',
        icon: '👥',
      },
      {
        id: 'subscriptions',
        name: 'Subscriptions',
        description: 'Track recurring subscriptions, renewals, costs, and unused services',
        primary: ['Ctrl', 'Alt', 'U'],
        alt: ['Alt', 'U'],
        page: 'subscriptions',
        path: '/subscriptions',
        icon: '💳',
      },
      {
        id: 'instant-add',
        name: 'Instant Add',
        description: 'Natural language quick transaction adder (type like you talk)',
        primary: ['Ctrl', 'Alt', 'I'],
        alt: ['Alt', 'I'],
        page: 'instant-add',
        path: '/instant-add',
        icon: '⚡',
      },
      {
        id: 'home',
        name: 'Home / Landing',
        description: 'FinTrack AI welcome page and feature highlights',
        primary: ['Alt', '0'],
        alt: ['Ctrl', 'Alt', '0'],
        page: 'home',
        path: '/',
        icon: '🏠',
      },
    ],
  },
  {
    category: 'Actions & Tools',
    items: [
      {
        id: 'add-transaction',
        name: '+ Add Transaction',
        description: 'Quickly record an income or expense transaction',
        primary: ['Alt', 'N'],
        alt: ['Ctrl', 'Alt', 'N'],
        action: 'openAddExpense',
        icon: '➕',
      },
      {
        id: 'toggle-sidebar',
        name: 'Toggle Sidebar Menu',
        description: 'Expand or collapse the sidebar navigation',
        primary: ['Ctrl', 'B'],
        alt: ['Alt', 'M'],
        action: 'toggleSidebar',
        icon: '☰',
      },
      {
        id: 'toggle-theme',
        name: 'Toggle Theme Mode',
        description: 'Switch instantly between Dark and Light mode',
        primary: ['Alt', 'L'],
        alt: ['Ctrl', 'Alt', 'T'],
        action: 'toggleTheme',
        icon: '🌓',
      },
      {
        id: 'shortcuts-directory',
        name: 'Keyboard Shortcuts Directory',
        description: 'Dedicated guide showing all shortcut keys for every tab',
        primary: ['?'],
        alt: ['Alt', '8'],
        page: 'shortcuts',
        path: '/shortcuts',
        icon: '⌨️',
      },
      {
        id: 'escape',
        name: 'Close / Cancel',
        description: 'Dismiss any open modal, dialog or drawer',
        primary: ['Esc'],
        alt: [],
        action: 'close',
        icon: '⎋',
      },
    ],
  },
];

function ShortcutsModal({ isOpen, onClose }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return SHORTCUTS_DATA;
    const query = searchTerm.toLowerCase().trim();
    return SHORTCUTS_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.primary.some((k) => k.toLowerCase().includes(query)) ||
          item.alt.some((k) => k.toLowerCase().includes(query))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleAction = (item) => {
    if (item.page) {
      finance.navigateTo(item.page, item.path);
      onClose();
    } else if (item.action === 'openAddExpense') {
      finance.openAddExpense('Food');
      onClose();
    } else if (item.action === 'toggleSidebar') {
      finance.toggleSidebar();
    } else if (item.action === 'toggleTheme') {
      finance.toggleTheme();
    } else if (item.action === 'close') {
      onClose();
    }
  };

  return (
    <div className="shortcuts-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="shortcuts-modal-title">
      <div className="shortcuts-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="shortcuts-modal-header">
          <div className="shortcuts-header-info">
            <div className="shortcuts-badge-icon">⌨️</div>
            <div>
              <h2 id="shortcuts-modal-title" className="shortcuts-title">
                {t('Keyboard Shortcuts')}
              </h2>
              <p className="shortcuts-subtitle">
                {t('Fast navigation and power-user shortcuts for every tab')}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shortcuts-close-btn"
            onClick={onClose}
            aria-label="Close shortcuts dialog"
          >
            ✕
          </button>
        </div>

        {/* Search Filter */}
        <div className="shortcuts-search-container">
          <svg className="shortcuts-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="shortcuts-search-input"
            placeholder={t('Search shortcuts by tab name, key or action...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              className="shortcuts-search-clear"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>

        {/* Shortcuts Content List */}
        <div className="shortcuts-scroll-area">
          {filteredCategories.length === 0 ? (
            <div className="shortcuts-empty-state">
              <p>{t('No shortcuts found matching')} &quot;{searchTerm}&quot;</p>
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: '10px' }}
                onClick={() => setSearchTerm('')}
              >
                {t('Show all shortcuts')}
              </button>
            </div>
          ) : (
            filteredCategories.map((group) => (
              <div key={group.category} className="shortcuts-group">
                <h3 className="shortcuts-group-title">{t(group.category)}</h3>
                <div className="shortcuts-items-grid">
                  {group.items.map((item) => {
                    const isCurrentTab = item.page && finance.activePage === item.page;
                    return (
                      <div
                        key={item.id}
                        className={`shortcut-card ${isCurrentTab ? 'shortcut-card-active' : ''}`}
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
                        <div className="shortcut-card-left">
                          <span className="shortcut-item-icon" aria-hidden="true">{item.icon}</span>
                          <div className="shortcut-item-text">
                            <div className="shortcut-item-name-row">
                              <span className="shortcut-item-name">{t(item.name)}</span>
                              {isCurrentTab && (
                                <span className="shortcut-current-pill">{t('Active')}</span>
                              )}
                            </div>
                            <span className="shortcut-item-desc">{t(item.description)}</span>
                          </div>
                        </div>

                        <div className="shortcut-card-right">
                          <div className="shortcut-keys-wrapper">
                            {item.primary.map((k, i) => (
                              <React.Fragment key={k + i}>
                                <kbd className="shortcut-kbd">{k}</kbd>
                                {i < item.primary.length - 1 && <span className="shortcut-plus">+</span>}
                              </React.Fragment>
                            ))}
                            {item.alt && item.alt.length > 0 && (
                              <>
                                <span className="shortcut-or">or</span>
                                {item.alt.map((k, i) => (
                                  <React.Fragment key={k + i}>
                                    <kbd className="shortcut-kbd shortcut-kbd-alt">{k}</kbd>
                                    {i < item.alt.length - 1 && <span className="shortcut-plus">+</span>}
                                  </React.Fragment>
                                ))}
                              </>
                            )}
                          </div>
                          {item.page && (
                            <button
                              type="button"
                              className="shortcut-jump-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(item);
                              }}
                              title={`Jump to ${item.name}`}
                            >
                              {isCurrentTab ? '✓' : 'Go →'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="shortcuts-modal-footer">
          <div className="shortcuts-footer-tip">
            <span className="shortcuts-tip-icon">💡</span>
            <span>
              <strong>{t('Pro-tip:')}</strong> {t('Press')} <kbd className="shortcut-kbd">?</kbd> {t('anywhere to open this cheat sheet. Both')} <kbd className="shortcut-kbd">Ctrl+Alt</kbd> {t('and single-hand')} <kbd className="shortcut-kbd">Alt+Number</kbd> {t('keys are supported.')}
            </span>
          </div>
          <button type="button" className="btn-secondary shortcuts-done-btn" onClick={onClose}>
            {t('Done')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShortcutsModal;
