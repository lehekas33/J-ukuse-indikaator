/**
 * finance.js
 * ----------
 * Kogu rakenduse finantsloogika ühes kohas.
 *
 * PÕHIVALEM (kuupõhine liitintress, sissemaksed kuu lõpus):
 *
 *   FV = P * (1 + r/12)^n + C * [ ((1 + r/12)^n - 1) / (r/12) ]
 *
 * kus:
 *   P = alginvesteering (praegused säästud)
 *   C = kuine sissemakse
 *   r = eeldatav aastane tootlus (nt 0.07 = 7%)
 *   n = kuude arv
 *   FV = tulevikuväärtus
 *
 * Kui r = 0, taandub valem lihtsaks liitmiseks:
 *   FV = P + C * n
 */

const EPSILON = 1e-9;

/**
 * Arvutab tulevikuväärtuse n kuu pärast.
 */
export function futureValue(principal, monthlyContribution, annualRate, months) {
  const r = annualRate / 12;
  if (Math.abs(r) < EPSILON) {
    return principal + monthlyContribution * months;
  }
  const growth = Math.pow(1 + r, months);
  return principal * growth + monthlyContribution * ((growth - 1) / r);
}

/**
 * Arvutab, mitu kuud kulub eesmärgi (goal) saavutamiseks.
 *
 * Valemi P ja C korral lahendame n-i suletud kujul:
 *   FV = x * (P + C/r) - C/r,   x = (1 + r)^n
 *   x = (FV + C/r) / (P + C/r)
 *   n = ln(x) / ln(1 + r)
 *
 * Tagastab { months, possible, reachedImmediately }.
 * Kui eesmärk on juba täidetud praeguste säästudega -> reachedImmediately.
 * Kui eesmärk pole kunagi saavutatav (nt tootlus 0% ja sissemakse 0€
 * ning säästud jäävad alla eesmärgi) -> possible: false.
 */
export function monthsToReachGoal(principal, monthlyContribution, annualRate, goal) {
  if (goal <= principal) {
    return { months: 0, possible: true, reachedImmediately: true };
  }

  const r = annualRate / 12;

  // Kui puudub nii tootlus kui sissemakse, ei kasva raha kunagi.
  if (Math.abs(r) < EPSILON && monthlyContribution <= 0) {
    return { months: null, possible: false, reachedImmediately: false };
  }

  // Ainult tootlus, sissemakseid pole: vajab positiivseid säästud ja tootlust.
  if (Math.abs(r) < EPSILON) {
    // FV = P + C*n  =>  n = (goal - P) / C
    const months = (goal - principal) / monthlyContribution;
    return { months: Math.ceil(months), possible: true, reachedImmediately: false };
  }

  if (principal <= 0 && monthlyContribution <= 0) {
    return { months: null, possible: false, reachedImmediately: false };
  }

  const denom = principal + monthlyContribution / r;

  // Kui denom on nulli või negatiivne, ei koondu suletud valem korrektselt
  // (juhtub vaid teoreetiliselt, nt negatiivse tootluse korral) -> numbriline lahendus.
  if (denom <= 0) {
    return solveNumerically(principal, monthlyContribution, annualRate, goal);
  }

  const x = (goal + monthlyContribution / r) / denom;

  if (x <= 0) {
    return solveNumerically(principal, monthlyContribution, annualRate, goal);
  }

  const months = Math.log(x) / Math.log(1 + r);

  if (!isFinite(months) || months < 0) {
    return solveNumerically(principal, monthlyContribution, annualRate, goal);
  }

  return { months: Math.ceil(months), possible: true, reachedImmediately: false };
}

/**
 * Varuplaan: leiab kuude arvu lihtsa kahendotsinguga, kui suletud valem
 * ei anna usaldusväärset tulemust (nt negatiivse tootluse serviühikud).
 */
function solveNumerically(principal, monthlyContribution, annualRate, goal) {
  let lo = 0;
  let hi = 12 * 200; // kuni 200 aastat
  if (futureValue(principal, monthlyContribution, annualRate, hi) < goal) {
    return { months: null, possible: false, reachedImmediately: false };
  }
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (futureValue(principal, monthlyContribution, annualRate, mid) < goal) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return { months: Math.ceil(hi), possible: true, reachedImmediately: false };
}

/**
 * Genereerib kasvukõvera andmepunktid graafiku jaoks.
 * Tagastab massiivi { month, year, value }, sh algus- ja lõpp-punktid,
 * ühtlaselt jaotatud (vaikimisi kuni 24 punkti).
 */
export function buildGrowthSeries(principal, monthlyContribution, annualRate, totalMonths, maxPoints = 24) {
  const points = [];
  if (totalMonths <= 0) {
    points.push({ month: 0, value: principal });
    return points;
  }
  const step = Math.max(1, Math.ceil(totalMonths / maxPoints));
  for (let m = 0; m <= totalMonths; m += step) {
    points.push({ month: m, value: futureValue(principal, monthlyContribution, annualRate, m) });
  }
  if (points[points.length - 1].month !== totalMonths) {
    points.push({ month: totalMonths, value: futureValue(principal, monthlyContribution, annualRate, totalMonths) });
  }
  return points;
}

/**
 * Arvutab, kui suur peab olema kuine sissemakse, et jõuda eesmärgini
 * täpselt n kuu pärast (nt kindlaks määratud sihtvanuseks).
 *
 * Sama valemi ümberpööratud kuju:
 *   FV = P*(1+r)^n + C * [((1+r)^n - 1) / r]
 *   C = (FV - P*(1+r)^n) / [((1+r)^n - 1) / r]
 *
 * Kui vajalik sissemakse tuleb negatiivne (st praegused säästud kasvavad
 * intressiga ise eesmärgini juba enne tähtaega), tagastatakse 0 ja
 * lipp alreadyOnTrack: true.
 */
export function requiredMonthlyContribution(principal, annualRate, months, goal) {
  if (months <= 0) {
    return { contribution: null, possible: false, alreadyOnTrack: false };
  }

  const r = annualRate / 12;

  if (Math.abs(r) < EPSILON) {
    const c = (goal - principal) / months;
    return { contribution: Math.max(0, c), possible: true, alreadyOnTrack: c <= 0 };
  }

  const growth = Math.pow(1 + r, months);
  const annuityFactor = (growth - 1) / r;
  const c = (goal - principal * growth) / annuityFactor;

  return { contribution: Math.max(0, c), possible: true, alreadyOnTrack: c <= 0 };
}

/**
 * Teisendab kuude arvu inimloetavaks "X aastat ja Y kuud" kujuks.
 */
export function monthsToYearsAndMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { years, months };
}

/**
 * Ümardab summa sendi täpsusega (2 komakohta), Eesti vormingus.
 */
export function formatEuro(value) {
  if (!isFinite(value)) return '—';
  return new Intl.NumberFormat('et-EE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatEuroPrecise(value) {
  if (!isFinite(value)) return '—';
  return new Intl.NumberFormat('et-EE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
