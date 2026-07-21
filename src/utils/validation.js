/**
 * validation.js
 * Kõikide sisendväljade valideerimisreeglid ühes kohas.
 * Iga funktsioon tagastab veateate stringi (eesti keeles) või null, kui väärtus on korrektne.
 */

export function validateAge(value) {
  if (value === '' || value === null || isNaN(value)) return 'Sisesta oma vanus.';
  if (value < 16) return 'Vanus peab olema vähemalt 16.';
  if (value > 90) return 'Vanus peab olema alla 90.';
  return null;
}

export function validateSavings(value) {
  if (value === '' || value === null || isNaN(value)) return 'Sisesta praegused säästud.';
  if (value < 0) return 'Säästud ei saa olla negatiivsed.';
  if (value > 100_000_000) return 'Sisesta realistlik summa.';
  return null;
}

export function validateContribution(value) {
  if (value === '' || value === null || isNaN(value)) return 'Sisesta kuine sissemakse.';
  if (value < 0) return 'Sissemakse ei saa olla negatiivne.';
  if (value > 1_000_000) return 'Sisesta realistlik summa.';
  return null;
}

export function validateGoal(value, savings) {
  if (value === '' || value === null || isNaN(value)) return 'Sisesta oma rahaline eesmärk.';
  if (value <= 0) return 'Eesmärk peab olema positiivne summa.';
  if (value > 1_000_000_000) return 'Sisesta realistlik eesmärk.';
  return null;
}

export function validateRate(value) {
  if (value === '' || value === null || isNaN(value)) return 'Sisesta eeldatav tootlus.';
  if (value < 0) return 'Tootlus ei saa olla negatiivne.';
  if (value > 30) return 'Sisesta realistlik tootlus (kuni 30%).';
  return null;
}

export function validateTargetAge(value, currentAge) {
  if (value === '' || value === null || isNaN(value)) return 'Sisesta vanus, milleks eesmärk saavutada.';
  if (Number(value) <= Number(currentAge)) return 'Sihtvanus peab olema suurem praegusest vanusest.';
  if (value > 100) return 'Sihtvanus peab olema kuni 100.';
  return null;
}
