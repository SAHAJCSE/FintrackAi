# FinTrack AI — Personal Financial Coach

## Problem Statement

Managing personal finances is challenging for many students and working professionals. Most existing expense tracker applications only allow users to manually record transactions and display basic reports. They do not provide personalized financial guidance, predict future spending, detect unnecessary subscriptions, or help users make informed financial decisions. As a result, users often struggle with budgeting, overspending, missed bill payments, and understanding their overall financial health.

This project aims to develop **FinTrack AI**, an intelligent personal finance management platform built with React and CSS. The dashboard includes:

- **Receipt Scanning**: Quick upload and scanning for instant expense logging
- **Budget Prediction**: Forecasting expected monthly spending
- **AI Spending Analysis & Insights**: Real-time tips and alerts on spending patterns
- **Monthly Financial Health Score**: Visual score gauge and progress breakdown
- **Subscription Detection**: Highlight unused or recurring subscriptions
- **Investment Suggestions**: Personalized portfolio ideas based on risk profile
- **Bill Reminders**: Track upcoming utility and rent dues
- **Voice Assistant**: Interface to ask natural language questions about finances

---

## Tech Stack

- **React.js** (Standard JSX & React Components)
- **Vanilla CSS** (Dark finance theme, responsive grid layout)
- **Vite** (Fast dev server and build tool)

---

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```

2. Start the development server:
   ```sh
   npm run dev
   ```

3. Build for production:
   ```sh
   npm run build
   ```


   Feature	How to implement in React
Expense tracking	Controlled forms + useState
Persistent transactions	localStorage + useEffect
Budget management	Progress bars + derived calculations
Financial health score	JavaScript calculation + visual gauge
Budget prediction	Simple calculations using past expenses
AI-style financial coach	Rule-based insights using transaction data
Receipt scanner UI	File upload + preview; simulate scanning
Subscription detection	Detect recurring transactions in sample data
Savings goals	Forms, progress bars and goal calculations
Smart alerts	Conditional rendering based on spending limits
Search and filters	Search input, category and date filters
Voice expense entry	Browser Speech Recognition API, if supported

