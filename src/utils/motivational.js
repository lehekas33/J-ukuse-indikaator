/**
 * motivational.js
 * Valib julgustava sõnumi vastavalt sellele, kui suur osa eesmärgist
 * on juba täidetud (progress: 0..1). Sõnumid on fikseeritud ja
 * deterministlikud — sama progress annab alati sama sõnumi.
 */
const MESSAGES = [
  { max: 0.1, text: 'Iga suur teekond algab esimesest sammust. Liitintress töötab sinu kasuks.' },
  { max: 0.35, text: 'Su tulevik kasvab iga kuuga.' },
  { max: 0.65, text: 'Oled teel finantsilise vabaduse poole.' },
  { max: 0.9, text: 'Rohkem kui pool teest läbitud — kasv kiireneb iga aastaga.' },
  { max: 1.0001, text: 'Eesmärk on käeulatuses. Püsi kursil.' },
];

export function pickMotivationalMessage(progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  const match = MESSAGES.find((m) => clamped <= m.max);
  return (match || MESSAGES[MESSAGES.length - 1]).text;
}
