# WealthTogether Investments — Financial Planning App

A React + TypeScript + Tailwind dashboard for generating client investment
recommendations and financial projections.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's included

| Module | Where |
|---|---|
| 01 Client Profiler | "Client Profiler" tab |
| 02 Portfolio Engine (Low/Moderate/High model portfolios, rupee allocation) | "Portfolio Engine" tab |
| 03 SIP Projection Calculator (monthly-compounding FV, yearly table, chart) | "SIP Projection" tab |
| 04 Step-Up SIP Calculator | "Step-Up SIP" tab |
| 05 Retirement Calculator | "Retirement" tab |
| 06 Child Education Calculator | "Child Education" tab |
| 07 Insurance Calculator (term + health bands) | "Insurance" tab |
| 08 AUM Tracker (trail income) | "AUM Tracker" tab |
| 09 Client Report | "Client Report" tab — use the browser's Print dialog → "Save as PDF" to export. This avoids bundling a heavy PDF-generation library; the on-screen report **is** the PDF layout (charts, disclaimer, client + portfolio detail included). |
| 10 Admin Panel — approved fund shelf, commission, expense ratio, risk level | "Admin Panel" tab |

## Notes on storage

The brief asked for local storage as an initial version. This build keeps
state in memory (React state) for the session — wiring it to
`window.localStorage` is a small, optional follow-up: wrap the `profile` and
`funds` state in `App.tsx` with reads/writes to `localStorage` on mount and
on change.

## Theme

Navy (`#0a1530` family) + gold (`#c4943a` family) + white, set up in
`tailwind.config.js`. Display type is Fraunces (serif), body is Inter, and
numeric/tabular data uses IBM Plex Mono for a ledger feel.

## Structure

```
src/
  components/      UI for each module
  data/funds.ts     Approved fund shelf + model portfolios
  utils/calculations.ts   All financial formulas (SIP FV, step-up, retirement, education, insurance, AUM)
  types.ts
  App.tsx           Tab navigation + module routing
```
