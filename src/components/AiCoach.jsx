import React, { useEffect, useState } from 'react';
import { normalizeCategory, formatCurrency } from '../utils/finance';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

function AiCoach({ transactions: propTransactions }) {
  const finance = useFinance();
  const t = (text) => translate(text, finance.language);
  const transactions = propTransactions || finance.transactions || [];
  const [messages, setMessages] = useState([
    {
      role: 'coach',
      text: translate('Ask questions about your finances.', finance.language),
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
    'How much did I spend this month?',
    'What are my subscriptions?',
    'Where am I overspending?',
  ];

  function getCoachAnswer(question) {
    const q = question.toLowerCase();

    // Question 1: Food & Groceries spending
    if (['food', 'groc', 'din', 'भोजन', 'खाना', 'किराना', 'ਭੋਜਨ', 'ਖਾਣਾ', 'ਕਰਿਆਨਾ'].some((word) => q.includes(word))) {
      let total = 0;
      for (let i = 0; i < transactions.length; i += 1) {
        const cat = normalizeCategory(transactions[i].category);
        if (cat === 'Food') {
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