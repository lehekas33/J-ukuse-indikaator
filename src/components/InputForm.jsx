import React from 'react';
import {
  validateAge,
  validateSavings,
  validateContribution,
  validateGoal,
  validateRate,
} from '../utils/validation';

/**
 * InputForm — kõik kasutaja sisendväljad + režiimivalik.
 * Kõik väärtused ja veateated tulevad olekuna Appist (controlled inputs),
 * nii on kogu rakenduse olek ühes kohas ja hõlpsalt jälgitav.
 */
export default function InputForm({ values, errors, onChange, mode, onModeChange }) {
  const handleNumberChange = (field) => (e) => {
    const raw = e.target.value;
    onChange(field, raw === '' ? '' : Number(raw));
  };

  return (
    <div className="card">
      <div className="form-section-title">Sinu andmed</div>

      <div className="mode-toggle" role="tablist" aria-label="Arvutusrežiim">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'age'}
          className={mode === 'age' ? 'active' : ''}
          onClick={() => onModeChange('age')}
        >
          Vanus eesmärgini
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'time'}
          className={mode === 'time' ? 'active' : ''}
          onClick={() => onModeChange('time')}
        >
          Aeg eesmärgini
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'contribution'}
          className={mode === 'contribution' ? 'active' : ''}
          onClick={() => onModeChange('contribution')}
        >
          Kuine panus eesmärgini
        </button>
      </div>

      <div className="field">
        <label htmlFor="age">Praegune vanus</label>
        <div className="input-wrap">
          <input
            id="age"
            type="number"
            inputMode="numeric"
            className={errors.age ? 'has-error' : ''}
            value={values.age}
            onChange={handleNumberChange('age')}
            placeholder="32"
          />
          <span className="unit">aastat</span>
        </div>
        {errors.age && <div className="error-text">{errors.age}</div>}
      </div>

      <div className="field">
        <label htmlFor="savings">Praegused säästud</label>
        <div className="input-wrap">
          <input
            id="savings"
            type="number"
            inputMode="decimal"
            className={errors.savings ? 'has-error' : ''}
            value={values.savings}
            onChange={handleNumberChange('savings')}
            placeholder="5000"
          />
          <span className="unit">€</span>
        </div>
        {errors.savings && <div className="error-text">{errors.savings}</div>}
      </div>

      {mode !== 'contribution' && (
        <div className="field">
          <label htmlFor="contribution">Kuine sissemakse</label>
          <div className="input-wrap">
            <input
              id="contribution"
              type="number"
              inputMode="decimal"
              className={errors.contribution ? 'has-error' : ''}
              value={values.contribution}
              onChange={handleNumberChange('contribution')}
              placeholder="300"
            />
            <span className="unit">€ / kuu</span>
          </div>
          {errors.contribution && <div className="error-text">{errors.contribution}</div>}
        </div>
      )}

      {mode === 'contribution' && (
        <div className="field">
          <label htmlFor="targetAge">Vanus, milleks eesmärk saavutada</label>
          <div className="input-wrap">
            <input
              id="targetAge"
              type="number"
              inputMode="numeric"
              className={errors.targetAge ? 'has-error' : ''}
              value={values.targetAge}
              onChange={handleNumberChange('targetAge')}
              placeholder="55"
            />
            <span className="unit">aastat</span>
          </div>
          {errors.targetAge && <div className="error-text">{errors.targetAge}</div>}
        </div>
      )}

      <div className="field">
        <label htmlFor="goal">Rahaline eesmärk</label>
        <div className="input-wrap">
          <input
            id="goal"
            type="number"
            inputMode="decimal"
            className={errors.goal ? 'has-error' : ''}
            value={values.goal}
            onChange={handleNumberChange('goal')}
            placeholder="500000"
          />
          <span className="unit">€</span>
        </div>
        {errors.goal && <div className="error-text">{errors.goal}</div>}
        <div className="hint">Nt "esimene miljon", pensionifond või vabaduse piir.</div>
      </div>

      <div className="field">
        <label htmlFor="rate">Eeldatav aastane tootlus</label>
        <div className="rate-row">
          <input
            id="rate"
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={values.rate === '' ? 7 : values.rate}
            onChange={handleNumberChange('rate')}
          />
          <span className="rate-value">{values.rate === '' ? '—' : `${values.rate}%`}</span>
        </div>
        {errors.rate && <div className="error-text">{errors.rate}</div>}
        <div className="hint">Vaikimisi 7% — laia turuindeksi fondi ajalooline keskmine reaaltootlus.</div>
      </div>
    </div>
  );
}
