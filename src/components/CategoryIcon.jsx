import React from 'react';

/**
 * CategoryIcon - Clean, crisp SVG icons for transaction and subscription categories.
 * Replaces informal emojis with consistent, high-contrast, theme-aware icons.
 */
export function getCategoryColor(category = '') {
  const cat = String(category).toLowerCase();
  if (cat.includes('entertain') || cat.includes('movie') || cat.includes('stream') || cat.includes('music')) return '#8b5cf6'; // Purple
  if (cat.includes('fit') || cat.includes('gym')) return '#ec4899'; // Pink
  if (cat.includes('product') || cat.includes('work') || cat.includes('soft') || cat.includes('tech')) return '#10b981'; // Emerald
  if (cat.includes('util') || cat.includes('bill') || cat.includes('cloud') || cat.includes('power')) return '#3b82f6'; // Blue
  if (cat.includes('shop') || cat.includes('store') || cat.includes('cloth')) return '#f97316'; // Orange
  if (cat.includes('food') || cat.includes('dine') || cat.includes('restaur') || cat.includes('meal')) return '#ef4444'; // Red
  if (cat.includes('groc')) return '#84cc16'; // Lime
  if (cat.includes('trans') || cat.includes('travel') || cat.includes('cab') || cat.includes('fuel')) return '#0ea5e9'; // Sky
  if (cat.includes('rent') || cat.includes('home') || cat.includes('house')) return '#6366f1'; // Indigo
  if (cat.includes('health') || cat.includes('medic') || cat.includes('hosp')) return '#14b8a6'; // Teal
  if (cat.includes('income') || cat.includes('salar')) return '#22c55e'; // Green
  if (cat.includes('emerg')) return '#eab308'; // Amber
  if (cat.includes('person')) return '#a855f7'; // Purple
  return '#64748b'; // Slate
}

function CategoryIcon({ category = '', size = 18, color = 'currentColor', className = '' }) {
  const cat = String(category).trim().toLowerCase();

  let iconContent = null;

  if (cat.includes('entertain') || cat.includes('movie') || cat.includes('stream') || cat.includes('music') || cat.includes('video')) {
    // Media / Entertainment: TV screen with play triangle
    iconContent = (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
      </>
    );
  } else if (cat.includes('fit') || cat.includes('gym') || cat.includes('workout')) {
    // Fitness: Dumbbell
    iconContent = (
      <>
        <path d="M6 5v14M18 5v14M3 8v8M21 8v8M6 12h12" />
      </>
    );
  } else if (cat.includes('product') || cat.includes('work') || cat.includes('soft') || cat.includes('tool') || cat.includes('ai') || cat.includes('tech')) {
    // Productivity / Tech: Code / CPU / Terminal
    iconContent = (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </>
    );
  } else if (cat.includes('util') || cat.includes('bill') || cat.includes('electr') || cat.includes('water') || cat.includes('broadband') || cat.includes('cloud')) {
    // Utilities: Lightning bolt / Flash
    iconContent = (
      <>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </>
    );
  } else if (cat.includes('shop') || cat.includes('cloth') || cat.includes('store')) {
    // Shopping: Shopping bag
    iconContent = (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    );
  } else if (cat.includes('food') || cat.includes('dine') || cat.includes('cafe') || cat.includes('restaur')) {
    // Food: Utensils / Cutlery
    iconContent = (
      <>
        <path d="M18 2v20M21 2v6a3 3 0 0 1-3 3M6 2v7a3 3 0 0 0 3 3v10M9 2v4M3 2v4" />
      </>
    );
  } else if (cat.includes('groc')) {
    // Groceries: Basket
    iconContent = (
      <>
        <path d="m4 10 2 10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l2-10" />
        <path d="M2 10h20" />
        <path d="m8 10 4-7 4 7" />
      </>
    );
  } else if (cat.includes('trans') || cat.includes('cab') || cat.includes('uber') || cat.includes('ola') || cat.includes('fuel') || cat.includes('commute')) {
    // Transport: Car / Vehicle
    iconContent = (
      <>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.7C2 10.9 2 11.3 2 11.7V16c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </>
    );
  } else if (cat.includes('rent') || cat.includes('house') || cat.includes('home')) {
    // Housing / Rent: Building / Home
    iconContent = (
      <>
        <path d="m3 10 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M9 22V12h6v10" />
      </>
    );
  } else if (cat.includes('health') || cat.includes('medic') || cat.includes('hosp') || cat.includes('doctor')) {
    // Health: Heart pulse
    iconContent = (
      <>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </>
    );
  } else if (cat.includes('income') || cat.includes('salar') || cat.includes('freelance') || cat.includes('credit')) {
    // Income: Trending upward / Received funds
    iconContent = (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </>
    );
  } else if (cat.includes('emerg') || cat.includes('save')) {
    // Emergency: Shield
    iconContent = (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </>
    );
  } else if (cat.includes('person')) {
    // Personal: User avatar
    iconContent = (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    );
  } else {
    // Default: Credit card / Transaction receipt
    iconContent = (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </>
    );
  }

  return (
    <svg
      className={`category-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconContent}
    </svg>
  );
}

export default CategoryIcon;
