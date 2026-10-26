import React, { useEffect, useState } from 'react';
import { normalizeCategory, formatCurrency } from '../utils/finance';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

function AiCoach({ transactions: propTransactions }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
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

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'coach') {
      setMessages([{ role: 'coach', text: t('Ask questions about your finances.') }]);
    }
  }, [finance.language]);

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
      return t('You spent {amount} on food & groceries.').replace('{amount}', formatCurrency(total));
    }

    // Question 2: Monthly total spending
    if (q.includes('this month') || q.includes('total spend') || q.includes('spending')
      || q.includes('इस महीने') || q.includes('ਇਸ ਮਹੀਨੇ') || q.includes('खर्च') || q.includes('ਖਰਚ')) {
      let total = 0;
      for (let i = 0; i < transactions.length; i += 1) {
        if (transactions[i].amount < 0) {
          total += Math.abs(transactions[i].amount);
        }
      }
      return t('You spent {amount} this month.').replace('{amount}', formatCurrency(total));
    }

    // Question 3: Subscriptions
    if (q.includes('subscription') || q.includes('सदस्यता') || q.includes('ਗਾਹਕੀ')) {
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
        return t('No subscriptions found in your transactions.');
      }
      let list = '';
      for (let i = 0; i < subs.length; i += 1) {
        list += `${subs[i].merchant} (${formatCurrency(Math.abs(subs[i].amount))})`;
        if (i < subs.length - 1) {
          list += ', ';
        }
      }
      return `${t('Your subscriptions:')} ${list}.`;
    }

    // Question 4: Overspending
    if (q.includes('overspending') || q.includes('overspend') || q.includes('highest')
      || q.includes('ज़्यादा खर्च') || q.includes('ਵੱਧ ਖਰਚ')) {
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
        return t('No spending recorded yet.');
      }
      entries.sort((a, b) => b[1] - a[1]);
      const top = entries[0];
      return t('Your highest spending category is {category} at {amount}.')
        .replace('{category}', t(top[0]))
        .replace('{amount}', formatCurrency(top[1]));
    }

    return t('I can currently answer questions about your spending, budget and subscriptions.');
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
          {suggestions.map((suggestion) => {
            const localizedSuggestion = t(suggestion);
            return (
            <button
              key={suggestion}
              type="button"
              className="ai-coach-suggestion"
              onClick={() => setInput(localizedSuggestion)}
            >
              {localizedSuggestion}
            </button>
            );
          })}
        </div>
      )}

      <div className="ai-coach-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`ai-coach-bubble ai-coach-bubble-${msg.role}`}>
            <span className="ai-coach-role">
              {msg.role === 'user' ? t('User') : t('Coach')}
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
          placeholder={t('Ask a question...')}
        />
        <button type="submit" className="btn-primary">
          {t('Send')}
        </button>
      </form>
    </div>
  );
}

export default AiCoach;