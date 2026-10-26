import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

function VoiceFinancePage({ onBackToDashboard, onToggleSidebar }) {
  const { language, openShortcutsModal } = useFinance();
  const t = (text) => translate(text, language);

  return (
    <section className="voice-finance-content">
      <div className="view-header-bar">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title={t('Toggle Sidebar Menu')}
          aria-label={t('Toggle Sidebar Menu')}
        >
          ☰
        </button>
        <button type="button" className="btn-primary" onClick={onBackToDashboard}>
          {t('Back to Dashboard')}
        </button>
        <button
          type="button"
          className="btn-secondary scanner-shortcut shortcuts-showcase-btn"
          onClick={openShortcutsModal}
          title={t('Showcase all keyboard shortcuts (? or Ctrl+K)')}
        >
          <span className="shortcuts-btn-icon" aria-hidden="true">⌨️</span>
          <span>{t('Shortcuts')}</span>
          <kbd>Ctrl+Alt+V</kbd>
        </button>
      </div>

      <div className="voice-finance-card">
        <div className="voice-finance-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
          </svg>
        </div>
        <p className="voice-finance-status">{t('Coming soon')}</p>
        <h1>{t('Voice to Finance Management')}</h1>
        <p className="voice-finance-description">
          {t('Manage your finances using voice commands. This feature is being planned and is not available yet.')}
        </p>
        <button type="button" className="btn-primary" onClick={onBackToDashboard}>
          {t('Back to Dashboard')}
        </button>
      </div>
    </section>
  );
}

export default VoiceFinancePage;
