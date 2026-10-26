import React, { useState } from 'react';
import { normalizeCategory, formatCurrency } from '../utils/finance';
import { useFinance } from '../context/FinanceContext';

function AiCoach({ transactions: propTransactions }) {
  const finance = useFinance();
  const transactions = propTransactions || finance.transactions || [];
  const financialSummary = finance.financialSummary;
  const budgetUsage = finance.budgetUsage || {};

  const [messages, setMessages] = useState([
    {
      role: 'coach',
      text: 'Ask questions about your finances, budget pacing, or savings tips.',
    },
  ]);

  const [input, setInput] = useState('');

  const suggestions = [
    'How much did I spend on food?',
    'What is my financial health score?',
    'How is my budget pacing?',
    'Where am I overspending?',
    'How can I improve my savings?',
    'What are my subscriptions?',
  ];

  function getCoachAnswer(question) {
    const q = question.toLowerCase();

    // Guard against empty transactions
    if (!transactions || transactions.length === 0) {
      if (q.includes('tip') || q.includes('save') || q.includes('advice')) {
        return 'Rule of thumb: Follow the 50/30/20 rule (50% needs, 30% wants, 20% savings). Log your income and first few expenses to start getting tailored insights!';
      }
      return 'You currently have zero logged transactions. Start by clicking "+ Add Transaction" or scanning a receipt to see live metrics and coaching!';
    }

    // Health Score
    if (q.includes('health') || q.includes('score')) {
      const score = financialSummary?.healthScore ?? 50;
      let status = 'Moderate';
      let tip = 'Try to keep discretionary expenses under 70% of income.';
      if (score >= 75) {
        status = 'Strong';
        tip = 'Your savings rate and cash buffer are in good shape. Maintain this pace!';
      } else if (score < 50) {
        status = 'Needs Attention';
        tip = 'Your expenses are high relative to income. Focus on eliminating unneeded subscriptions.';
      }
      return `Your Financial Health Score is ${score}/100 (${status}). ${tip}`;
    }

    // Budget Pacing & Warnings
    if (q.includes('budget') || q.includes('limit') || q.includes('pacing')) {
      const overEntries = Object.entries(budgetUsage).filter(([, u]) => u.isOver);
      const nearEntries = Object.entries(budgetUsage).filter(([, u]) => u.isNearLimit);

      if (overEntries.length > 0) {
        const list = overEntries.map(([c, u]) => `${c} (${u.percent}%, over by ${formatCurrency(u.spent - u.budget)})`).join(', ');
        return `⚠️ Budget Alert: You have exceeded budget in: ${list}. Consider pausing non-essential purchases in these areas.`;
      }
      if (nearEntries.length > 0) {
        const list = nearEntries.map(([c, u]) => `${c} (${u.percent}%)`).join(', ');
        return `Notice: You are approaching budget limits in: ${list}. Keep an eye on daily spending here.`;
      }
      return `Good news! All categories are currently within their monthly budget limits. Total spending is ${formatCurrency(financialSummary?.totalExpenses || 0)}.`;
    }

    // Savings & Tips
    if (q.includes('save') || q.includes('saving') || q.includes('improve') || q.includes('tip')) {
      const rate = financialSummary?.savingsRate ?? 0;
      if (rate >= 20) {
        return `You are saving ${rate}% of your income, surpassing the recommended 20% benchmark! Consider investing surplus funds into an index fund or recurring deposit.`;
      }
      if (rate > 0) {
        return `Your current savings rate is ${rate}%. To reach the 20% benchmark, try cutting small recurring conveniences (dining delivery or unused subscriptions) to save an extra ₹1,500 - ₹2,500 this month.`;
      }
      return `Your expenses currently match or exceed your income. Tip 1: Prioritize essential bills first. Tip 2: Track every small purchase for 7 days. Tip 3: Aim for 1-2 No-Spend days per week.`;
    }

    // Food & Groceries
    if (q.includes('food') || q.includes('groc') || q.includes('din')) {
      let total = 0;
      for (let i = 0; i < transactions.length; i += 1) {
        const cat = normalizeCategory(transactions[i].category);
        if (cat === 'Food' || cat === 'Groceries') {
          total += Math.abs(transactions[i].amount);
        }
      }
      const foodBudget = (finance.categoryBudgets?.Food || 0) + (finance.categoryBudgets?.Groceries || 0);
      const pct = foodBudget > 0 ? Math.round((total / foodBudget) * 100) : 0;
      return `You spent ${formatCurrency(total)} on food & groceries (${pct}% of your monthly food budget).`;
    }

    // Monthly total spending
    if (q.includes('this month') || q.includes('total spend') || q.includes('spending')) {
      let total = 0;
      for (let i = 0; i < transactions.length; i += 1) {
        if (transactions[i].amount < 0) {
          total += Math.abs(transactions[i].amount);
        }
      }
      return `You spent a total of ${formatCurrency(total)} across all categories. Total income is ${formatCurrency(financialSummary?.totalIncome || 0)}.`;
    }

    // Subscriptions
    if (q.includes('subscription')) {
      const subscriptionNames = [
        'Netflix', 'Hotstar', 'JioCinema', 'Cult.fit', 'Spotify', 'Amazon Prime',
      ];
      const subs = [];
      for (let i = 0; i < transactions.length; i += 1) {
        const merchant = transactions[i].merchant.toLowerCase();
        for (let j = 0; j < subscriptionNames.length; j += 1) {
          if (merchant.includes(subscriptionNames[j].toLowerCase())) {
            subs.push(transactions[i]);
            break;
          }
        }
      }
      if (subs.length === 0) {
        return 'No recurring subscriptions detected in your transactions list.';
      }
      let list = '';
      for (let i = 0; i < subs.length; i += 1) {
        list += `${subs[i].merchant} (${formatCurrency(Math.abs(subs[i].amount))})`;
        if (i < subs.length - 1) {
          list += ', ';
        }
      }
      return `Your detected subscriptions: ${list}. Audit them monthly to cancel services you no longer open.`;
    }

    // Overspending / Top category
    if (q.includes('overspending') || q.includes('overspend') || q.includes('highest')) {
      const byCategory = {};
      for (let i = 0; i < transactions.length; i += 1) {
        const t = transactions[i];
        if (t.amount < 0) {
          const cat = normalizeCategory(t.category);
          byCategory[cat] = (byCategory[cat] || 0) + Math.abs(t.amount);
        }
      }
      const entries = Object.entries(byCategory);
      if (entries.length === 0) {
        return 'No spending recorded yet.';
      }
      entries.sort((a, b) => b[1] - a[1]);
      const top = entries[0];
      return `Your highest spending category is ${top[0]} at ${formatCurrency(top[1])}. Keep an eye on this to prevent monthly budget drift.`;
    }

    return 'I can help analyze your spending, budget pacing, subscriptions, savings rate, and financial health score. Try asking one of the suggestions above!';
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (trimmed === '') return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);

    const answer = getCoachAnswer(trimmed);
    setMessages((prev) => [...prev, { role: 'coach', text: answer }]);

    setInput('');
  }

  return (
    <div className="ai-coach">
      {messages.length === 1 && (
        <div className="ai-coach-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="ai-coach-suggestion"
              onClick={() => setInput(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="ai-coach-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`ai-coach-bubble ai-coach-bubble-${msg.role}`}>
            <span className="ai-coach-role">
              {msg.role === 'user' ? 'User' : 'Coach'}
            </span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form className="ai-coach-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit" className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}

export default AiCoach;