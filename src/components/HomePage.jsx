import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import '../home.css';

const AI_INSIGHT_SAMPLES = [
  {
    title: 'Smart Savings Opportunity',
    text: 'Moving ₹5,000 to your index fund on payday keeps your 1-year savings goal 14% ahead of schedule.',
    tag: 'Automated Advice',
  },
  {
    title: 'Discretionary Alert',
    text: 'Dining out is 38% above your 3-month average this week. Cooking dinner twice saves ₹1,400.',
    tag: 'Spending Pacing',
  },
  {
    title: 'Bill Optimization',
    text: 'Detected Hotstar Super subscription untouched for 40 days. Canceling frees ₹299/mo.',
    tag: 'Subscription Audit',
  },
  {
    title: 'Cashflow Forecast',
    text: 'BSES Electricity & Airtel Broadband bills totaling ₹2,849 are due in 4 days. Liquidity is optimal.',
    tag: 'Predictive Cashflow',
  },
];

function HomePage(props) {
  const finance = useFinance();
  const theme = props.theme || finance.theme;
  const onToggleTheme = props.onToggleTheme || finance.toggleTheme;
  const isLoggedIn = props.isLoggedIn !== undefined ? props.isLoggedIn : finance.isLoggedIn;
  const onNavigateToDashboard = props.onNavigateToDashboard || (() => {
    if (!finance.isLoggedIn) finance.navigateTo('login', '/login');
    else finance.navigateTo('dashboard', '/dashboard');
  });
  const onNavigateToLogin = props.onNavigateToLogin || (() => finance.navigateTo('login', '/login'));
  const onNavigateToScanner = props.onNavigateToScanner || (() => {
    if (!finance.isLoggedIn) finance.navigateTo('login', '/login');
    else finance.navigateTo('scanner', '/receipt-scanner');
  });
  const onNavigateToAiCoach = props.onNavigateToAiCoach || (() => {
    if (!finance.isLoggedIn) finance.navigateTo('login', '/login');
    else finance.navigateTo('aicoach', '/ai-coach');
  });
  const onLogout = props.onLogout || finance.logout;
  const [activeTipIdx, setActiveTipIdx] = useState(0);
  const [simIncome, setSimIncome] = useState(65000);
  const [simExpense, setSimExpense] = useState(38000);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate financial health gauge score on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(94);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Cycle through AI insight samples every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTipIdx((prev) => (prev + 1) % AI_INSIGHT_SAMPLES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Calculate simulated monthly savings & 1-year AI wealth boost
  const baseSavings = Math.max(0, simIncome - simExpense);
  const annualAiBoost = Math.round(baseSavings * 12 * 1.18); // 18% optimization + compounding

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`home-root ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} data-theme={theme}>
      {/* Ambient Animated Glowing Backdrop */}
      <div className="home-bg-ambient" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        <div className="home-grid-mask" />
      </div>

      {/* Sticky Floating Island Navbar */}
      <div className="home-nav-wrapper">
        <header className="home-navbar">
          {/* Brand Logo */}
          <button
            type="button"
            className="home-nav-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="brand-icon-box">
              <span>FT</span>
              <span className="brand-status-dot" title="AI Engine Live" />
            </div>
            <div className="brand-name-group">
              <span className="brand-name-title">FinTrack AI</span>
              <span className="brand-ai-badge">v2.0</span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="home-nav-links" aria-label="Main Navigation">
            <button
              type="button"
              className="home-nav-link"
              onClick={() => scrollToSection('features')}
            >
              Features
            </button>
            <button
              type="button"
              className="home-nav-link"
              onClick={() => scrollToSection('showcase')}
            >
              AI Engine
            </button>
            <button
              type="button"
              className="home-nav-link"
              onClick={() => scrollToSection('calculator')}
            >
              Wealth Simulator
            </button>
            <button
              type="button"
              className="home-nav-link"
              onClick={() => scrollToSection('stats')}
            >
              Metrics
            </button>
          </nav>

          {/* Nav Actions with Dashboard Link */}
          <div className="home-nav-actions">
            {/* Theme Toggle */}
            <button
              type="button"
              id="home-theme-toggle-btn"
              className="nav-theme-toggle"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Auth Actions */}
            {!isLoggedIn ? (
              <button
                type="button"
                className="nav-sign-in-btn"
                onClick={onNavigateToLogin}
              >
                Sign In
              </button>
            ) : (
              onLogout && (
                <button
                  type="button"
                  className="nav-sign-in-btn"
                  onClick={onLogout}
                  style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
                >
                  Logout
                </button>
              )
            )}

            {/* Standout Navbar Link to Dashboard */}
            <button
              type="button"
              className="nav-dashboard-btn"
              onClick={onNavigateToDashboard}
              title={isLoggedIn ? "Open FinTrack AI Dashboard" : "Sign in to access Dashboard"}
            >
              <span>{isLoggedIn ? 'Dashboard' : 'Sign In to Dashboard'}</span>
              <span className="nav-dashboard-arrow">→</span>
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="home-hero-section">
        {/* Animated Badge */}
        <div className="hero-pill-badge">
          <span>✨ Autonomous AI Financial Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title">
          Master your money with{' '}
          <span className="text-gradient">effortless AI intelligence.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-subtitle">
          Real-time expense tracking, predictive monthly budgets, and instant receipt
          analysis — all organized into a minimal, distraction-free interface.
        </p>

        {/* Hero Actions */}
        <div className="hero-cta-group">
          <button
            type="button"
            className="hero-primary-btn"
            onClick={onNavigateToDashboard}
          >
            <span>Go to Dashboard</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>

          {onNavigateToScanner && (
            <button
              type="button"
              className="hero-secondary-btn"
              onClick={onNavigateToScanner}
            >
              <span>🧾 Scan Receipt</span>
            </button>
          )}

          {onNavigateToAiCoach && (
            <button
              type="button"
              className="hero-secondary-btn"
              onClick={onNavigateToAiCoach}
            >
              <span>🧠 Meet AI Coach</span>
            </button>
          )}
        </div>

        {/* Trust & Highlights Row */}
        <div className="hero-trust-row">
          <div className="trust-item">
            <span>🛡️</span>
            <span>Bank-grade 256-bit Security</span>
          </div>
          <span className="trust-divider">•</span>
          <div className="trust-item">
            <span>⚡</span>
            <span>Zero-latency Categorization</span>
          </div>
          <span className="trust-divider">•</span>
          <div className="trust-item">
            <span>🔮</span>
            <span>Predictive Cashflow 30 Days Ahead</span>
          </div>
        </div>
      </section>

      {/* Interactive Animated Showcase */}
      <section className="home-showcase-container" id="showcase">
        <div className="showcase-glass-deck">
          {/* Left Column: Health Score + Spending Visualizer */}
          <div className="showcase-left-col">
            {/* Financial Health Gauge Card */}
            <div className="showcase-health-card">
              <div className="health-score-gauge">
                <svg className="gauge-svg" viewBox="0 0 100 100">
                  <circle className="gauge-bg-circle" cx="50" cy="50" r="42" />
                  <circle
                    className="gauge-progress-circle"
                    cx="50"
                    cy="50"
                    r="42"
                    style={{
                      strokeDashoffset: 264 - (264 * (animatedScore / 100)),
                    }}
                  />
                </svg>
                <div className="gauge-inner-val">
                  <span className="gauge-score-number">{animatedScore}</span>
                  <span className="gauge-score-label">Score</span>
                </div>
              </div>

              <div className="health-meta-box">
                <span className="health-meta-badge">Optimal Health</span>
                <h3 className="health-meta-title">Strong Financial Trajectory</h3>
                <p className="health-meta-desc">
                  Your savings rate is 38% above median. Discretionary spending velocity is in the healthy safe-zone.
                </p>
              </div>
            </div>

            {/* Dynamic Spending Progress Bars */}
            <div className="showcase-spending-visual">
              <div className="spending-visual-header">
                <span className="spending-visual-title">Monthly Allocations</span>
                <span className="spending-visual-total">₹41,200 Spent</span>
              </div>

              <div className="spending-bars-list">
                <div className="spending-bar-row">
                  <div className="spending-bar-info">
                    <span>Rent & Housing</span>
                    <span>₹15,000 (36%)</span>
                  </div>
                  <div className="spending-bar-track">
                    <div className="spending-bar-fill bar-fill-rent" style={{ width: '36%' }} />
                  </div>
                </div>

                <div className="spending-bar-row">
                  <div className="spending-bar-info">
                    <span>Food & Dining</span>
                    <span>₹9,960 (24%)</span>
                  </div>
                  <div className="spending-bar-track">
                    <div className="spending-bar-fill bar-fill-food" style={{ width: '24%' }} />
                  </div>
                </div>

                <div className="spending-bar-row">
                  <div className="spending-bar-info">
                    <span>Transport & Cabs</span>
                    <span>₹4,500 (11%)</span>
                  </div>
                  <div className="spending-bar-track">
                    <div className="spending-bar-fill bar-fill-transport" style={{ width: '11%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Live Stream + Recent Feeds */}
          <div className="showcase-right-col">
            {/* Live AI Stream Box */}
            <div className="ai-stream-card">
              <div className="ai-stream-header">
                <span className="ai-pulse-orb" />
                <span className="ai-stream-title">
                  {AI_INSIGHT_SAMPLES[activeTipIdx].tag}
                </span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                {AI_INSIGHT_SAMPLES[activeTipIdx].title}
              </h4>
              <p className="ai-stream-quote">
                "{AI_INSIGHT_SAMPLES[activeTipIdx].text}"
              </p>

              <div className="ai-interactive-input-row">
                {AI_INSIGHT_SAMPLES.map((sample, idx) => (
                  <button
                    key={sample.title}
                    type="button"
                    className="ai-quick-btn"
                    onClick={() => setActiveTipIdx(idx)}
                    style={{
                      borderColor: activeTipIdx === idx ? 'var(--color-primary)' : '',
                      background: activeTipIdx === idx ? 'rgba(52, 211, 153, 0.15)' : '',
                    }}
                  >
                    Tip #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini Simulated Live Activity */}
            <div className="showcase-live-feed">
              <div className="feed-header">
                <span>Recent Transactions</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>● Live Sync</span>
              </div>
              <div className="feed-list">
                <div className="feed-item">
                  <div className="feed-item-left">
                    <span>🍔</span>
                    <div>
                      <p className="feed-merchant">Swiggy Delivery</p>
                      <p className="feed-category">Food & Dining · Today</p>
                    </div>
                  </div>
                  <span className="feed-amount expense">-₹850</span>
                </div>

                <div className="feed-item">
                  <div className="feed-item-left">
                    <span>💼</span>
                    <div>
                      <p className="feed-merchant">Monthly Salary</p>
                      <p className="feed-category">Income · HDFC Bank</p>
                    </div>
                  </div>
                  <span className="feed-amount income">+₹45,000</span>
                </div>

                <div className="feed-item">
                  <div className="feed-item-left">
                    <span>🎬</span>
                    <div>
                      <p className="feed-merchant">Netflix Subscription</p>
                      <p className="feed-category">Entertainment · Auto-debit</p>
                    </div>
                  </div>
                  <span className="feed-amount expense">-₹649</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="home-features-section" id="features">
        <div className="section-header-centered">
          <p className="section-eyebrow">Engineered for Precision</p>
          <h2 className="section-title">Everything you need to master your wealth</h2>
          <p className="section-subtitle">
            Say goodbye to messy spreadsheets. FinTrack AI acts as your vigilant co-pilot 24/7.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Autonomous Tracking */}
          <div className="bento-card bento-col-7">
            <div className="bento-icon-box">⚡</div>
            <h3 className="bento-card-title">Autonomous Categorization</h3>
            <p className="bento-card-desc">
              Every Swiggy meal, Uber ride, or utility bill is automatically categorized into
              10+ granular buckets in milliseconds with 99.4% classification accuracy.
            </p>
            <span className="bento-badge-tag">Zero-Manual Entry</span>
          </div>

          {/* Card 2: AI Coach */}
          <div className="bento-card bento-col-5">
            <div className="bento-icon-box">🧠</div>
            <h3 className="bento-card-title">Context-Aware AI Coach</h3>
            <p className="bento-card-desc">
              Receive smart conversational advice tailored directly to your cash flow, upcoming bills,
              and retirement timelines.
            </p>
            <span className="bento-badge-tag">Adaptive Model</span>
          </div>

          {/* Card 3: Optical Receipt Scanner */}
          <div className="bento-card bento-col-5">
            <div className="bento-icon-box">🧾</div>
            <h3 className="bento-card-title">Instant Receipt Scanner</h3>
            <p className="bento-card-desc">
              Snap or drag paper bills and digital invoices. Our multi-engine OCR parses merchants,
              line items, and taxes in under 1.2 seconds.
            </p>
            <span className="bento-badge-tag">Multi-Currency OCR</span>
          </div>

          {/* Card 4: Predictive Budgeting */}
          <div className="bento-card bento-col-7">
            <div className="bento-icon-box">🔮</div>
            <h3 className="bento-card-title">Predictive Budget Forecasting</h3>
            <p className="bento-card-desc">
              Anticipate cash shortages weeks before they happen. Our predictive algorithms model
              your end-of-month liquidity using spending velocity metrics.
            </p>
            <span className="bento-badge-tag">30-Day Forward Forecast</span>
          </div>
        </div>
      </section>

      {/* Interactive Wealth Simulator */}
      <section className="home-calculator-section" id="calculator">
        <div className="calculator-card">
          <div className="calc-left">
            <p className="section-eyebrow">Interactive Simulator</p>
            <h3>Project your wealth growth</h3>
            <p>Adjust your monthly cash flow to see the compounding advantage of FinTrack AI optimization.</p>

            <div className="calc-slider-group">
              <div className="calc-slider-header">
                <span>Monthly Income</span>
                <span style={{ color: '#34d399' }}>₹{simIncome.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                className="calc-range-input"
                min="20000"
                max="250000"
                step="5000"
                value={simIncome}
                onChange={(e) => setSimIncome(Number(e.target.value))}
              />
            </div>

            <div className="calc-slider-group">
              <div className="calc-slider-header">
                <span>Monthly Expenses</span>
                <span style={{ color: '#f87171' }}>₹{simExpense.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                className="calc-range-input"
                min="10000"
                max="200000"
                step="5000"
                value={simExpense}
                onChange={(e) => setSimExpense(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="calc-right">
            <p className="calc-result-label">Projected 1-Year Wealth Gain</p>
            <p className="calc-result-number">₹{annualAiBoost.toLocaleString('en-IN')}</p>
            <p className="calc-result-note">
              Based on your base ₹{baseSavings.toLocaleString('en-IN')}/mo surplus plus FinTrack AI's
              average 18% leak-reduction and smart capital allocation.
            </p>
            <button
              type="button"
              className="hero-primary-btn"
              style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
              onClick={onNavigateToDashboard}
            >
              Start Tracking in Dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* Key Numbers / Proof Ribbon */}
      <section className="home-stats-ribbon" id="stats">
        <div className="stats-grid">
          <div className="stat-box">
            <p className="stat-box-val">₹2.4 Cr+</p>
            <p className="stat-box-label">Transactions Monitored</p>
          </div>
          <div className="stat-box">
            <p className="stat-box-val">99.4%</p>
            <p className="stat-box-label">AI Categorization</p>
          </div>
          <div className="stat-box">
            <p className="stat-box-val">&lt; 1.2s</p>
            <p className="stat-box-label">Receipt OCR Speed</p>
          </div>
          <div className="stat-box">
            <p className="stat-box-val">4.9 / 5</p>
            <p className="stat-box-label">User Rating</p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="home-cta-banner-section">
        <div className="cta-banner-card">
          <h2 className="cta-banner-title">Ready to take command of your finances?</h2>
          <p className="cta-banner-sub">
            Join thousands of professionals mastering their cashflow with FinTrack AI.
            Instant setup — explore the dashboard now.
          </p>
          <button
            type="button"
            className="hero-primary-btn"
            onClick={onNavigateToDashboard}
          >
            <span>Launch Dashboard Now</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-brand">FinTrack AI</span>
            <span className="footer-status-pill">
              <span>●</span>
              <span>All AI Engines Operational</span>
            </span>
          </div>

          <div className="footer-links">
            <button
              type="button"
              className="footer-link-btn"
              onClick={onNavigateToDashboard}
            >
              Dashboard
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={onNavigateToScanner}
            >
              Receipt Scanner
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={onNavigateToAiCoach}
            >
              AI Coach
            </button>
            {!isLoggedIn ? (
              <button
                type="button"
                className="footer-link-btn"
                onClick={onNavigateToLogin}
              >
                Sign In
              </button>
            ) : (
              <button
                type="button"
                className="footer-link-btn"
                onClick={onLogout}
                style={{ color: '#f87171' }}
              >
                Logout
              </button>
            )}
          </div>

          <p className="footer-copyright">
            © {new Date().getFullYear()} FinTrack AI. Designed for financial freedom.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
