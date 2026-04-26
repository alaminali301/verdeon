# VERDEON — Claude Code Project Bible
**Carbon Intelligence Platform · EPA GHGRP Data · Next.js Web App**

> Drop this file as `CLAUDE.md` in the root of your repo. Claude Code reads it automatically at the start of every session.

---

## 0. TL;DR — What you are building

Verdeon is a **web application** built with **Next.js 14 (App Router)**. It ingests EPA Greenhouse Gas Reporting Program (GHGRP) data — 14 years, 6,000+ facilities, 8 sectors — and turns it into interactive dashboards, trend charts, sector breakdowns, facility rankings, and targeted reduction strategy recommendations.

The reference design lives at `assets/verdeon-reference.html` — a single-file HTML prototype built with real EPA data. Use it as the visual and data contract. Every page should match this design language exactly.

**This is a website, not a mobile app. Do not use React Native, Expo, or NativeWind.**

---

## 1. Project Goal & Vision

Verdeon's mission: make EPA carbon data accessible and actionable for sustainability teams, ESG analysts, policy researchers, and corporate executives — without needing to wrangle Excel files.

**Core value props:**
1. Real data — all figures sourced directly from EPA GHGRP (2010–2023)
2. Interactive — filter by year, sector, state, facility; see charts update live
3. Actionable — reduction recommendations engine, not just dashboards
4. Beautiful — design-forward, not a government data portal aesthetic

**North star metric:** A sustainability analyst lands on Verdeon and gets their first insight within 30 seconds.

---

## 2. Tech Stack — Decisions & Rationale

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14** (App Router) | SSG for marketing pages, CSR for interactive dashboards |
| Language | **TypeScript** (strict) | Type safety across data layer |
| Styling | **Tailwind CSS v3** | Utility-first, Verdeon tokens in config |
| Charts | **Recharts** | React-native web charts, composable, well-maintained |
| Animation | **Framer Motion** | Page transitions, chart animations, hover states |
| State | **Zustand** | Lightweight client state for filters/active year |
| Data/async | **TanStack Query v5** | Caching, background refresh for any async data |
| Icons | **Lucide React** | Clean, tree-shaken icon set |
| File parsing | **SheetJS (xlsx)** | Parse EPA .xlsx files in the browser |
| Fonts | **next/font** with Google Fonts | Playfair Display + Instrument Sans, no layout shift |
| Testing | **Vitest + React Testing Library** | Unit + component tests |
| Deployment | **Vercel** | Zero-config, edge network |

**Do NOT use:**
- React Native / Expo / NativeWind
- Redux (use Zustand)
- styled-components or emotion (use Tailwind)
- Pages Router (use App Router only)
- Class components (hooks only)

---

## 3. Repository Structure

