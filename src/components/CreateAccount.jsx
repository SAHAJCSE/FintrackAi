import React, { useState } from 'react';
import '../login.css';

function CreateAccount({ onLogin, onBackToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fast demo registration
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
            <div className="mobile-logo">
              <div className="brand-logo brand-logo-sm"><span>FT</span></div>
              <span className="mobile-brand-name">FinTrack AI</span>
            </div>

            <div className="login-card-header">
              <h2 className="login-title">Create an account</h2>
              <p className="login-subtitle">
                Start tracking your finances in seconds
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="create-name" className="form-label">Full name</label>
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
                <label htmlFor="create-email" className="form-label">Email address</label>
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
                <label htmlFor="create-password" className="form-label">Password</label>
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
                {loading ? <><span className="spinner" />Creating account…</> : 'Create account'}
              </button>
            </form>

            <p className="signup-prompt">
              Already have an account?{' '}
              <button
                type="button"
                className="signup-link"
                onClick={onBackToLogin}
              >
                Sign in
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateAccount;
