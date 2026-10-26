import React, { useEffect, useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import '../proFeatures.css';

const defaultSeedGroups = [
  {
    id: 'group-flat',
    name: 'Flatmates',
    emoji: '🏠',
    members: ['You', 'Priya', 'Arjun'],
    expenses: [
      { id: 'e1', title: 'Groceries', amount: 1800, paidBy: 'You', splitAmong: ['You', 'Priya', 'Arjun'], date: '2026-10-20' },
      { id: 'e2', title: 'Wi-Fi bill', amount: 1200, paidBy: 'Priya', splitAmong: ['You', 'Priya', 'Arjun'], date: '2026-10-21' },
    ],
  },
  {
    id: 'group-trip',
    name: 'Weekend trip',
    emoji: '🏖️',
    members: ['You', 'Kabir', 'Neha'],
    expenses: [],
  },
];

function readLocalGroups() {
  try {
    const value = localStorage.getItem('fintrack-pro-split');
    return value ? JSON.parse(value) : defaultSeedGroups;
  } catch {
    return defaultSeedGroups;
  }
}

function settleGroup(group) {
  const balances = Object.fromEntries(group.members.map((name) => [name, 0]));

  group.expenses.forEach((e) => {
    if (e.type === 'settle') {
      balances[e.from] = (balances[e.from] || 0) + e.amount;
      balances[e.to] = (balances[e.to] || 0) - e.amount;
      return;
    }
    if (!e.splitAmong?.length) return;
    const share = e.amount / e.splitAmong.length;
    balances[e.paidBy] = (balances[e.paidBy] || 0) + e.amount;
    e.splitAmong.forEach((name) => {
      balances[name] = (balances[name] || 0) - share;
    });
  });

  Object.keys(balances).forEach((name) => {
    balances[name] = Math.round(balances[name] * 100) / 100;
  });

  const debtors = Object.entries(balances)
    .filter(([, v]) => v < -0.5)
    .map(([name, value]) => ({ name, amount: -value }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.entries(balances)
    .filter(([, v]) => v > 0.5)
    .map(([name, value]) => ({ name, amount: value }))
    .sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);
    transfers.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount: Math.round(amount * 100) / 100,
    });
    debtors[i].amount -= amount;
    creditors[j].amount -= amount;
    if (debtors[i].amount < 0.5) i++;
    if (creditors[j].amount < 0.5) j++;
  }

  return { balances, transfers };
}

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