```
verdeon/
├── CLAUDE.md                        ← this file
├── app/                             ← Next.js App Router
│   ├── layout.tsx                   ← root layout (fonts, providers, nav)
│   ├── page.tsx                     ← landing / marketing page
│   ├── globals.css                  ← Tailwind base + custom CSS vars
│   ├── dashboard/
│   │   └── page.tsx                 ← main dashboard (hero stats + charts)
│   ├── explorer/
│   │   └── page.tsx                 ← data explorer (year/sector filter)
│   ├── facilities/
│   │   └── page.tsx                 ← top emitters table
│   ├── states/
│   │   └── page.tsx                 ← geographic state breakdown
│   ├── recommendations/
│   │   └── page.tsx                 ← reduction strategies engine
│   └── upload/
│       └── page.tsx                 ← file upload + parse
├── components/
│   ├── ui/                          ← primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── StatCard.tsx
│   │   ├── EyebrowLabel.tsx
│   │   └── SectionHeader.tsx
│   ├── charts/                      ← Recharts wrappers
│   │   ├── TrendChart.tsx
│   │   ├── SectorBarChart.tsx
│   │   ├── MiniBarChart.tsx
│   │   └── DonutChart.tsx
│   ├── data/                        ← data-display components
│   │   ├── FacilityTable.tsx
│   │   ├── StateGrid.tsx
│   │   ├── SectorList.tsx
│   │   └── RecommendationCard.tsx
│   ├── layout/
│   │   ├── Navbar.tsx               ← fixed top nav with scroll effect
│   │   ├── Footer.tsx
│   │   └── PageWrapper.tsx
│   └── providers/
│       └── Providers.tsx            ← Zustand + TanStack Query providers
├── lib/
│   ├── data/
│   │   ├── epa-data.json            ← pre-extracted EPA data
│   │   ├── types.ts                 ← TypeScript interfaces
│   │   ├── selectors.ts             ← pure filter/aggregate functions
│   │   └── recommendations.ts      ← reduction strategy engine
│   ├── store/
│   │   └── useEpaStore.ts           ← Zustand store
│   ├── hooks/
│   │   ├── useEmissionsData.ts
│   │   ├── useYearComparison.ts
│   │   └── useSectorBreakdown.ts
│   └── utils/
│       ├── format.ts                ← number/Mt formatters
│       └── colors.ts               ← sector color map
├── constants/
│   ├── design-tokens.ts             ← colors, typography, spacing, shadows
│   ├── sectors.ts                   ← sector names, descriptions, icons
│   └── nav.ts                       ← nav link config
├── assets/
│   ├── verdeon-reference.html       ← visual/data reference (open in browser)
│   ├── epa-data.json                ← source EPA data
│   └── design-tokens.ts            ← design system source
├── public/
│   └── favicon.ico
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 4. Design System

### 4.1 Brand Identity

**Verdeon** (verde + eon) — deep forest greens, warm sand neutrals, Playfair Display serif headlines paired with Instrument Sans for UI text.

**Personality:** Authoritative but accessible. Data-serious but not sterile. Environmental without being clichéd.

### 4.2 Color Tokens (add to tailwind.config.ts)

```typescript
green: {
  950: '#071a10',   // deepest — hero/CTA backgrounds
  900: '#0e3320',   // dark — nav, table headers, featured cards
  800: '#1a5c38',   // primary — buttons, active states
  700: '#237848',   // hover states, links
  600: '#2d9459',   // icons, chart lines, eyebrow text
  500: '#3aad6b',   // secondary actions, pulse dots
  400: '#5ec48a',   // highlights, badges on dark bg
  300: '#8fd9a8',   // light accents on dark backgrounds
  200: '#bfedcf',   // subtle fills, sector dots
  100: '#e4f8eb',   // icon backgrounds, hover fills
  50:  '#f2fdf5',   // page/section backgrounds
},
sand: {
  300: '#d4c7b0',   // dividers, muted logos
  200: '#e8dfce',   // borders
  100: '#f5f0e8',   // alternate section backgrounds
},
charcoal: '#1c1c1e',  // body text
muted: '#6b7a72',     // secondary text, labels
```

### 4.3 Typography

```
Display / Headings → Playfair Display (serif)
  Hero titles:      700, clamp(2.6rem, 4.5vw, 3.8rem), tracking -0.03em
  Section titles:   700, clamp(2rem, 3.5vw, 2.8rem), tracking -0.025em
  Big numbers:      700, context-specific sizes
  Stat cards:       700, Playfair Display

Body / UI → Instrument Sans (sans-serif)
  Body text:        400, 1rem, leading 1.6
  Descriptions:     400, 1.05rem, leading 1.75
  Labels/captions:  500 or 600, 0.72–0.82rem
  Buttons:          600
  Eyebrows:         600, uppercase, 0.75rem, tracking 0.1em, green-600
