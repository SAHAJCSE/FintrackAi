import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import '../login.css';
import LanguageSelector from './LanguageSelector';
import { translate } from '../utils/i18n';

function CreateAccount({ onLogin, onBackToLogin, onBackToHome }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const handleLogin = onLogin || finance.login;
  const handleBackToLogin = onBackToLogin || (() => {
    finance.setIsRegistering(false);
    finance.navigateTo('login', '/login');
  });
  const handleBackToHome = onBackToHome || (() => finance.navigateTo('home', '/'));

  const [fullName, setFullName] = useState('');
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

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // Fast demo registration
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
            <div className="brand-logo">
              <span>FT</span>
            </div>
            <h1 className="brand-title">FinTrack AI</h1>
            <p className="brand-tagline">
              Create your free account to track, predict, and grow your wealth with AI.
            </p>

            <div className="brand-testimonial">
              <p className="testimonial-quote">
                "FinTrack AI gave me complete visibility over my personal finances from day one."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">A</div>
                <div>
                  <p className="testimonial-name">Ananya Sen</p>
                  <p className="testimonial-role">Software Engineer</p>
                </div>
              </div>
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
              <h2 className="login-title">{t('Create an account')}</h2>
              <p className="login-subtitle">
                Start tracking your finances in seconds
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

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="create-name" className="form-label">{t('Full name')}</label>
                <div className="input-wrapper">
                  <input
                    id="create-name"
                    type="text"
                    className="form-input clean-input"
                    placeholder="Rohan Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="create-email" className="form-label">{t('Email address')}</label>
                <div className="input-wrapper">
                  <input
                    id="create-email"
                    type="email"
                    className="form-input clean-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="create-password" className="form-label">{t('Password')}</label>
                <div className="input-wrapper">
                  <input
                    id="create-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input clean-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn-login ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? <><span className="spinner" />{t('Creating account…')}</> : t('Create account')}
              </button>
            </form>

            <p className="signup-prompt">
              {t('Already have an account?')}{' '}
              <button
                type="button"
                className="signup-link"
                onClick={handleBackToLogin}
              >
                {t('Sign in')}
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateAccount;
