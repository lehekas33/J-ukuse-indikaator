import React from 'react';

/**
 * GrowthChart — sõltuvusteta SVG joongraafik, mis näitab säästude
 * kasvu ajas kuni eesmärgini. Ei kasuta ühtegi kolmanda osapoole
 * graafikuteeki — kõik koordinaadid arvutatakse käsitsi, mistõttu
 * tulemus on deterministlik ja alati reprodutseeritav.
 */
export default function GrowthChart({ series, goal }) {
  const width = 640;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 16 };

  if (!series || series.length < 2) return null;

  const maxValue = Math.max(goal, ...series.map((p) => p.value)) * 1.05;
  const minValue = 0;
  const maxMonth = series[series.length - 1].month;

  const xScale = (month) =>
    padding.left + (month / maxMonth) * (width - padding.left - padding.right);
  const yScale = (value) =>
    height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (height - padding.top - padding.bottom);

  const linePoints = series.map((p) => `${xScale(p.month)},${yScale(p.value)}`).join(' ');

  const areaPoints = `${xScale(0)},${yScale(0)} ${linePoints} ${xScale(maxMonth)},${yScale(0)}`;

  const goalY = yScale(Math.min(goal, maxValue));

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--leaf)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--leaf)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Eesmärgi joon */}
        <line
          x1={padding.left}
          y1={goalY}
          x2={width - padding.right}
          y2={goalY}
          stroke="var(--sky)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />

        {/* Ala joone all */}
        <polygon points={areaPoints} fill="url(#areaFill)" />

        {/* Kasvukõver */}
        <polyline points={linePoints} fill="none" stroke="var(--forest)" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Lõpp-punkt */}
        <circle
          cx={xScale(series[series.length - 1].month)}
          cy={yScale(series[series.length - 1].value)}
          r="4.5"
          fill="var(--forest)"
        />
      </svg>
      <div className="chart-legend">
        <span><span className="dot" style={{ background: 'var(--forest)' }} />Prognoositud kasv</span>
        <span><span className="dot" style={{ background: 'var(--sky)' }} />Eesmärk</span>
      </div>
    </div>
  );
}
