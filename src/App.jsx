import React, { useMemo, useState } from 'react';
import InputForm from './components/InputForm';
import ResultsPanel from './components/ResultsPanel';
import {
  futureValue,
  monthsToReachGoal,
  requiredMonthlyContribution,
  buildGrowthSeries,
} from './utils/finance';
import {
  validateAge,
  validateSavings,
  validateContribution,
  validateGoal,
  validateRate,
  validateTargetAge,
} from './utils/validation';

const DEFAULT_VALUES = {
  age: 30,
  savings: 5000,
  contribution: 300,
  goal: 500000,
  rate: 7,
  targetAge: 55,
};

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [mode, setMode] = useState('age'); // 'age' | 'time' | 'contribution'

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const errors = useMemo(
    () => ({
      age: validateAge(values.age),
      savings: validateSavings(values.savings),
      contribution: validateContribution(values.contribution),
      goal: validateGoal(values.goal, values.savings),
      rate: validateRate(values.rate),
      targetAge: validateTargetAge(values.targetAge, values.age),
    }),
    [values]
  );

  const hasErrors = useMemo(() => {
    const relevantFields = ['age', 'savings', 'goal', 'rate'];
    relevantFields.push(mode === 'contribution' ? 'targetAge' : 'contribution');
    return relevantFields.some((field) => Boolean(errors[field]));
  }, [errors, mode]);

  const calc = useMemo(() => {
    if (hasErrors) return null;

    const principal = Number(values.savings);
    const annualRate = Number(values.rate) / 100;
    const goal = Number(values.goal);

    if (mode === 'contribution') {
      const months = Math.round((Number(values.targetAge) - Number(values.age)) * 12);
      if (months <= 0) return { possible: false };

      const req = requiredMonthlyContribution(principal, annualRate, months, goal);
      const finalValue = futureValue(principal, req.contribution, annualRate, months);
      const series = buildGrowthSeries(principal, req.contribution, annualRate, months);

      return {
        possible: true,
        months,
        finalValue,
        series,
        contribution: req.contribution,
        alreadyOnTrack: req.alreadyOnTrack,
      };
    }

    const contribution = Number(values.contribution);
    const result = monthsToReachGoal(principal, contribution, annualRate, goal);
    if (!result.possible) {
      return { possible: false };
    }

    const finalValue = futureValue(principal, contribution, annualRate, result.months);
    const series = buildGrowthSeries(principal, contribution, annualRate, result.months);

    return {
      possible: true,
      months: result.months,
      reachedImmediately: result.reachedImmediately,
      finalValue,
      series,
    };
  }, [values, hasErrors, mode]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="eyebrow">Jõukuse Indikaator</span>
        <h1>Vaata, millal su eesmärk päriselt täitub.</h1>
        <p className="subtitle">
          Sisesta oma säästud, kuine sissemakse ja eesmärk — liitintress teeb ülejäänu. Kõik arvutused
          põhinevad kuupõhisel liitintressil ja laia turuindeksi fondi keskmisel tootlusel.
        </p>
      </header>

      <div className="layout-grid">
        <InputForm values={values} errors={errors} onChange={handleChange} mode={mode} onModeChange={setMode} />
        <ResultsPanel mode={mode} calc={calc} inputs={values} />
      </div>

      <footer className="app-footer">
        See tööriist pakub ainult matemaatilisi prognoose eeldatud tootluse põhjal — mitte finantsnõustamist.
        Tegelik tootlus kõigub ja ei ole kunagi garanteeritud.
      </footer>
    </div>
  );
}
