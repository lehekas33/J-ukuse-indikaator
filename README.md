# Jõukuse Indikaator

Motiveeriv jõukuse-prognoosi rakendus: näitab, mis vanuses saavutad oma
rahalise eesmärgi (või kui kaua see aega võtab) antud kuise sissemakse
ja eeldatava tootluse juures.

## Projekti struktuur

```
joukuse-indikaator/
├── index.html                  # HTML sisenemispunkt (fondid, root div)
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                 # Rakenduse käivituspunkt (ReactDOM.render)
│   ├── App.jsx                  # Olek, valideerimine, arvutuste orkestreerimine
│   ├── index.css                # Disainitokenid ja kogu stiil
│   ├── components/
│   │   ├── InputForm.jsx        # Sisendväljad + režiimivalik
│   │   ├── ResultsPanel.jsx     # Tulemuste "hero" vaade
│   │   ├── GrowthRings.jsx      # Signatuurvisuaal (aastarõngad)
│   │   └── GrowthChart.jsx      # Sõltuvusteta SVG joongraafik
│   └── utils/
│       ├── finance.js           # Liitintressi valemid (arvutuslik tuum)
│       ├── validation.js        # Sisendite valideerimisreeglid
│       └── motivational.js      # Julgustavate sõnumite valik
```

## Kuidas käivitada

```bash
npm install
npm run dev
```

Ava brauseris näidatud aadress (vaikimisi `http://localhost:5173`).

Produktsiooni build:

```bash
npm run build
npm run preview
```

## Kuidas rakendus töötab

### 1. Finantsmudel (`src/utils/finance.js`)

Kõik arvutused põhinevad kuupõhisel liitintressil:

```
FV = P * (1 + r/12)^n + C * [((1 + r/12)^n - 1) / (r/12)]
```

- `P` — praegused säästud
- `C` — kuine sissemakse
- `r` — eeldatav aastane tootlus (vaikimisi 7%, reguleeritav 0–15%)
- `n` — kuude arv

**"Vanus eesmärgini"** ja **"Aeg eesmärgini"** kasutavad mõlemad sama
`monthsToReachGoal()` funktsiooni, mis lahendab valemi `n` järgi suletud
kujul (logaritmi abil), mitte kordusarvutusega — seetõttu on tulemus
alati sama sisendi juures identne ja täpne kuni sendini. Servajuhtudel
(nt negatiivne tootlus, mille korral suletud valem ei koondu) lülitub
mootor automaatselt kahendotsingu varulahendusele.

### 2. Sisendite valideerimine (`src/utils/validation.js`)

Iga väli valideeritakse eraldi (vanus, säästud, sissemakse, eesmärk,
tootlus) ja tulemus arvutatakse ainult siis, kui kõik väljad on
korrektsed — vastasel juhul kuvatakse veateated välja all, mitte
vale tulemus.

### 3. Visuaalne kest (`src/components/`)

- **GrowthRings** — signatuurelement: ring, mille kaar täitub vastavalt
  eesmärgi täitumise protsendile, ümbritsetud "aastarõngastega" (nagu
  puu aastarõngad) iga eesmärgini jäänud aasta kohta.
- **GrowthChart** — käsitsi joonistatud SVG joongraafik (ilma
  kolmanda osapoole graafikuteegita), mis näitab prognoositud kasvu
  kuni eesmärgini koos eesmärgijoonega.
- **Progressiriba** — lineaarne riba praeguste säästude ja eesmärgi
  vahekorra kohta.

### 4. Julgustavad sõnumid (`src/utils/motivational.js`)

Sõnum valitakse deterministlikult vastavalt sellele, kui suur osa
eesmärgist on juba täidetud (0–10%, 10–35%, 35–65%, 65–90%, 90–100%).

## Märkus

Rakendus pakub ainult matemaatilisi prognoose eeldatud sisendite
põhjal — see ei ole finantsnõustamine. Tegelik investeeringute
tootlus kõigub ja pole kunagi garanteeritud.
