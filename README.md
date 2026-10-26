# FinTrack AI

FinTrack AI is a React and Vite personal-finance dashboard for recording transactions and reviewing spending in the browser. It is a frontend demo: it does not connect to a bank, provide real account authentication, or call an AI service.

## Features

- **Expense tracking:** Add income and expenses by category and date. Transactions are stored in browser `localStorage`.
- **Dashboard:** Review recorded income, expenses, balances, category totals, and recent transactions.
- **Budget view:** See a simple spending total and category breakdown derived from recorded transactions. This is not a forecast or a configurable budget-alert system.
- **Financial insights:** The coach uses local JavaScript rules and transaction data; it is not an AI model or professional financial advice.
- **Activity calendar:** View transaction activity by date and log expenses from the selected day.
- **Smart commands:** Type supported commands to open dashboard sections or prepare an expense for confirmation. Commands are parsed locally and do not use a language model.
- **Languages:** English, Hindi, and Punjabi are available for the interface. Some less-used screens or content may remain in English.
- **Themes:** Switch between light and dark appearance.

## Demo-only features and limitations

- **Authentication:** Sign-in and account creation are client-side demo flows; there is no user account service or password verification.
- **Receipt scanner:** Uploading a receipt shows a preview and a simulated scan with editable example values. There is no OCR or automatic receipt extraction.
- **Sample data:** A first visit may start with example transactions. After transactions are edited or deleted, the saved browser data is used. Data is local to that browser and is not synchronized across devices.
- **Bills, subscriptions, and investment suggestions:** Some of these views use sample/demo content and should not be treated as personalized financial guidance.
- **Security and privacy:** The app does not provide bank-grade security, bank connections, or server-side storage. Avoid entering sensitive financial credentials.

## Tech stack

- React with JavaScript
- Vite
- CSS
- React Context API for shared application state
- Browser `localStorage` for local preferences and transaction persistence

No backend or external AI/OCR service is required.

## Run locally

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```