```

Load via `next/font/google` in `app/layout.tsx`:
```typescript
import { Playfair_Display, Instrument_Sans } from 'next/font/google'
```

### 4.4 Component Patterns

**Cards:**
- `bg-white rounded-[14px] border border-green-100 shadow-card p-5`
- Featured/dark variant: `bg-green-900 text-white border-green-700`

**Buttons:**
- Solid: `bg-green-800 text-white rounded-full font-semibold hover:bg-green-900`
- Outline: `border border-green-700 text-green-800 rounded-full hover:bg-green-50`
- Ghost (on dark): `bg-white/[0.08] text-white border border-white/20 rounded-full`
- Green accent: `bg-green-500 text-green-950 rounded-full` (on dark backgrounds)

**Shadows:**
```css
--shadow-card: 0 2px 20px rgba(14,51,32,.08), 0 1px 4px rgba(14,51,32,.05);
--shadow-lift: 0 8px 40px rgba(14,51,32,.14), 0 2px 8px rgba(14,51,32,.07);
```

**Eyebrow labels:**
```
text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600 mb-2
```

### 4.5 Sector Color Map

Always use these colors consistently across all charts and badges:

```typescript
export const SECTOR_COLORS: Record<string, string> = {
  'Power Plants':    '#0e3320',   // green-900
  'Chemicals':       '#2d9459',   // green-600
  'Petroleum & Gas': '#3aad6b',   // green-500
  'Minerals':        '#5ec48a',   // green-400
  'Waste':           '#8fd9a8',   // green-300
  'Metals':          '#bfedcf',   // green-200
  'Refineries':      '#237848',   // green-700
  'Other':           '#1a5c38',   // green-800
}
```

### 4.6 Animations

- Fade-up on scroll: `opacity-0 translate-y-6` → `opacity-100 translate-y-0`, 0.6s ease, use Intersection Observer
- Nav scroll: add `shadow` class when `scrollY > 20`
- Hero badge: `animate-bounce` subtly (float up/down, 4s infinite)
- Chart bars: animate width on mount with Framer Motion
- Year button active: smooth background transition 0.2s

---

## 5. Data Architecture

### 5.1 TypeScript Types (`lib/data/types.ts`)

```typescript
export interface EpaYearData {
  total_mt: number
  facilities: number
  sectors: Record<string, number>
  top_states: Record<string, number>
  top_facilities: { name: string; mt: number }[]
}

export interface EpaDataset {
  meta: { source: string; url: string; years: string; unit: string }
  years: Record<string, EpaYearData>
}

export type SectorName =
  | 'Power Plants' | 'Chemicals' | 'Petroleum & Gas'
  | 'Minerals' | 'Waste' | 'Metals' | 'Refineries' | 'Other'

export interface SectorBreakdownItem {
  name: string
  mt: number
  pct: number
  color: string
}

