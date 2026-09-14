import React, { useState } from 'react';
import '../login.css';

function Login({ onLogin, onNavigateToCreateAccount }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fast demo login with no validation barriers
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
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
              Your intelligent financial coach — track, predict, and grow your wealth with AI.
            </p>

            <div className="brand-testimonial">
              <p className="testimonial-quote">
                "FinTrack AI helped me save ₹25,000 in just 4 months. The insights are incredible."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">R</div>
                <div>
                  <p className="testimonial-name">Rohan Sharma</p>
                  <p className="testimonial-role">Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right form panel */}
        <main className="login-form-panel">
          <div className="login-card">
            <div className="mobile-logo">
              <div className="brand-logo brand-logo-sm"><span>FT</span></div>
              <span className="mobile-brand-name">FinTrack AI</span>
            </div>

            <div className="login-card-header">
              <h2 className="login-title">Welcome back</h2>
              <p className="login-subtitle">
                Sign in to your financial dashboard
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email address</label>
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
                  <label htmlFor="login-password" className="form-label">Password</label>
                  <button type="button" className="forgot-link">Forgot password?</button>
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
                  <><span className="spinner" />Signing in…</>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="signup-prompt">
              Don't have an account?{' '}
              <button
                type="button"
                className="signup-link"
                id="signup-link-btn"
                onClick={onNavigateToCreateAccount}
              >
                Create one free
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
