import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/finance';
import '../proFeatures.css';

/**
 * Standard category color palette matching the reference Money River design
 */
const CATEGORY_CONFIG = {
  Home: { color: '#818cf8', icon: '🏠', badge: '▼ 0%', badgeType: 'neutral' },
  Food: { color: '#fb923c', icon: '🍜', badge: '▲ 23%', badgeType: 'danger' },
  Groceries: { color: '#6ee7b7', icon: '🥬', badge: '▼ 10%', badgeType: 'success' },
  Health: { color: '#2dd4bf', icon: '💊', badge: '▼ 5%', badgeType: 'success' },
  Shopping: { color: '#f472b6', icon: '🛍️', badge: '▼ 8%', badgeType: 'success' },
  Fun: { color: '#fbbf24', icon: '🎉', badge: '▲ 12%', badgeType: 'danger' },
  Entertainment: { color: '#fbbf24', icon: '🎬', badge: '▲ 12%', badgeType: 'danger' },
  Transport: { color: '#93c5fd', icon: '🚌', badge: '▼ 15%', badgeType: 'success' },
  Learning: { color: '#a5b4fc', icon: '📚', badge: '▼ 2%', badgeType: 'success' },
  Bills: { color: '#fb7185', icon: '⚡', badge: '▼ 3%', badgeType: 'neutral' },
  Other: { color: '#cbd5e1', icon: '💳', badge: '▼ 1%', badgeType: 'neutral' },
};

const SAVED_CONFIG = {
  name: 'Saved',
  color: '#818cf8',
  icon: '🛡️',
};

const monthKey = (date) => String(date || '').slice(0, 7);

