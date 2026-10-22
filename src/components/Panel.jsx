// Panel.jsx
// This is a simple card/container component.
// It shows a title at the top and any children content inside.
// It is used all over the dashboard for consistent card styling.

import React from 'react';

function Panel({ title, action, onAction, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {action && (
          <button type="button" className="panel-action" onClick={onAction}>
            {action}
          </button>
        )}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export default Panel;