import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { translate } from '../utils/i18n';

function LanguageSelector({ className = '' }) {
  const { language, setLanguage } = useFinance();

  return (
    <label className={`language-selector ${className}`.trim()}>
      <span>{translate('Language', language)}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        aria-label={translate('Language', language)}
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="pa">ਪੰਜਾਬੀ</option>
      </select>
    </label>
  );
}

export default LanguageSelector;