export interface Recommendation {
  id: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  potentialReductionPct: number
  sector: SectorName
  tags: string[]
}
```

### 5.2 Selectors (`lib/data/selectors.ts`)

```typescript
getSectorBreakdown(data, year): SectorBreakdownItem[]
getTrendSeries(data): { year: number; total: number }[]
getYoyChange(data, from, to): { absolute: number; percent: number }
getTopFacilities(data, year, n?): { name: string; mt: number }[]
getStateRanking(data, year): { state: string; mt: number; rank: number }[]
getCumulativeReduction(data, baseYear, targetYear): number
```

### 5.3 Zustand Store (`lib/store/useEpaStore.ts`)

```typescript
interface EpaStore {
  activeYear: number              // default 2023
  activeSector: SectorName | null
  activeState: string | null
  uploadedData: EpaDataset | null
  setActiveYear: (year: number) => void
  setActiveSector: (sector: SectorName | null) => void
  setActiveState: (state: string | null) => void
  setUploadedData: (data: EpaDataset) => void
  clearUploadedData: () => void
}
```

---

## 6. Page-by-Page Spec

### `/` — Landing page (`app/page.tsx`)

This is the marketing/hero page. It matches `assets/verdeon-reference.html` section by section:

1. **Hero** — two-column grid: left = headline + desc + CTAs + social proof avatars; right = live dashboard preview card (uses real data from epa-data.json, interactive bar chart, sector rows)
2. **Logos bar** — "Real data from: EPA GHGRP · Direct Emitters 2010–2023 · FLIGHT Tool · Envirofacts · 6,455 Facilities · 8 Sectors"
3. **How it works** — 3 cards: Upload files / Explore dashboards / Act on insights
4. **Data Explorer preview** — trend chart + sector breakdown, year buttons 2010–2023, all interactive with real data
5. **Top Emitters** — year selector + ranked facility table with real data
6. **States grid** — 15 state cards, real 2023 figures
7. **Stats band** — dark green background: 3,197 Mt (2010) / 2,383 Mt (2023) / −25.5% / 6,455 facilities
8. **Pricing** — 3 tiers: Starter $0 / Pro $49/mo / Enterprise custom
9. **Testimonials** — 3 cards
10. **FAQ** — accordion, 6 questions, answers reference real data
11. **CTA** — dark background, "Start understanding your carbon footprint today"
12. **Footer** — 4-column: brand + 3 link cols + EPA data note

### `/dashboard` — Main dashboard (`app/dashboard/page.tsx`)

Full-page analytics dashboard:
- Hero metrics row: total Mt, facilities, YoY change, power plant share
- Full-width TrendChart (all 14 years, tappable)
- Two-column: sector breakdown (DonutChart + bar list) + state rankings
- Year selector synced via Zustand

### `/explorer` — Data Explorer (`app/explorer/page.tsx`)

- Year pills (2010–2023), sector filter chips
- Summary stats update on year change
- TrendChart + SectorBarChart side by side
- Collapsible state list

### `/facilities` — Top Emitters (`app/facilities/page.tsx`)

- Year selector dropdown
- Top-1 highlight card (dark green, Playfair Display name + Mt)
- Full ranked table: rank badge, facility name, Mt, state

### `/states` — States (`app/states/page.tsx`)

- 5-col grid on desktop, 3-col on tablet, 2-col on mobile
- State abbrev + Mt + rank, hover to reveal YoY change

### `/recommendations` — Reduction Strategies (`app/recommendations/page.tsx`)

- Sector chip picker
- Recommendation cards with HIGH/MED/LOW priority (colored left border)
- Combined potential summary card
- Export button

### `/upload` — File Upload (`app/upload/page.tsx`)

- Drag-and-drop zone (accepts .xlsx, .csv, .zip)
- Parse with SheetJS in the browser
- Show detected year, facility count, column preview
- "Use this data" → stores in Zustand, redirects to dashboard

---

## 7. Key Facts — Never Hallucinate These

All real numbers from your EPA GHGRP files:

| Fact | Value |
|------|-------|
| 2010 total | 3,196.57 Mt |
| 2011 total (peak) | 3,207.58 Mt |
| 2023 total (latest) | 2,382.84 Mt |
| Reduction 2010→2023 | −25.5% |
| 2023 facilities | 6,455 |
| Peak facilities | 7,277 (2014) |
| Power Plants 2010 | 2,295.21 Mt |
| Power Plants 2023 | 1,403.94 Mt |
| Power Plants reduction | −38.8% |
| #1 state every year | Texas |
| TX 2023 | 379.85 Mt |
| #1 facility 2023 | James H Miller Jr (AL) — 16.558 Mt |
| #1 facility 2010 | Scherer (GA) — 22.985 Mt |
| COVID dip | 2020: 2,402.68 Mt |
| 2021 rebound | 2,523.51 Mt |

**Always use values from `lib/data/epa-data.json`. Never interpolate or estimate.**

---

## 8. Tailwind Config (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#071a10', 900: '#0e3320', 800: '#1a5c38',
          700: '#237848', 600: '#2d9459', 500: '#3aad6b',
          400: '#5ec48a', 300: '#8fd9a8', 200: '#bfedcf',
          100: '#e4f8eb', 50: '#f2fdf5',
        },
        sand: { 300: '#d4c7b0', 200: '#e8dfce', 100: '#f5f0e8' },
        charcoal: '#1c1c1e',
        muted: '#6b7a72',
      },
      fontFamily: {
        display: ['var(--font-playfair)'],
        body: ['var(--font-instrument)'],
      },
      borderRadius: {
        sm: '8px', md: '14px', lg: '24px', xl: '40px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(14,51,32,.08), 0 1px 4px rgba(14,51,32,.05)',
        lift: '0 8px 40px rgba(14,51,32,.14), 0 2px 8px rgba(14,51,32,.07)',
        glow: '0 8px 30px rgba(58,173,107,.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulse_dot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.5', transform: 'scale(.85)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulse_dot: 'pulse_dot 2s infinite',
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 9. Next.js Config (`next.config.ts`)

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: false },
  experimental: { typedRoutes: true },
}
export default config
```

