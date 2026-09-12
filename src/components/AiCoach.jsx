import React, { useState } from 'react';
import { normalizeCategory, formatCurrency } from '../utils/finance';

function AiCoach({ transactions = [] }) {
  const [messages, setMessages] = useState([
    {
      role: 'coach',
      text: 'Ask questions about your finances.',
    },
  ]);

  const [input, setInput] = useState('');

  const suggestions = [
    'How much did I spend on food?',
    'How much did I spend this month?',
    'What are my subscriptions?',
    'Where am I overspending?',
  ];

  function getCoachAnswer(question) {
    const q = question.toLowerCase();

    // Question 1: Food & Groceries spending
    if (q.includes('food') || q.includes('groc') || q.includes('din')) {
      let total = 0;
      for (let i = 0; i < transactions.length; i += 1) {
        const cat = normalizeCategory(transactions[i].category);
        if (cat === 'Food') {
          total += Math.abs(transactions[i].amount);
        }
      }
      return `You spent ${formatCurrency(total)} on food & groceries.`;
    }

    // Question 2: Monthly total spending
    if (q.includes('this month') || q.includes('total spend') || q.includes('spending')) {
      let total = 0;
      for (let i = 0; i < transactions.length; i += 1) {
        if (transactions[i].amount < 0) {
          total += Math.abs(transactions[i].amount);
        }
      }
      return `You spent ${formatCurrency(total)} this month.`;
    }

    // Question 3: Subscriptions
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
        return 'No subscriptions found in your transactions.';
      }
      let list = '';
      for (let i = 0; i < subs.length; i += 1) {
        list += `${subs[i].merchant} (${formatCurrency(Math.abs(subs[i].amount))})`;
        if (i < subs.length - 1) {
          list += ', ';
        }
      }
      return `Your subscriptions: ${list}.`;
    }

    // Question 4: Overspending
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
      return `Your highest spending category is ${top[0]} at ${formatCurrency(top[1])}.`;
    }

    return 'I can currently answer questions about your spending, budget and subscriptions.';
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