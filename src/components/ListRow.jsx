import React from 'react';

// Single row item inside lists (subscriptions, bills, transactions)
function ListRow({ name, note, value, isPositive, isNegative, paid, onPaid, onDelete }) {
  let valueClass = '';
  if (isPositive || value.startsWith('+')) {
    valueClass = 'text-success';
  } else if (isNegative || value.startsWith('-')) {
    valueClass = 'text-danger';
  }

  return (
    <div className={`list-row ${paid ? 'paid' : ''}`}>
      <div className="list-row-info">
        <p className="list-row-name">{name}</p>
        <p className="list-row-note">{note}</p>
        {(onPaid || onDelete) && (
          <div className="list-row-actions">
            {onPaid && (
              <button type="button" className="btn-text btn-paid" onClick={onPaid}>
                Paid
              </button>
            )}
            {onDelete && (
              <button type="button" className="btn-text btn-delete" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      <p className={`list-row-value ${valueClass}`}>{value}</p>
    </div>
  );
}

export default ListRow;