---

## 10. Task List for Claude Code

Execute in order. Commit after each task.

### TASK 1 — Scaffold
```
1. npx create-next-app@latest verdeon --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"
2. cd verdeon && git init && git add . && git commit -m "chore: next.js scaffold"
3. Install deps: npm install zustand @tanstack/react-query recharts framer-motion lucide-react xlsx
4. npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
5. Create full directory structure from Section 3
6. Copy assets/epa-data.json → lib/data/epa-data.json
7. Copy assets/design-tokens.ts → constants/design-tokens.ts
8. Set up tailwind.config.ts from Section 8
9. Set up next.config.ts from Section 9
10. Create lib/data/types.ts from Section 5.1
11. Set up app/globals.css with CSS custom properties for shadows
12. git commit -m "chore: deps, structure, tokens"
```

### TASK 2 — Data layer
```
1. lib/data/selectors.ts — all selector functions from Section 5.2
2. lib/data/recommendations.ts — seed with real strategies per sector
3. lib/store/useEpaStore.ts — Zustand store from Section 5.3
4. lib/utils/format.ts — formatMt (e.g. "2,383 Mt"), formatPct, formatFacilities
5. lib/utils/colors.ts — SECTOR_COLORS map from Section 4.5
6. constants/sectors.ts — sector names, Lucide icon names, descriptions
7. Vitest unit tests for all selectors
8. git commit -m "feat: data layer"
```

### TASK 3 — UI components
```
Build components/ui/:
- Button.tsx (solid, outline, ghost — all variants from Section 4.4)
- Card.tsx (default + featured dark variant)
- Badge.tsx (HIGH/MED/LOW priority + sector color variants)
- StatCard.tsx (Playfair Display bold number, label, source text)
- EyebrowLabel.tsx
- SectionHeader.tsx (eyebrow + title + desc)
All components typed with explicit prop interfaces. Use Tailwind classes. Match design tokens exactly.
git commit -m "feat: ui component library"
```

### TASK 4 — Charts
```
Build components/charts/ using Recharts:
- TrendChart.tsx: AreaChart, gradient fill (green-600 → transparent), 2010–2023, tappable dots, active year highlighted, tooltip showing Mt value, year labels on x-axis. Accept onYearSelect callback.
- SectorBarChart.tsx: horizontal bar list, each bar colored by SECTOR_COLORS, shows name + Mt + percentage. Animate bar widths on mount with Framer Motion.
- MiniBarChart.tsx: compact 14-column bar chart for hero section, active year in green-600, older years in green-200/300.
- DonutChart.tsx: Recharts PieChart with innerRadius, sector color fills, legend.
All charts responsive (ResponsiveContainer). Match assets/verdeon-reference.html visual style.
git commit -m "feat: chart components"
```

### TASK 5 — Layout components
```
Build components/layout/:
- Navbar.tsx: fixed top, white/85% backdrop-blur, scroll shadow effect via useEffect + scrollY, Verdeon logo (SVG leaf mark + Playfair Display wordmark), nav links (Dashboard, Explorer, Facilities, States, Recommendations), Sign in outline button + Get started solid button. Mobile: hide links, show hamburger.
- Footer.tsx: 4-column grid (brand + Products + Resources + Company), EPA data attribution note, dark green-950 background.
- PageWrapper.tsx: max-w-[1100px] mx-auto px-6 wrapper.
Build components/providers/Providers.tsx: wraps children in QueryClientProvider + any other providers needed.
git commit -m "feat: layout components"
```