export default function Split() {
  const finance = useFinance();
  const contextGroups = finance?.splitGroups;
  const setContextGroups = finance?.setSplitGroups;
  const addTransaction = finance?.addTransaction;

  const [localGroups, setLocalGroups] = useState(readLocalGroups);
  const groups = contextGroups || localGroups;
  const setGroups = setContextGroups || setLocalGroups;

  const [activeId, setActiveId] = useState(() => groups[0]?.id || null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [membersText, setMembersText] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [splitAmong, setSplitAmong] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('fintrack-pro-split', JSON.stringify(groups));
    } catch {
      // ignore
    }
  }, [groups]);

  const group = groups.find((g) => g.id === activeId) || groups[0];
  const result = useMemo(() => (group ? settleGroup(group) : null), [group]);
  const total = group
    ? group.expenses.filter((e) => e.type !== 'settle').reduce((sum, e) => sum + e.amount, 0)
    : 0;

  useEffect(() => {
    if (group && !group.members.includes(paidBy)) {
      setPaidBy(group.members[0] || 'You');
    }
    if (group && splitAmong.length === 0) {
      setSplitAmong(group.members);
    }
  }, [group?.id]);

  const createGroup = (e) => {
    e.preventDefault();
    const friends = [
      ...new Set(
        membersText
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      ),
    ].filter((x) => x.toLowerCase() !== 'you');

    if (!groupName.trim() || !friends.length) return;

    const g = {
      id: `group-${uid()}`,
      name: groupName.trim(),
      emoji: '👥',
      members: ['You', ...friends],
      expenses: [],
    };

    setGroups((prev) => [...prev, g]);
    setActiveId(g.id);
    setGroupName('');
    setMembersText('');
    setShowGroupForm(false);
    setShowExpenseForm(false);
    setSplitAmong(g.members);
    setPaidBy('You');
    setNotice(`Group "${g.name}" created.`);
    setTimeout(() => setNotice(''), 2800);
  };

  const addExpense = (e) => {
    e.preventDefault();
    const n = Number(amount);
    if (!title.trim() || !Number.isFinite(n) || n <= 0 || !splitAmong.length) return;

    const expenseItem = {
      id: uid(),
      title: title.trim(),
      amount: n,
      paidBy,
      splitAmong,
      date: new Date().toISOString().slice(0, 10),
    };

    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id
          ? {
              ...g,
              expenses: [expenseItem, ...g.expenses],
            }
          : g
      )
    );

    // Live Sync: If "You" paid for the expense, log it to the app's real transactions
    if (paidBy === 'You' && addTransaction) {
      addTransaction({
        merchant: `${title.trim()} (${group.name})`,
        amount: -n,
        category: 'Bills',
        date: new Date().toISOString().slice(0, 10),
      });
    }

    setTitle('');
    setAmount('');
    setShowExpenseForm(false);
    setNotice('Expense recorded and balances updated.');
    setTimeout(() => setNotice(''), 2800);
  };

  const markPaid = (t) => {
    const settleItem = {
      id: uid(),
      type: 'settle',
      title: `${t.from} paid ${t.to}`,
      amount: t.amount,
      from: t.from,
      to: t.to,
      date: new Date().toISOString().slice(0, 10),
    };

    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id
          ? {
              ...g,
              expenses: [settleItem, ...g.expenses],
            }
          : g
      )
    );

    // Live Sync: If settlement involves "You", adjust account balance live
    if (addTransaction) {
      if (t.to === 'You') {
        addTransaction({
          merchant: `Settlement from ${t.from} (${group.name})`,
          amount: t.amount,
          category: 'Income',
          date: new Date().toISOString().slice(0, 10),
        });
      } else if (t.from === 'You') {
        addTransaction({
          merchant: `Settlement to ${t.to} (${group.name})`,
          amount: -t.amount,
          category: 'Bills',
          date: new Date().toISOString().slice(0, 10),
        });
      }
    }

    setNotice(`${t.from} → ${t.to} marked paid.`);
    setTimeout(() => setNotice(''), 2800);
  };

  const copySummary = async () => {
    const lines = result.transfers.length
      ? result.transfers.map((t) => `${t.from} pays ${t.to} ${formatCurrency(t.amount)}`).join('\n')
      : 'Everyone is settled up!';
    const summary = `${group.name} — split summary\nTotal spent: ${formatCurrency(total)}\n${lines}`;

    try {
      await navigator.clipboard.writeText(summary);
      setNotice('Settlement summary copied.');
    } catch {
      setNotice(summary);
    }
    setTimeout(() => setNotice(''), 5000);
  };

  return (
    <main className="pf-page">
      <header className="pf-page-heading">
        <div>
          <div className="pf-eyebrow-row">
            <span className="pf-eyebrow">FRIENDS · TRIPS · FLATMATES</span>
            <span className="pf-sync-badge">⚡ Live Synced with Account</span>
          </div>
          <h1>Split the bill, not the friendship.</h1>
          <p>
            Track shared expenses, automatically calculate minimal debt transfers, and see exactly
            who owes whom.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowGroupForm((v) => !v)}
        >
          {showGroupForm ? 'Cancel' : '+ New group'}
        </button>
      </header>

      {showGroupForm && (
        <form className="pf-create-card" onSubmit={createGroup}>
          <h2>Create a group</h2>
          <div className="pf-form-grid">
            <label>
              Group name
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Manali trip, Flat 402"
                required
              />
            </label>
            <label>
              Friends (comma separated)
              <input
                value={membersText}
                onChange={(e) => setMembersText(e.target.value)}
                placeholder="Riya, Karan, Sam"
                required
              />
            </label>
          </div>
          <p className="pf-helper">You are added automatically. Add at least one friend.</p>
          <div className="pf-create-actions">
            <button className="btn-primary" type="submit">
              Create group
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowGroupForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="pf-group-tabs">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={g.id === group?.id ? 'active' : ''}
            onClick={() => {
              setActiveId(g.id);
              setShowExpenseForm(false);
              setSplitAmong(g.members);
              setPaidBy(g.members[0] || 'You');
            }}
          >
            {g.emoji} {g.name}
          </button>
        ))}
      </div>

      {!group ? (
        <div className="pf-empty-state">
          <h2>No groups yet</h2>
          <p>Create a group to start splitting expenses.</p>
        </div>
      ) : (
        <>
          <section className="pf-summary-grid pf-split-summary">
            <div className="pf-summary-card">
              <span>Total shared spend</span>
              <strong>{formatCurrency(total)}</strong>
              <small>
                {group.expenses.filter((e) => e.type !== 'settle').length} shared expenses
              </small>
            </div>
            <div className="pf-summary-card">
              <span>People in group</span>
              <strong>{group.members.length}</strong>
              <small>{group.members.join(' · ')}</small>
            </div>
            <div className="pf-summary-card">
              <span>Payments to settle</span>
              <strong>{result.transfers.length}</strong>
              <small>
                {result.transfers.length
                  ? 'A few transfers can settle the group'
                  : 'Everyone is settled up 🎉'}
              </small>
            </div>
          </section>

          {notice && (
            <div className="pf-notice" role="status">
              {notice}
            </div>
          )}

          <section className="pf-split-grid">
            <article className="pf-feature-card">
              <div className="pf-card-heading">
                <div>
                  <span className="pf-eyebrow">GROUP BALANCES</span>
                  <h2>Who owes whom</h2>
                </div>
                <span className="pf-count-pill">{group.members.length} members</span>
              </div>
              <ul className="pf-balance-list">
                {group.members.map((name) => {
                  const value = result.balances[name] || 0;
                  const maxAbs = Math.max(1, ...Object.values(result.balances).map(Math.abs));
                  const barWidth = Math.min(100, (Math.abs(value) / maxAbs) * 100);

                  return (
                    <li key={name}>
                      <div className="pf-avatar">{name.trim().charAt(0).toUpperCase()}</div>
                      <div className="pf-balance-person">
                        <strong>{name}</strong>
                        <div className="pf-balance-track">
                          <span
                            className={value >= 0 ? 'positive' : 'negative'}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                      <div
                        className={`pf-balance-value ${
                          value > 0.5 ? 'positive' : value < -0.5 ? 'negative' : ''
                        }`}
                      >
                        <strong>
                          {value > 0 ? '+' : ''}
                          {formatCurrency(value)}
                        </strong>
                        <small>
                          {value > 0.5 ? 'gets back' : value < -0.5 ? 'owes' : 'settled'}
                        </small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>

            <article className="pf-feature-card">
              <div className="pf-card-heading">
                <div>
                  <span className="pf-eyebrow">SUGGESTED TRANSFERS</span>
                  <h2>Settle up</h2>
                </div>
                <span className="pf-count-pill">{result.transfers.length} payments</span>
              </div>

              {result.transfers.length === 0 ? (
                <div className="pf-settled">
                  <span className="pf-settled-emoji">🎉</span>
                  <strong>All settled!</strong>
                  <p>There are no outstanding payments in this group.</p>
                </div>
              ) : (
                <ul className="pf-transfer-list">
                  {result.transfers.map((t) => (
                    <li key={`${t.from}-${t.to}-${t.amount}`}>
                      <div className="pf-avatar">{t.from[0].toUpperCase()}</div>
                      <div className="pf-transfer-details">
                        <p>
                          <strong>{t.from}</strong> pays <strong>{t.to}</strong>
                        </p>
                        <small>Suggested settlement</small>
                      </div>
                      <strong className="pf-transfer-amount">{formatCurrency(t.amount)}</strong>
                      <button
                        type="button"
                        className="pf-small-button"
                        onClick={() => markPaid(t)}
                      >
                        Mark paid
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pf-share-actions">
                <button
                  type="button"
                  className="btn-secondary pf-copy-button"
                  onClick={copySummary}
                >
                  ↗ Copy settlement summary
                </button>
                <a
                  className="btn-secondary pf-copy-button"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${group.name} — settle up\nTotal spent: ${formatCurrency(total)}\n${
                      result.transfers.length
                        ? result.transfers.map((t) => `${t.from} pays ${t.to} ${formatCurrency(t.amount)}`).join('\n')
                        : 'Everyone is settled up!'
                    }`
                  )}`}
                >
                  Share on WhatsApp ↗
                </a>
              </div>
            </article>
          </section>

          <section className="pf-feature-card pf-expenses-card">
            <div className="pf-card-heading">
              <div>
                <span className="pf-eyebrow">ACTIVITY</span>
                <h2>Group expenses</h2>
              </div>
              <div className="pf-heading-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowExpenseForm((v) => !v)}
                >
                  {showExpenseForm ? 'Cancel' : '+ Add expense'}
                </button>
                <button
                  type="button"
                  className="pf-delete-group"
                  onClick={() => {
                    const next = groups.filter((g) => g.id !== group.id);
                    setGroups(next);
                    setActiveId(next[0]?.id || null);
                    setShowExpenseForm(false);
                  }}
                >
                  Delete group
                </button>
              </div>
            </div>

            {showExpenseForm && (
              <form className="pf-create-card pf-expense-form" onSubmit={addExpense}>
                <div className="pf-form-grid">
                  <label>
                    What was it for?
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Dinner, cab, tickets…"
                      required
                    />
                  </label>
                  <label>
                    Amount (₹)
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1200"
                      required
                    />
                  </label>
                  <label>
                    Paid by
                    <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                      {group.members.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="pf-members-picker">
                  <strong>Split equally between:</strong>
                  <div className="pf-checkbox-row">
                    {group.members.map((m) => (
                      <label key={m} className="pf-checkbox-chip">
                        <input
                          type="checkbox"
                          checked={splitAmong.includes(m)}
                          onChange={(e) =>
                            setSplitAmong((prev) =>
                              e.target.checked ? [...prev, m] : prev.filter((x) => x !== m)
                            )
                          }
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {!splitAmong.length && (
                  <p className="pf-form-error">Select at least one person.</p>
                )}

                <div className="pf-create-actions">
                  <button className="btn-primary" type="submit">
                    Save shared expense
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowExpenseForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {group.expenses.length === 0 ? (
              <p className="pf-empty-inline">No expenses yet. Add the first shared expense.</p>
            ) : (
              <ul className="pf-expense-list">
                {group.expenses.map((e) => (
                  <li key={e.id}>
                    <div className="pf-expense-icon">
                      {e.type === 'settle' ? '✓' : '↗'}
                    </div>
                    <div className="pf-expense-info">
                      <strong>{e.title}</strong>
                      <small>
                        {e.type === 'settle'
                          ? `Settlement · ${e.from} → ${e.to}`
                          : `${e.paidBy} paid · split between ${e.splitAmong.join(', ')}`}{' '}
                        · {e.date}
                      </small>
                    </div>
                    <strong className="pf-expense-amount">{formatCurrency(e.amount)}</strong>
                    <button
                      type="button"
                      className="pf-icon-button"
                      aria-label={`Delete ${e.title}`}
                      onClick={() =>
                        setGroups((prev) =>
                          prev.map((g) =>
                            g.id === group.id
                              ? {
                                  ...g,
                                  expenses: g.expenses.filter((x) => x.id !== e.id),
                                }
                              : g
                          )
                        )
                      }
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
