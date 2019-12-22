import React from 'react';

function Amount({ amount, currency = 'CHF' }) {
  const number = new Intl.NumberFormat('de-CH', { style: 'currency', currency }).format(amount);

  return <span className="amount">{number}</span>;
}

export default Amount;