### TASK 6 — Landing page
```
Build app/page.tsx. This is the most important page — match assets/verdeon-reference.html section by section:

1. Hero: 2-col grid, left=content, right=live dashboard card. Dashboard card uses real data from epa-data.json: 2,383 Mt / 6,455 facilities / −25.5%, MiniBarChart for all 14 years, 4 sector rows (Power Plants 1,404 Mt, Chemicals 113 Mt, Petroleum & Gas 109 Mt, Minerals 107 Mt). Floating badge: "−814 Mt since 2010 · Verified EPA GHGRP data".
2. Logos bar: "Real data from: EPA GHGRP · Direct Emitters 2010–2023 · FLIGHT Tool · Envirofacts · 6,455 Facilities · 8 Sectors"
3. How it works: 3 cards with step numbers.
4. Data Explorer section: interactive year buttons 2010–2023 (useState), TrendChart + SectorBarChart updating on year change. All real data.
5. Top Emitters: year selector, top-1 highlight card, ranked table. Real facility names from epa-data.json.
6. States grid: 5-col, all 15 states, real 2023 Mt figures.
7. Stats band: dark green-900 bg, 4 stat cards with real numbers.
8. Pricing: 3 tiers.
9. Testimonials: 3 cards referencing real data (TX at 380 Mt, 25% reduction, Power Plants 59%).
10. FAQ: accordion, 6 Qs, answers use real facts.
11. CTA section.
12. Footer.

Fade-up scroll animations on all sections via Intersection Observer.
git commit -m "feat: landing page"
```

### TASK 7 — App pages
```
Build all inner app pages. Each gets the Navbar and Footer via app/layout.tsx.

/dashboard (app/dashboard/page.tsx):
- Metrics row: 2,383 Mt total · 6,455 facilities · −25.5% since 2010 · Power Plants 58.9%
- Full-width TrendChart, year selector pills synced to Zustand activeYear
- 2-col: DonutChart (sector share) + state rankings list
- All data from useEpaStore + selectors

/explorer (app/explorer/page.tsx):
- Year pills 2010–2023 (updates Zustand activeYear)
- Sector filter chips
- Summary stats + TrendChart + SectorBarChart side-by-side
- Collapsible state ranking list

/facilities (app/facilities/page.tsx):
- Year dropdown, synced to Zustand
- Top-1 highlight card (dark green, big Playfair Display name)
- Ranked table with rank badges (top 3 filled dark green)

/states (app/states/page.tsx):
- 5/3/2 col responsive grid
- State card: abbrev + Mt + rank, hover shows YoY delta

/recommendations (app/recommendations/page.tsx):
- Sector chip picker
- Recommendation cards: HIGH (red border) / MEDIUM (amber) / LOW (green)
- Combined potential summary

/upload (app/upload/page.tsx):
- Drag-and-drop zone
- SheetJS parsing, progress state
- Preview: year detected, facility count
- "Use this data" → Zustand → redirect to /dashboard

git commit -m "feat: all app pages"
```

### TASK 8 — Polish & deploy
```
1. app/layout.tsx: load Playfair Display (400, 600, 700) + Instrument Sans (300, 400, 500, 600) via next/font/google. Set --font-playfair and --font-instrument CSS variables. Wrap in Providers component.
2. Add <head> meta: title "Verdeon — Carbon Intelligence Platform", description, og:image
3. Responsive audit: test all pages at 375px, 768px, 1280px. Fix any layout breaks.
4. Accessibility: all interactive elements keyboard-navigable, aria labels on charts, sufficient color contrast.
5. Performance: verify no client-side data fetching on landing page (epa-data.json imported directly), charts lazy-loaded with next/dynamic.
6. Run: npm run build — fix any TypeScript or build errors.
7. Add vercel.json if needed.
8. git commit -m "feat: polish, a11y, build verified"
```

---

## 11. Code Standards

- **TypeScript strict** — no `any`, explicit return types on all functions
- **Server components by default** — only add `'use client'` when needed (charts, interactive filters, Zustand)
- **Named exports** for components, **default export** for pages
- **No inline styles** — Tailwind classes only, CSS vars for shadows
- **All data access via selectors** — pages never compute data directly
- **JSDoc comments** on all exported functions
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`
- **No hardcoded data** in components — always pull from `lib/data/epa-data.json` via selectors

---

## 12. Reference Files in `assets/`

| File | Purpose |
|------|---------|
| `verdeon-reference.html` | Open in browser — full visual prototype, the design contract |
| `epa-data.json` | All 14 years of real EPA GHGRP data — single source of truth |
| `design-tokens.ts` | Color, typography, spacing, shadow tokens |

---

*Last updated: 2026-04-25 | Verdeon v1.0 | Next.js 14 App Router | Real EPA GHGRP data 2010–2023*
