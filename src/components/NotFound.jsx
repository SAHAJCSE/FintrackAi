import React from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

function NotFound() {
  const { theme, language, isLoggedIn } = useFinance();
  const t = (text) => translate(text, language);

  return (
    <div className={`not-found-container ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <div className="not-found-card">
        <div className="not-found-badge">404 Error</div>
        <div className="not-found-icon" aria-hidden="true">🧭</div>
        <h1 className="not-found-title">{t('Page Not Found')}</h1>
        <p className="not-found-desc">
          {t('The page you are looking for does not exist or may have been moved.')}
        </p>

        <div className="not-found-actions">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn-primary not-found-btn">
              ← {t('Back to Dashboard')}
            </Link>
          ) : (
            <Link to="/" className="btn-primary not-found-btn">
              ← {t('Back to Home')}
            </Link>
          )}

          <Link to="/" className="btn-secondary not-found-btn">
            {t('Home Page')}
          </Link>

          {isLoggedIn && (
            <Link to="/transactions" className="btn-secondary not-found-btn">
              {t('Transactions')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotFound;
