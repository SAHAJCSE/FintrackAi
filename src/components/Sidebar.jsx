// Sidebar.jsx
// This is the left navigation bar.
// It has buttons that open the different full-screen pages.
// Each button calls a function passed down from App.jsx.

import React from 'react';

function Sidebar({ onHomeClick, onHealthClick, onBudgetClick, onAiCoachClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">FT</div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <span className="nav-dot" />
          <span>Home</span>
        </div>

        <div className="nav-item" onClick={onHealthClick}>
          <span className="nav-dot" />
          <span>Health</span>
        </div>

        <div className="nav-item" onClick={onBudgetClick}>
          <span className="nav-dot" />
          <span>Budget</span>
        </div>

        <div className="nav-item" onClick={onAiCoachClick}>
          <span className="nav-dot" />
          <span>AI Coach</span>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;