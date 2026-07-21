import React from 'react';

/**
 * GrowthRings — rakenduse signatuurvisuaal.
 *
 * Idee: puu aastarõngad kasvavad igal aastal juurde, kihiti, kuni raha
 * lõpuks eesmärgini kasvab. Siin väljendab see ideed ring, mille kaar
 * täitub vastavalt eesmärgi saavutamise protsendile, ning väliskülge
 * on märgitud aastasõõrmed (nagu puu aastarõngad) iga eesmärgini jäänud
 * aasta kohta.
 *
 * progress: 0..1 — kui suur osa eesmärgist on juba täidetud
 * yearTicks: kokku aastate arv, mille jooned ringi äärele joonistada
 * yearsElapsed: mitu neist aastarõngast on juba "kasvanud" (rohelised)
 */
export default function GrowthRings({ progress, yearTicks, yearsElapsed, centerValue, centerLabel }) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const dashOffset = circumference * (1 - clamped);

  const tickCount = Math.min(Math.max(yearTicks, 0), 60);
  const ticks = Array.from({ length: tickCount }, (_, i) => i);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`${centerLabel}: ${centerValue}`}
    >
      {/* Aastarõngad — väikesed jooned ringi ümber, iga aasta kohta üks */}
      {ticks.map((i) => {
        const angle = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
        const inner = radius + 14;
        const outer = radius + (i < yearsElapsed ? 22 : 19);
        const x1 = cx + inner * Math.cos(angle);
        const y1 = cy + inner * Math.sin(angle);
        const x2 = cx + outer * Math.cos(angle);
        const y2 = cy + outer * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i < yearsElapsed ? 'var(--leaf)' : 'var(--line-strong)'}
            strokeWidth={i < yearsElapsed ? 2 : 1.2}
            strokeLinecap="round"
          />
        );
      })}

      {/* Taustaring */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--forest-soft)" strokeWidth={14} />

      {/* Progressikaar */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--forest)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />

      {/* Keskväärtus */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize={String(centerValue).length > 4 ? '26' : '40'}
        fontWeight="500"
        fill="var(--forest-dark)"
      >
        {centerValue}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="0.06em"
        fill="var(--text-faint)"
      >
        {centerLabel.toUpperCase()}
      </text>
    </svg>
  );
}
