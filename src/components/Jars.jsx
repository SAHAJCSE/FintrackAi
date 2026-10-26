import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import '../proFeatures.css';

const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c'];
const defaultStarterJars = [
  { id: 'jar-emergency', name: 'Emergency fund', emoji: '🛡️', target: 50000, saved: 12500, color: COLORS[0] },
  { id: 'jar-travel', name: 'Dream trip', emoji: '✈️', target: 30000, saved: 8400, color: COLORS[1] },
  { id: 'jar-gadget', name: 'New gadget', emoji: '💻', target: 60000, saved: 18000, color: COLORS[2] },
];

function JarCard({ jar, onChange, onDelete, onDeposit }) {
  const [custom, setCustom] = useState('');
  const pct = jar.target > 0 ? Math.min(100, Math.round((jar.saved / jar.target) * 100)) : 0;

  const handleDeposit = (amount) => {
    if (onDeposit) {
      onDeposit(jar.id, amount);
    } else if (onChange) {
      onChange(jar.id, Math.max(0, jar.saved + amount));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const amount = Number(custom);
    if (!Number.isFinite(amount) || amount <= 0) return;
    handleDeposit(Math.round(amount));
    setCustom('');
  };

  return (
    <article className={`pf-jar-card ${pct >= 100 ? 'is-complete' : ''}`}>
      <div className="pf-jar-top">
        <div className="pf-jar-visual" style={{ '--jar-color': jar.color }}>
          <div className="pf-jar-liquid" style={{ height: `${pct}%`, backgroundColor: jar.color }} />
          <span>{jar.emoji}</span>
        </div>
        <button
          className="pf-icon-button"
          type="button"
          onClick={() => onDelete(jar.id)}
          aria-label={`Delete ${jar.name}`}
          title={`Delete ${jar.name}`}
        >
          ×
        </button>
      </div>

      <h3>{jar.name}</h3>

      <div className="pf-jar-amount">
        {formatCurrency(jar.saved)} <small>of {formatCurrency(jar.target)}</small>
      </div>

      <div className="pf-progress-track">
        <div style={{ width: `${pct}%`, background: jar.color }} />
      </div>

      <div className="pf-jar-meta">
        <span>{pct >= 100 ? '🎉 Goal reached!' : `${pct}% complete`}</span>
        <span>{formatCurrency(Math.max(0, jar.target - jar.saved))} left</span>
      </div>

      {pct < 100 ? (
        <>
          <div className="pf-quick-add">
            {[100, 500, 1000].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleDeposit(n)}
                title={`Deposit ₹${n} to ${jar.name}`}
              >
                +₹{n.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <form className="pf-inline-form" onSubmit={submit}>
            <input
              aria-label={`Custom deposit for ${jar.name}`}
              type="number"
              min="1"
              placeholder="Custom amount ₹"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
            <button className="btn-primary" type="submit">
              Deposit
            </button>
          </form>

          <button
            type="button"
            className="pf-text-button"
            onClick={() => handleDeposit(-500)}
            disabled={jar.saved <= 0}
          >
            Withdraw ₹500
          </button>
        </>
      ) : (
        <div className="pf-completed-actions">
          <button
            type="button"
            className="pf-text-button"
            onClick={() => handleDeposit(-1000)}
          >
            Withdraw from goal ₹1,000
          </button>
        </div>
      )}
    </article>
  );
}

export default function Jars() {
  const finance = useFinance();
  const jars = finance?.jars || defaultStarterJars;
  const updateJar = finance?.updateJar;
  const depositToJar = finance?.depositToJar;
  const addJar = finance?.addJar;
  const deleteJar = finance?.deleteJar;

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [target, setTarget] = useState('');

  const totalSaved = useMemo(() => jars.reduce((sum, j) => sum + (Number(j.saved) || 0), 0), [jars]);
  const totalTarget = useMemo(() => jars.reduce((sum, j) => sum + (Number(j.target) || 0), 0), [jars]);

  const handleJarChange = (id, newSaved) => {
    if (updateJar) {
      updateJar(id, newSaved);
    }
  };

  const handleDeposit = (id, amount) => {
    if (depositToJar) {
      depositToJar(id, amount);
    } else if (updateJar) {
      const current = jars.find((j) => j.id === id);
      if (current) {
        updateJar(id, Math.max(0, current.saved + amount));
      }
    }
  };

  const handleDeleteJar = (id) => {
    if (deleteJar) {
      deleteJar(id);
    }
  };

  const createJar = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const goal = Number(target);
    if (!cleanName || !Number.isFinite(goal) || goal <= 0) return;

    if (addJar) {
      addJar({
        name: cleanName,
        emoji,
        target: goal,
        saved: 0,
        color: COLORS[jars.length % COLORS.length],
      });
    }

    setName('');
    setTarget('');
    setEmoji('🎯');
    setShowForm(false);
  };

  return (
    <main className="pf-page">
      <header className="pf-page-heading">
        <div>
          <div className="pf-eyebrow-row">
            <span className="pf-eyebrow">SAVE WITH PURPOSE</span>
            <span className="pf-sync-badge">⚡ Live Synced with Account</span>
          </div>
          <h1>Your money jars</h1>
          <p>
            Give every goal a home. Deposits and withdrawals synchronize in real time with your
            transactions and account balance.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancel' : '+ New jar'}
        </button>
      </header>

      <section className="pf-summary-grid">
        <div className="pf-summary-card">
          <span>Total saved</span>
          <strong>{formatCurrency(totalSaved)}</strong>
          <small>Across {jars.length} active goals</small>
        </div>
        <div className="pf-summary-card">
          <span>Combined goals</span>
          <strong>{formatCurrency(totalTarget)}</strong>
          <small>Keep building, one deposit at a time</small>
        </div>
        <div className="pf-summary-card">
          <span>Overall progress</span>
          <strong>{totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0}%</strong>
          <small>{formatCurrency(Math.max(0, totalTarget - totalSaved))} to reach all goals</small>
        </div>
      </section>

      {showForm && (
        <form className="pf-create-card" onSubmit={createJar}>
          <h2>Create a savings jar</h2>
          <div className="pf-form-grid">
            <label>
              Jar name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. New laptop, Goa trip"
                required
              />
            </label>
            <label>
              Target amount (₹)
              <input
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="50000"
                required
              />
            </label>
            <label>
              Icon
              <select value={emoji} onChange={(e) => setEmoji(e.target.value)}>
                {['🎯', '✈️', '🏍️', '📱', '🎓', '💍', '🏡', '🎁', '🛡️', '💻', '🏖️', '⚡'].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="pf-create-actions">
            <button className="btn-primary" type="submit">
              Create jar
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {jars.length ? (
        <section className="pf-jars-grid">
          {jars.map((jar) => (
            <JarCard
              key={jar.id}
              jar={jar}
              onChange={handleJarChange}
              onDeposit={handleDeposit}
              onDelete={handleDeleteJar}
            />
          ))}
        </section>
      ) : (
        <div className="pf-empty-state">
          <h2>No jars yet</h2>
          <p>Create your first savings goal jar to start tracking progress.</p>
        </div>
      )}
    </main>
  );
}
