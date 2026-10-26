import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import '../login.css';
import LanguageSelector from './LanguageSelector';
import { translate } from '../utils/i18n';

function Login({ onLogin, onNavigateToCreateAccount, onBackToHome }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const handleLogin = onLogin || finance.login;
  const handleNavigateToCreateAccount = onNavigateToCreateAccount || (() => {
    finance.setIsRegistering(true);
    finance.navigateTo('register', '/register');
  });
  const handleBackToHome = onBackToHome || (() => finance.navigateTo('home', '/'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(val).toLowerCase().trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // Fast demo login after email authentication validation
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleLogin();
    }, 400);
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="login-wrapper">
        {/* Left branding panel */}
        <aside className="login-brand-panel">
          <div className="brand-content">
            <div className="login-sticker login-presentation-sticker">
              <h1 className="brand-title">FinTrack AI</h1>
              <p className="brand-tagline">
                Your intelligent financial coach — track, predict, and grow your wealth with AI.
              </p>
              <img
                src="/images/login-presentation.png"
                alt="Person presenting a financial chart"
              />
            </div>
          </div>
        </aside>

        {/* Right form panel */}
        <main className="login-form-panel">
          <div className="login-card">
            <div className="auth-controls">
              <button
                type="button"
                className="auth-theme-toggle"
                onClick={finance.toggleTheme}
                aria-label={finance.theme === 'dark' ? t('Switch to light mode') : t('Switch to dark mode')}
                title={finance.theme === 'dark' ? t('Switch to light mode') : t('Switch to dark mode')}
              >
                {finance.theme === 'dark' ? t('Light mode') : t('Dark mode')}
              </button>
              <LanguageSelector className="auth-language-selector" />
            </div>
            {handleBackToHome && (
              <button
                type="button"
                className="btn-back-home"
                onClick={handleBackToHome}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '16px',
                  padding: '4px 0',
                }}
              >
                ← Back to Home
              </button>
            )}
            <div className="mobile-logo">
              <div className="brand-logo brand-logo-sm"><span>FT</span></div>
              <span className="mobile-brand-name">FinTrack AI</span>
            </div>

            <div className="login-card-header">
              <h2 className="login-title">{t('Welcome back')}</h2>
              <p className="login-subtitle">
                {t('Sign in to your financial dashboard')}
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="form-error">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">{t('Email address')}</label>
                <div className="input-wrapper">
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    className="form-input clean-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="login-password" className="form-label">{t('Password')}</label>
                  <button type="button" className="forgot-link">{t('Forgot password?')}</button>
                </div>
                <div className="input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input clean-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className={`btn-login ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner" />{t('Signing in…')}</>
                ) : (
                  t('Sign in')
                )}
              </button>

              {/* Quick Demo Sign In */}
              <button
                type="button"
                className="btn-demo-quick"
                onClick={() => {
                  setEmail('rohan@example.com');
                  setPassword('password123');
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    handleLogin();
                  }, 300);
                }}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '11px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--login-border)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                Quick Demo Sign In
              </button>
            </form>

            <p className="signup-prompt">
              {t('Don’t have an account?')}{' '}
              <button
                type="button"
                className="signup-link"
                id="signup-link-btn"
                onClick={handleNavigateToCreateAccount}
              >
                {t('Create one free')}
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