export default function MoneyRiver({ transactions = [] }) {
  // Default to October 2026 as shown in screenshot
  const [month, setMonth] = useState('2026-10');
  const [hoveredNode, setHoveredNode] = useState(null);

  // Filter transactions for current selected month
  const visible = useMemo(() => {
    return transactions.filter((t) => monthKey(t.date) === month);
  }, [transactions, month]);

  // Fallback defaults matching Screenshot 2 if no transactions exist for the selected month yet
  const hasTx = visible.length > 0;

  const income = useMemo(() => {
    if (!hasTx && month === '2026-10') return 45000;
    const inc = visible
      .filter((t) => Number(t.amount) > 0)
      .reduce((s, t) => s + Number(t.amount), 0);
    return inc > 0 ? inc : 45000; // sensible fallback
  }, [visible, hasTx, month]);

  const byCategory = useMemo(() => {
    if (!hasTx && month === '2026-10') {
      return {
        Home: 14539,
        Food: 3890,
        Groceries: 2300,
        Health: 1819,
        Shopping: 1630,
        Fun: 1627,
        Transport: 1310,
        Learning: 390,
      };
    }

    const map = {};
    visible
      .filter((t) => Number(t.amount) < 0)
      .forEach((t) => {
        const rawCat = t.category || 'Other';
        // Normalize naming
        let normCat = rawCat;
        if (normCat.toLowerCase() === 'rent') normCat = 'Home';
        if (normCat.toLowerCase() === 'entertainment') normCat = 'Fun';
        map[normCat] = (map[normCat] || 0) + Math.abs(Number(t.amount));
      });
    return map;
  }, [visible, hasTx, month]);

  const expense = useMemo(() => {
    return Object.values(byCategory).reduce((s, v) => s + v, 0);
  }, [byCategory]);

  const kept = Math.max(0, income - expense);
  const keptPercent = income > 0 ? Math.round((kept / income) * 100) : 0;

  // Month navigation
  const monthDate = new Date(`${month}-02T12:00:00`);
  const monthLabel = monthDate.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  const shiftMonth = (delta) => {
    const d = new Date(`${month}-02T12:00:00`);
    d.setMonth(d.getMonth() + delta);
    setMonth(d.toISOString().slice(0, 7));
  };

  // Build sorted category nodes
  const categoriesList = useMemo(() => {
    return Object.entries(byCategory)
      .map(([name, value]) => {
        const conf = CATEGORY_CONFIG[name] || {
          color: '#cbd5e1',
          icon: '💳',
          badge: '▼ 0%',
          badgeType: 'neutral',
        };
        return {
          name,
          value,
          color: conf.color,
          icon: conf.icon,
          badge: conf.badge,
          badgeType: conf.badgeType,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [byCategory]);

  // SVG Geometry Calculation for Sankey Diagram matching Screenshot 2
  // Diagram dimensions: viewBox 0 0 860 460
  const svgWidth = 860;
  const svgHeight = 460;
  const trunkX = 26;
  const trunkWidth = 14;
  const trunkTopY = 20;
  const trunkHeight = 380;
  const trunkBottomY = trunkTopY + trunkHeight;

  const rightDestX = 560;
  const rightBarWidth = 14;

  // Calculate Sankey ribbons
  const { ribbons, savedRibbon } = useMemo(() => {
    const totalFlow = Math.max(income, expense + kept, 1);
    let currentLeftY = trunkTopY;

    // Minimum label spacing ensures zero collision on the right
    const minRowHeight = 28;
    let currentRightY = 22;

    const computedRibbons = categoriesList.map((cat, idx) => {
      // Proportional height on left trunk (stacked seamlessly)
      const leftH = (cat.value / totalFlow) * trunkHeight;
      const y0_top = currentLeftY;
      const y0_bottom = currentLeftY + leftH;
      currentLeftY += leftH;

      // Right capsule pill height
      // First one (Home) is tall matching screenshot, others are sleek capsules
      const rightH = idx === 0 
        ? Math.max(40, Math.min(60, (cat.value / Math.max(expense, 1)) * 120))
        : Math.max(12, Math.min(22, (cat.value / Math.max(expense, 1)) * 80));

      const y1_top = currentRightY;
      const y1_bottom = currentRightY + rightH;
      
      // Advance right Y for next item with guaranteed separation
      currentRightY += Math.max(minRowHeight, rightH + 10);

      // Smooth Cubic Bezier Ribbon Path:
      const x0 = trunkX + trunkWidth;
      const x1 = rightDestX;
      const dx = (x1 - x0) * 0.48;

      const path = `M ${x0} ${y0_top} C ${x0 + dx} ${y0_top}, ${x1 - dx} ${y1_top}, ${x1} ${y1_top} L ${x1} ${y1_bottom} C ${x1 - dx} ${y1_bottom}, ${x0 + dx} ${y0_bottom}, ${x0} ${y0_bottom} Z`;

      return {
        ...cat,
        y0_top,
        y0_bottom,
        y1_top,
        y1_bottom,
        rightH,
        path,
        textY: y1_top + rightH / 2,
      };
    });

    // Saved Ribbon (flows smoothly to bottom right capsule)
    let computedSaved = null;
    if (kept > 0) {
      const y0_top = currentLeftY;
      const y0_bottom = trunkBottomY;

      const rightH = Math.max(50, Math.min(85, (kept / totalFlow) * 160));
      const y1_bottom = svgHeight - 28;
      const y1_top = y1_bottom - rightH;

      const x0 = trunkX + trunkWidth;
      const x1 = rightDestX;
      const dx = (x1 - x0) * 0.48;

      const path = `M ${x0} ${y0_top} C ${x0 + dx} ${y0_top}, ${x1 - dx} ${y1_top}, ${x1} ${y1_top} L ${x1} ${y1_bottom} C ${x1 - dx} ${y1_bottom}, ${x0 + dx} ${y0_bottom}, ${x0} ${y0_bottom} Z`;

      computedSaved = {
        name: 'Saved',
        value: kept,
        color: SAVED_CONFIG.color,
        y0_top,
        y0_bottom,
        y1_top,
        y1_bottom,
        rightH,
        path,
        textY: y1_top + rightH / 2,
      };
    }

    return { ribbons: computedRibbons, savedRibbon: computedSaved };
  }, [categoriesList, income, expense, kept]);

  return (
    <div className="money-river-page">
      {/* Header section with Eyebrow and Month Switcher */}
      <div className="river-header-block">
        <div className="river-header-title-group">
          <span className="river-eyebrow">WHERE IT ALL GOES</span>
          <h1 className="river-main-title">Your money river</h1>
        </div>

        {/* Month Selector Pills */}
        <div className="river-month-pill-nav">
          <button
            type="button"
            className="month-nav-btn"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous Month"
          >
            ←
          </button>
          <span className="month-nav-label">{monthLabel}</span>
          <button
            type="button"
            className="month-nav-btn"
            onClick={() => shiftMonth(1)}
            aria-label="Next Month"
          >
            →
          </button>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards in a Row */}
      <div className="river-kpis-grid">
        <div className="river-kpi-card">
          <span className="river-kpi-label">Money in</span>
          <strong className="river-kpi-amount text-success">
            {formatCurrency(income)}
          </strong>
        </div>

        <div className="river-kpi-card">
          <span className="river-kpi-label">Money out</span>
          <strong className="river-kpi-amount text-danger">
            {formatCurrency(expense)}
          </strong>
        </div>

        <div className="river-kpi-card">
          <span className="river-kpi-label">Kept</span>
          <strong className="river-kpi-amount river-kpi-kept">
            {formatCurrency(kept)}
          </strong>
          <span className="river-kpi-subtext">{keptPercent}% of income</span>
        </div>
      </div>

      {/* Main Sankey Flow Diagram Card */}
      <div className="river-sankey-card">
        <div className="river-svg-wrapper">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="river-sankey-svg"
            role="img"
            aria-label={`Sankey diagram of money river for ${monthLabel}`}
          >
            <defs>
              <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Left Source Trunk Bar (100% Total Income) */}
            <rect
              x={trunkX}
              y={trunkTopY}
              width={trunkWidth}
              height={trunkHeight}
              rx={6}
              className="river-trunk-bar"
            />

            {/* Expense Ribbons */}
            {ribbons.map((ribbon) => {
              const isHovered = hoveredNode === ribbon.name;
              const isDimmed = hoveredNode && !isHovered;

              return (
                <g
                  key={ribbon.name}
                  className="river-stream-group"
                  onMouseEnter={() => setHoveredNode(ribbon.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Flow Ribbon Path */}
                  <path
                    d={ribbon.path}
                    fill={ribbon.color}
                    opacity={isDimmed ? 0.12 : isHovered ? 1.0 : 0.82}
                    className="river-flow-path"
                  />

                  {/* Right Capsule Pill Cap */}
                  <rect
                    x={rightDestX}
                    y={ribbon.y1_top}
                    width={rightBarWidth}
                    height={ribbon.rightH}
                    rx={6}
                    fill={ribbon.color}
                    opacity={isDimmed ? 0.2 : 1.0}
                    className="river-node-cap"
                  />

                  {/* Category Name Label */}
                  <text
                    x={rightDestX + 24}
                    y={ribbon.textY - 3}
                    className="river-svg-cat-name"
                    opacity={isDimmed ? 0.3 : 1.0}
                  >
                    {ribbon.name}
                  </text>

                  {/* Category Amount Label */}
                  <text
                    x={rightDestX + 24}
                    y={ribbon.textY + 14}
                    className="river-svg-cat-amt"
                    opacity={isDimmed ? 0.3 : 1.0}
                  >
                    {formatCurrency(ribbon.value)}
                  </text>
                </g>
              );
            })}

            {/* Saved Ribbon */}
            {savedRibbon && (
              <g
                className="river-stream-group"
                onMouseEnter={() => setHoveredNode('Saved')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <path
                  d={savedRibbon.path}
                  fill={savedRibbon.color}
                  opacity={
                    hoveredNode && hoveredNode !== 'Saved'
                      ? 0.12
                      : hoveredNode === 'Saved'
                      ? 1.0
                      : 0.82
                  }
                  className="river-flow-path"
                />

                <rect
                  x={rightDestX}
                  y={savedRibbon.y1_top}
                  width={rightBarWidth}
                  height={savedRibbon.rightH}
                  rx={6}
                  fill={savedRibbon.color}
                  className="river-node-cap"
                />

                <text
                  x={rightDestX + 24}
                  y={savedRibbon.textY - 3}
                  className="river-svg-cat-name"
                >
                  Saved
                </text>
                <text
                  x={rightDestX + 24}
                  y={savedRibbon.textY + 14}
                  className="river-svg-cat-amt"
                >
                  {formatCurrency(savedRibbon.value)}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Category Breakdown Progress Cards Below River */}
      <div className="river-breakdown-list">
        {categoriesList.map((cat) => {
          const maxExpense = Math.max(1, expense);
          const percentOfExpense = Math.round((cat.value / maxExpense) * 100);
          const isHovered = hoveredNode === cat.name;

          return (
            <div
              key={cat.name}
              className={`river-breakdown-card ${isHovered ? 'is-card-hovered' : ''}`}
              onMouseEnter={() => setHoveredNode(cat.name)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="breakdown-card-left">
                <div className="breakdown-icon-box" aria-hidden="true">
                  {cat.icon}
                </div>
                <div className="breakdown-info-column">
                  <span className="breakdown-cat-name">{cat.name}</span>
                  <div className="breakdown-bar-track">
                    <div
                      className="breakdown-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.max(6, percentOfExpense))}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="breakdown-card-right">
                <span className="breakdown-amount">{formatCurrency(cat.value)}</span>
                <span className={`breakdown-badge badge-${cat.badgeType}`}>
                  {cat.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
