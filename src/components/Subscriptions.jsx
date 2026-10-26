import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import { translate } from '../utils/i18n';
import '../proFeatures.css';

// Popular subscription presets for quick 1-click addition
const POPULAR_PRESETS = [
  { name: 'Netflix', category: 'Entertainment', amount: 649, cycle: 'monthly', plan: 'Premium 4K', icon: '🍿', color: '#e50914', paymentMethod: 'Credit Card' },
  { name: 'Spotify Premium', category: 'Entertainment', amount: 119, cycle: 'monthly', plan: 'Individual', icon: '🎵', color: '#1db954', paymentMethod: 'UPI AutoPay' },
  { name: 'JioCinema Premium', category: 'Entertainment', amount: 149, cycle: 'monthly', plan: 'Standard HD', icon: '🎬', color: '#0066f5', paymentMethod: 'UPI AutoPay' },
  { name: 'Hotstar Super', category: 'Entertainment', amount: 299, cycle: 'monthly', plan: 'Super Plan', icon: '⭐', color: '#0c2045', paymentMethod: 'Debit Card' },
  { name: 'Amazon Prime', category: 'Shopping', amount: 1499, cycle: 'yearly', plan: 'Annual Membership', icon: '📦', color: '#ff9900', paymentMethod: 'Credit Card' },
  { name: 'YouTube Premium', category: 'Entertainment', amount: 149, cycle: 'monthly', plan: 'Family / Solo', icon: '▶️', color: '#ff0000', paymentMethod: 'UPI AutoPay' },
  { name: 'ChatGPT Plus', category: 'Productivity', amount: 1999, cycle: 'monthly', plan: 'Plus Member', icon: '🤖', color: '#10a37f', paymentMethod: 'Credit Card' },
  { name: 'Cult.fit Gym', category: 'Fitness', amount: 1499, cycle: 'monthly', plan: 'Elite Pass', icon: '🏋️', color: '#ff3278', paymentMethod: 'Credit Card' },
  { name: 'Google One 100GB', category: 'Utilities', amount: 130, cycle: 'monthly', plan: 'Basic 100GB', icon: '☁️', color: '#4285f4', paymentMethod: 'Play Balance' },
];

const CATEGORIES = ['All', 'Entertainment', 'Fitness', 'Productivity', 'Utilities', 'Shopping'];

