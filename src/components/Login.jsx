import React, { useState } from 'react';
import '../login.css';

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    setError('');
    setForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp && !form.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isSignUp && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
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
                "FinTrack AI helped me save $3,200 in just 4 months. The insights are incredible."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">K</div>
                <div>
                  <p className="testimonial-name">Kim Richards</p>
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
              <h2 className="login-title">{isSignUp ? 'Create account' : 'Welcome back'}</h2>
              <p className="login-subtitle">
                {isSignUp
                  ? 'Sign up to start tracking your finances with AI'
                  : 'Sign in to your financial dashboard'}
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name field (Sign Up only) */}
              {isSignUp && (
                <div className={`form-group ${focusedField === 'fullName' ? 'focused' : ''}`}>
                  <label htmlFor="login-fullname" className="form-label">Full name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      id="login-fullname"
                      type="text"
                      name="fullName"
                      className="form-input"
                      placeholder="Kim Richards"
                      value={form.fullName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField('')}
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
                <label htmlFor="login-email" className="form-label">Email address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
                <div className="label-row">
                  <label htmlFor="login-password" className="form-label">Password</label>
                  {!isSignUp && (
                    <button type="button" className="forgot-link">Forgot password?</button>
                  )}
                </div>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
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

              {/* Confirm Password field (Sign Up only) */}
              {isSignUp && (
                <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
                  <label htmlFor="login-confirm-password" className="form-label">Confirm password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input
                      id="login-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-input"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
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
              )}

              {error && (
                <div className="form-error" role="alert">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                id="login-submit-btn"
                type="submit"
                className={`btn-login ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner" />{isSignUp ? 'Creating account…' : 'Signing in…'}</>
                ) : (
                  isSignUp ? 'Create account' : 'Sign in'
                )}
              </button>
            </form>

            <p className="signup-prompt">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button type="button" className="signup-link" id="signin-link-btn" onClick={toggleAuthMode}>
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button type="button" className="signup-link" id="signup-link-btn" onClick={toggleAuthMode}>
                    Create one free
                  </button>
                </>
              )}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
