// AiCoach.jsx
// This is the AI Financial Coach — a simple chat box.
// It is NOT real AI. It uses simple word matching and math.
// You can ask it questions about your spending and subscriptions.

import React, { useState } from 'react';

function AiCoach({ transactions = [] }) {
  // messages holds every line in the chat.
  // It starts with one welcome line from the coach.
  const [messages, setMessages] = useState([
    {
      role: 'coach',
      text: 'Ask questions about your finances.',
    },
  ]);

  // input holds whatever the user is currently typing.
  const [input, setInput] = useState('');

  // These are example questions the user can click to get started.
  const suggestions = [
    'How much did I spend on food?',
    'How much did I spend this month?',
    'What are my subscriptions?',
    'Where am I overspending?',
  ];

  // This function looks at the question and works out the answer.
  // It uses simple if statements — no complicated language processing.
  function getCoachAnswer(question) {
    // Make everything lowercase so the check is easy.
    const q = question.toLowerCase();

    // Question 1: How much did I spend on food?
    if (q.includes('food')) {
      let total = 0;
      for (let i = 0; i < transactions.length; i = i + 1) {
        if (transactions[i].category === 'Food') {
          total = total + Math.abs(transactions[i].amount);
        }
      }
      return 'You spent ₹' + total + ' on food.';
    }

    // Question 2: How much did I spend this month?
    if (q.includes('this month')) {
      let total = 0;
      for (let i = 0; i < transactions.length; i = i + 1) {
        if (transactions[i].amount < 0) {
          total = total + Math.abs(transactions[i].amount);
        }
      }
      return 'You spent ₹' + total + ' this month.';
    }

    // Question 3: What are my subscriptions?
    if (q.includes('subscription')) {
      const subscriptionNames = [
        'Netflix', 'Hotstar', 'JioCinema', 'Cult.fit', 'Spotify', 'Amazon Prime',
      ];
      const subs = [];
      for (let i = 0; i < transactions.length; i = i + 1) {
        const merchant = transactions[i].merchant.toLowerCase();
        for (let j = 0; j < subscriptionNames.length; j = j + 1) {
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
      for (let i = 0; i < subs.length; i = i + 1) {
        list = list + subs[i].merchant + ' (₹' + Math.abs(subs[i].amount) + ')';
        if (i < subs.length - 1) {
          list = list + ', ';
        }
      }
      return 'Your subscriptions: ' + list + '.';
    }

    // Question 4: Where am I overspending?
    if (q.includes('overspending') || q.includes('overspend')) {
      const byCategory = {};
      for (let i = 0; i < transactions.length; i = i + 1) {
        const t = transactions[i];
        if (t.amount < 0) {
          if (byCategory[t.category] === undefined) {
            byCategory[t.category] = 0;
          }
          byCategory[t.category] = byCategory[t.category] + Math.abs(t.amount);
        }
      }
      const entries = Object.entries(byCategory);
      if (entries.length === 0) {
        return 'No spending recorded yet.';
      }
      entries.sort(function (a, b) {
        return b[1] - a[1];
      });
      const top = entries[0];
      return 'Your highest category is ' + top[0] + ' at ₹' + top[1] + '.';
    }

    // If the question is not recognised, show a friendly message.
    return 'I can currently answer questions about your spending, budget and subscriptions.';
  }

  // This runs when the user clicks Send or presses Enter.
  function handleSubmit(event) {
    event.preventDefault(); // stop the page from reloading
    const trimmed = input.trim(); // remove extra spaces
    if (trimmed === '') {
      return; // do nothing if the input is empty
    }

    // Add the user's question to the chat.
    setMessages(function (prev) {
      return [...prev, { role: 'user', text: trimmed }];
    });

    // Work out the coach's answer and add it to the chat.
    const answer = getCoachAnswer(trimmed);
    setMessages(function (prev) {
      return [...prev, { role: 'coach', text: answer }];
    });

    // Clear the input box so the user can type a new question.
    setInput('');
  }

  return (
    <div className="ai-coach">
      {/* Show the suggested questions only before the user types anything */}
      {messages.length === 1 && (
        <div className="ai-coach-suggestions">
          {suggestions.map(function (suggestion) {
            return (
              <button
                key={suggestion}
                type="button"
                className="ai-coach-suggestion"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      )}

      {/* The chat message area */}
      <div className="ai-coach-messages">
        {messages.map(function (msg, index) {
          return (
            <div key={index} className={'ai-coach-bubble ai-coach-bubble-' + msg.role}>
              <span className="ai-coach-role">
                {msg.role === 'user' ? 'User' : 'Coach'}
              </span>
              <p>{msg.text}</p>
            </div>
          );
        })}
      </div>

      {/* The input form at the bottom */}
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