function Subscriptions({ onBackToDashboard }) {
  const finance = useFinance();
  const {
    subscriptions = [],
    addSubscription,
    updateSubscription,
    removeSubscription,
    toggleSubscriptionPause,
    renewSubscription,
    language,
  } = finance;

  const t = (text) => translate(text, language);

  // View & Filter states
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiTip, setShowAiTip] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Entertainment');
  const [formAmount, setFormAmount] = useState('');
  const [formCycle, setFormCycle] = useState('monthly');
  const [formRenewalDate, setFormRenewalDate] = useState('');
  const [formPlan, setFormPlan] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('UPI AutoPay');
  const [formIcon, setFormIcon] = useState('💳');
  const [formColor, setFormColor] = useState('#3b82f6');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const getMonthlyEquivalent = (sub) => {
    const amt = Number(sub.amount) || 0;
    if (sub.cycle === 'yearly') return Math.round(amt / 12);
    if (sub.cycle === 'quarterly') return Math.round(amt / 3);
    return amt;
  };

  const getDaysUntilRenewal = (renewalDate) => {
    if (!renewalDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(renewalDate);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    let list = [...subscriptions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (sub) =>
          sub.name?.toLowerCase().includes(q) ||
          sub.category?.toLowerCase().includes(q) ||
          sub.plan?.toLowerCase().includes(q) ||
          sub.paymentMethod?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((sub) => sub.category === selectedCategory);
    }

    // Default sort: next upcoming renewal first
    list.sort((a, b) => {
      const da = a.renewalDate ? new Date(a.renewalDate).getTime() : Infinity;
      const db = b.renewalDate ? new Date(b.renewalDate).getTime() : Infinity;
      return da - db;
    });

    return list;
  }, [subscriptions, searchQuery, selectedCategory]);

  // Key Summary Metrics
  const metrics = useMemo(() => {
    let totalMonthly = 0;
    let activeCount = 0;
    let closestRenewal = null;
    let closestDays = Infinity;
    let unusedSub = null;

    subscriptions.forEach((sub) => {
      const monthlyAmt = getMonthlyEquivalent(sub);
      if (sub.status !== 'paused') {
        totalMonthly += monthlyAmt;
        activeCount += 1;
      }

      if (sub.status === 'unused' || sub.lastUsed?.includes('40 days')) {
        unusedSub = sub;
      }

      const days = getDaysUntilRenewal(sub.renewalDate);
      if (days !== null && days >= 0 && days < closestDays && sub.status !== 'paused') {
        closestDays = days;
        closestRenewal = { ...sub, days };
      }
    });

    return {
      totalMonthly,
      totalYearly: totalMonthly * 12,
      activeCount,
      closestRenewal,
      unusedSub,
      totalCount: subscriptions.length,
    };
  }, [subscriptions]);

  const openAddModal = () => {
    setEditingSub(null);
    setFormName('');
    setFormCategory('Entertainment');
    setFormAmount('');
    setFormCycle('monthly');
    setFormRenewalDate(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
    setFormPlan('');
    setFormPaymentMethod('UPI AutoPay');
    setFormIcon('💳');
    setFormColor('#3b82f6');
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSub(sub);
    setFormName(sub.name || '');
    setFormCategory(sub.category || 'Entertainment');
    setFormAmount(sub.amount || '');
    setFormCycle(sub.cycle || 'monthly');
    setFormRenewalDate(sub.renewalDate || '');
    setFormPlan(sub.plan || '');
    setFormPaymentMethod(sub.paymentMethod || 'UPI AutoPay');
    setFormIcon(sub.icon || '💳');
    setFormColor(sub.color || '#3b82f6');
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset) => {
    setFormName(preset.name);
    setFormCategory(preset.category);
    setFormAmount(preset.amount);
    setFormCycle(preset.cycle);
    setFormPlan(preset.plan);
    setFormPaymentMethod(preset.paymentMethod);
    setFormIcon(preset.icon);
    setFormColor(preset.color);
  };

  const handleSaveSubscription = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const amountVal = Number(formAmount) || 0;

    const subPayload = {
      name: formName.trim(),
      category: formCategory,
      amount: amountVal,
      cycle: formCycle,
      renewalDate: formRenewalDate,
      plan: formPlan || 'Standard',
      paymentMethod: formPaymentMethod,
      icon: formIcon,
      color: formColor,
      note: `${formCategory} · ${formCycle}`,
      status: 'active',
      lastUsed: 'Recently added',
    };

    if (editingSub) {
      updateSubscription(editingSub.id, subPayload);
      showToast(`Updated ${subPayload.name}`);
    } else {
      addSubscription(subPayload);
      showToast(`Added ${subPayload.name}`);
    }

    setIsModalOpen(false);
  };

  const handleTogglePause = (sub) => {
    toggleSubscriptionPause(sub.id);
    const newStatus = sub.status === 'paused' ? 'resumed' : 'paused';
    showToast(`${sub.name} ${newStatus}`);
  };

  const handleDelete = (sub) => {
    if (window.confirm(`Cancel and delete ${sub.name}?`)) {
      removeSubscription(sub.id || sub.name);
      showToast(`Cancelled ${sub.name}`);
      if (editingSub) setIsModalOpen(false);
    }
  };

  const handleCancelUnused = () => {
    if (metrics.unusedSub) {
      removeSubscription(metrics.unusedSub.id || metrics.unusedSub.name);
      showToast(`Cancelled ${metrics.unusedSub.name}! Saved ₹${metrics.unusedSub.amount}/mo.`);
      setShowAiTip(false);
    }
  };

  return (
    <div className="sub-clean-container">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="sub-toast-notification">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* 1. Clear Page Header */}
      <div className="sub-clean-header">
        <div>
          <h1 className="sub-clean-title">Subscriptions</h1>
          <p className="sub-clean-desc">
            All your active memberships, streaming apps, and monthly bills in one place.
          </p>
        </div>

        <div className="sub-clean-header-actions">
          <div className="sub-clean-view-toggle">
            <button
              type="button"
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              ☰ List
            </button>
          </div>

          <button
            type="button"
            className="sub-clean-btn-primary"
            onClick={openAddModal}
          >
            + Add Subscription
          </button>
        </div>
      </div>

      {/* 2. Three Simple Overview Cards */}
      <div className="sub-clean-summary-bar">
        <div className="sub-summary-item">
          <span className="sub-summary-label">Total Monthly Cost</span>
          <div className="sub-summary-val">
            {formatCurrency(metrics.totalMonthly)} <small>/ month</small>
          </div>
          <span className="sub-summary-subtext">~{formatCurrency(metrics.totalYearly)} per year</span>
        </div>

        <div className="sub-summary-divider" />

        <div className="sub-summary-item">
          <span className="sub-summary-label">Active Subscriptions</span>
          <div className="sub-summary-val">
            {metrics.activeCount} <small>services</small>
          </div>
          <span className="sub-summary-subtext">Autopay active</span>
        </div>

        <div className="sub-summary-divider" />

        <div className="sub-summary-item">
          <span className="sub-summary-label">Next Payment Due</span>
          <div className="sub-summary-val sub-summary-highlight">
            {metrics.closestRenewal ? (
              <>
                {metrics.closestRenewal.name}
                <small>({formatCurrency(metrics.closestRenewal.amount)})</small>
              </>
            ) : (
              'None'
            )}
          </div>
          <span className="sub-summary-subtext">
            {metrics.closestRenewal
              ? `Renews in ${metrics.closestRenewal.days} days (${new Date(metrics.closestRenewal.renewalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`
              : 'No upcoming renewal'}
          </span>
        </div>
      </div>

      {/* 3. Helpful Unused Subscription Tip (Simple & Dismissable) */}
      {showAiTip && metrics.unusedSub && (
        <div className="sub-clean-ai-tip">
          <div className="sub-ai-tip-left">
            <span className="sub-ai-tip-icon">💡</span>
            <span>
              <strong>{metrics.unusedSub.name}</strong> hasn't been opened in 40 days. Cancel it to save{' '}
              <strong>{formatCurrency(metrics.unusedSub.amount)} every month</strong>.
            </span>
          </div>
          <div className="sub-ai-tip-actions">
            <button
              type="button"
              className="sub-ai-tip-btn-cancel"
              onClick={handleCancelUnused}
            >
              Cancel & Save
            </button>
            <button
              type="button"
              className="sub-ai-tip-btn-close"
              onClick={() => setShowAiTip(false)}
              title="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 4. Category Tabs & Search Bar */}
      <div className="sub-clean-filter-bar">
        <div className="sub-clean-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`sub-clean-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sub-clean-search">
          <span className="sub-search-glass">🔍</span>
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="sub-search-reset"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 5. Subscriptions Content (Clean Grid or Clean List) */}
      {filteredSubscriptions.length === 0 ? (
        <div className="sub-clean-empty">
          <p>No subscriptions found in this category.</p>
          <button
            type="button"
            className="sub-clean-btn-primary"
            onClick={openAddModal}
          >
            + Add Subscription
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="sub-clean-grid">
          {filteredSubscriptions.map((sub) => {
            const daysLeft = getDaysUntilRenewal(sub.renewalDate);
            const isPaused = sub.status === 'paused';

            return (
              <div
                key={sub.id || sub.name}
                className={`sub-clean-card ${isPaused ? 'card-paused' : ''}`}
              >
                {/* Top: Icon + Title + Status */}
                <div className="sub-card-clean-top">
                  <div className="sub-card-brand">
                    <div
                      className="sub-clean-icon"
                      style={{ backgroundColor: `${sub.color || '#3b82f6'}1a`, borderColor: `${sub.color || '#3b82f6'}33` }}
                    >
                      {sub.icon || '💳'}
                    </div>
                    <div>
                      <h3 className="sub-clean-name">{sub.name}</h3>
                      <span className="sub-clean-category">{sub.category} · {sub.plan || 'Standard'}</span>
                    </div>
                  </div>

                  <span className={`sub-clean-badge ${isPaused ? 'badge-paused' : 'badge-active'}`}>
                    {isPaused ? 'Paused' : 'Active'}
                  </span>
                </div>

                {/* Middle: Clear Price + Renewal countdown tag */}
                <div className="sub-card-clean-price">
                  <div className="sub-price-big">
                    ₹{Number(sub.amount || 0).toLocaleString('en-IN')}
                    <span className="sub-price-sub">/{sub.cycle === 'yearly' ? 'yr' : 'mo'}</span>
                  </div>

                  {daysLeft !== null && !isPaused && (
                    <span className={`sub-clean-due-tag ${daysLeft <= 2 ? 'due-urgent' : ''}`}>
                      {daysLeft === 0 ? 'Due today' : daysLeft < 0 ? 'Overdue' : `In ${daysLeft} days`}
                    </span>
                  )}
                </div>

                {/* Info: Next renewal date + payment method */}
                <div className="sub-card-clean-info">
                  <span>
                    📅 Next bill:{' '}
                    <strong>
                      {sub.renewalDate
                        ? new Date(sub.renewalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : '—'}
                    </strong>
                  </span>
                  <span>{sub.paymentMethod || 'UPI AutoPay'}</span>
                </div>

                {/* Actions: Pause/Resume + Edit */}
                <div className="sub-card-clean-actions">
                  <button
                    type="button"
                    className="sub-action-pill"
                    onClick={() => handleTogglePause(sub)}
                  >
                    {isPaused ? '▶ Resume' : '⏸ Pause'}
                  </button>
                  <button
                    type="button"
                    className="sub-action-pill"
                    onClick={() => openEditModal(sub)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className="sub-action-pill action-delete"
                    onClick={() => handleDelete(sub)}
                    title="Cancel subscription"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Minimal List Table View */
        <div className="sub-clean-table-card">
          <table className="sub-clean-table">
            <thead>
              <tr>
                <th>Subscription</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Next Billing Date</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub) => {
                const daysLeft = getDaysUntilRenewal(sub.renewalDate);
                const isPaused = sub.status === 'paused';

                return (
                  <tr key={sub.id || sub.name} className={isPaused ? 'row-paused' : ''}>
                    <td>
                      <div className="sub-table-clean-brand">
                        <span>{sub.icon || '💳'}</span>
                        <div>
                          <strong>{sub.name}</strong>
                          <span className="sub-table-plan-text">{sub.plan || 'Standard'}</span>
                        </div>
                      </div>
                    </td>
                    <td>{sub.category}</td>
                    <td>
                      <strong>₹{Number(sub.amount || 0).toLocaleString('en-IN')}</strong>
                      <small className="text-muted">/{sub.cycle === 'yearly' ? 'yr' : 'mo'}</small>
                    </td>
                    <td>
                      {sub.renewalDate
                        ? new Date(sub.renewalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                      {daysLeft !== null && !isPaused && (
                        <span className={`sub-table-due ${daysLeft <= 3 ? 'text-urgent' : ''}`}>
                          {' '}({daysLeft <= 0 ? 'due today' : `in ${daysLeft}d`})
                        </span>
                      )}
                    </td>
                    <td>{sub.paymentMethod || 'UPI AutoPay'}</td>
                    <td>
                      <span className={`sub-clean-badge ${isPaused ? 'badge-paused' : 'badge-active'}`}>
                        {isPaused ? 'Paused' : 'Active'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="sub-table-clean-actions">
                        <button
                          type="button"
                          onClick={() => handleTogglePause(sub)}
                          className="sub-table-btn"
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(sub)}
                          className="sub-table-btn"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub)}
                          className="sub-table-btn btn-del"
                          title="Delete"
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Clean Add / Edit Modal */}
      {isModalOpen && (
        <div className="sub-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="sub-clean-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal-clean-head">
              <h2>{editingSub ? `Edit ${editingSub.name}` : 'Add Subscription'}</h2>
              <button
                type="button"
                className="sub-modal-clean-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Quick 1-Click Autofill Presets */}
            {!editingSub && (
              <div className="sub-clean-presets">
                <span className="sub-presets-label">Click any to quick fill:</span>
                <div className="sub-presets-chips-row">
                  {POPULAR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      className="sub-clean-preset-pill"
                      onClick={() => handleApplyPreset(p)}
                    >
                      {p.icon} {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSubscription} className="sub-clean-form">
              <div className="sub-clean-form-row">
                <div className="sub-clean-field flex-2">
                  <label htmlFor="modal-sub-name">Service Name *</label>
                  <input
                    id="modal-sub-name"
                    type="text"
                    required
                    placeholder="e.g. Netflix, Spotify"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="sub-clean-field flex-1">
                  <label htmlFor="modal-sub-cat">Category</label>
                  <select
                    id="modal-sub-cat"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sub-clean-form-row">
                <div className="sub-clean-field flex-1">
                  <label htmlFor="modal-sub-amt">Amount (₹) *</label>
                  <input
                    id="modal-sub-amt"
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 649"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                  />
                </div>
                <div className="sub-clean-field flex-1">
                  <label htmlFor="modal-sub-cycle">Billing Frequency</label>
                  <select
                    id="modal-sub-cycle"
                    value={formCycle}
                    onChange={(e) => setFormCycle(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div className="sub-clean-field flex-1">
                  <label htmlFor="modal-sub-date">Next Renewal Date</label>
                  <input
                    id="modal-sub-date"
                    type="date"
                    value={formRenewalDate}
                    onChange={(e) => setFormRenewalDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="sub-clean-form-row">
                <div className="sub-clean-field flex-1">
                  <label htmlFor="modal-sub-plan">Plan / Tier</label>
                  <input
                    id="modal-sub-plan"
                    type="text"
                    placeholder="e.g. Premium HD"
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value)}
                  />
                </div>
                <div className="sub-clean-field flex-1">
                  <label htmlFor="modal-sub-pay">Payment Method</label>
                  <input
                    id="modal-sub-pay"
                    type="text"
                    placeholder="e.g. UPI, HDFC Card"
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                  />
                </div>
              </div>

              <div className="sub-clean-modal-foot">
                {editingSub && (
                  <button
                    type="button"
                    className="sub-clean-btn-del"
                    onClick={() => handleDelete(editingSub)}
                  >
                    Delete Subscription
                  </button>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="sub-clean-btn-ghost"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sub-clean-btn-primary"
                  >
                    {editingSub ? 'Save Changes' : 'Add Subscription'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
