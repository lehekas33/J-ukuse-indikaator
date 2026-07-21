import React from 'react';
import GrowthRings from './GrowthRings';
import GrowthChart from './GrowthChart';
import { formatEuro, formatEuroPrecise, monthsToYearsAndMonths } from '../utils/finance';
import { pickMotivationalMessage } from '../utils/motivational';

/**
 * ResultsPanel — parema poole "hero" tulemuste vaade: rõngasvisuaal,
 * suur tulemuslause, statistikakaardid, lineaarne progressiriba ja
 * kasvugraafik.
 */
export default function ResultsPanel({ mode, calc, inputs }) {
  if (!calc || !calc.possible) {
    return (
      <div className="results-hero">
        <div className="card">
          <div className="hero-copy">
            <div className="result-label">Tulemus</div>
            <h2 className="result-headline">Selle seadistusega eesmärki ei saavutata.</h2>
            <div className="impossible-note">
              Praeguse tootluse ja sissemakse juures ei jõua säästud kunagi eesmärgini. Proovi suurendada
              kuist sissemakset või eeldatavat tootlust.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { months, reachedImmediately } = calc;
  const { years, months: remMonths } = monthsToYearsAndMonths(months);
  const targetAge = Number(inputs.age) + years + remMonths / 12;
  const displayAge = Math.round(targetAge);

  const currentValue = Number(inputs.savings);
  const goal = Number(inputs.goal);
  const progress = goal > 0 ? Math.min(1, currentValue / goal) : 0;

  const motivational = pickMotivationalMessage(progress);

  let headline;
  let ringsCenterValue;
  let ringsCenterLabel;
  let totalContributed;

  if (mode === 'contribution') {
    const requiredMonths = calc.months;
    headline = calc.alreadyOnTrack ? (
      'Sinu praegused säästud kasvavad ise eesmärgini juba enne sihtvanust — lisapanust pole vaja!'
    ) : (
      <>
        Selleks, et <strong>{Math.round(Number(inputs.targetAge))}-aastaselt</strong> omada{' '}
        {formatEuro(goal)}, pead panustama <strong>{formatEuroPrecise(calc.contribution)} kuus</strong>.
      </>
    );
    ringsCenterValue = formatEuro(Math.round(calc.contribution));
    ringsCenterLabel = '€ kuus';
    totalContributed = currentValue + calc.contribution * requiredMonths;
  } else {
    headline =
      mode === 'age'
        ? reachedImmediately
          ? 'Sinu eesmärk on juba saavutatud!'
          : <>Sa saavutad oma eesmärgi <strong>{displayAge}-aastaselt</strong>.</>
        : reachedImmediately
          ? 'Sinu eesmärk on juba saavutatud!'
          : <>Eesmärgini jõudmiseks kulub <strong>{years} aastat ja {remMonths} kuud</strong>.</>;
    ringsCenterValue = mode === 'age' ? displayAge : years;
    ringsCenterLabel = mode === 'age' ? 'aastane' : 'aastat';
    totalContributed = currentValue + Number(inputs.contribution) * months;
  }

  const series = calc.series;

  return (
    <div className="results-hero">
      <div className="card">
        <div className="hero-top">
          <GrowthRings
            progress={progress}
            yearTicks={Math.max(years, 1)}
            yearsElapsed={0}
            centerValue={ringsCenterValue}
            centerLabel={ringsCenterLabel}
          />
          <div className="hero-copy">
            <div className="result-label">Tulemus</div>
            <h2 className="result-headline">{headline}</h2>
            <p className="result-sub">
              Alustades {formatEuro(currentValue)} säästudega
              {mode === 'contribution' ? '' : <>, lisades {formatEuro(Number(inputs.contribution))} kuus</>},
              eeldatava {inputs.rate}% aastase tootluse juures.
            </p>
            <div className="motivational-note">{motivational}</div>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">Eesmärk</div>
          <div className="stat-value">{formatEuro(goal)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Tulevikuväärtus eesmärgi kuupäeval</div>
          <div className="stat-value">{formatEuroPrecise(calc.finalValue)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Kokku sissemakstud</div>
          <div className="stat-value">{formatEuro(totalContributed)}</div>
        </div>
      </div>

      <div className="card">
        <div className="form-section-title">Praegune seis eesmärgi suhtes</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="progress-meta">
          <span>{formatEuro(currentValue)}</span>
          <span>{Math.round(progress * 100)}%</span>
          <span>{formatEuro(goal)}</span>
        </div>
      </div>

      <div className="card">
        <div className="form-section-title">Prognoositud kasv ajas</div>
        <GrowthChart series={series} goal={goal} />
      </div>
    </div>
  );
}
