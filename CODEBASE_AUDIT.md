# Blissful Way Academy — Codebase Audit

**Audited:** 2026-08-12
**Repo root:** `c:\Users\HP\Desktop\WEBSITES\Blissfulway Academy`
**Template:** `.bolt/config.json` → `"template": "bolt-vite-react-ts"`
**Git:** single commit — `640c8fe Bolt baseline before audit`

> **Headline finding up front:** this is not a large codebase with a component
> library that needs untangling. It is **one 174-line file** (`src/App.tsx`) that
> contains the entire site, with four individual JSX lines exceeding 1,700
> characters each. There is no `src/components/` directory, no router, no data
> layer, and no stock photography. The build is green and the TypeScript is
> clean. The problem is not correctness — it is that nothing is decomposed.

> **Auditor's note on side effects:** `node_modules/` was absent, so `npm ci` was
> run to answer the build question, which also produced `dist/`. Both are
> gitignored. No source file was created, edited, or deleted other than this
> report.

---

## 1. Stack

### Exact versions

Resolved from `package.json` and confirmed against the actual install (`npm ls --depth=0`).

| Package | Declared (`package.json`) | Installed |
|---|---|---|
| `react` | `^18.3.1` | **18.3.1** |
| `react-dom` | `^18.3.1` | **18.3.1** |
| `typescript` | `^5.5.3` | **5.6.3** |
| `vite` | `^5.4.2` | **5.4.8** |
| `tailwindcss` | `^3.4.1` | **3.4.17** |
| `lucide-react` | `^0.446.0` | **0.446.0** |
| `@supabase/supabase-js` | `^2.57.4` | **2.57.4** |

### Runtime dependencies (all four)

`package.json:13-18`

```json
"dependencies": {
  "@supabase/supabase-js": "^2.57.4",
  "lucide-react": "^0.446.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Dev dependencies

`@eslint/js` 9.12.0 · `@types/react` 18.3.11 · `@types/react-dom` 18.3.0 ·
`@vitejs/plugin-react` 4.3.2 · `autoprefixer` 10.4.20 · `eslint` 9.12.0 ·
`eslint-plugin-react-hooks` 5.1.0-rc-fb9a90fa48-20240614 ·
`eslint-plugin-react-refresh` 0.4.12 · `globals` 15.11.0 · `postcss` 8.4.47 ·
`typescript-eslint` 8.8.1

### Unused / duplicated

| Item | Verdict |
|---|---|
| **`@supabase/supabase-js`** | ⚠️ **Completely unused.** `grep -rn "supabase" src/` returns nothing. It ships in `dependencies` (not dev), adds a full auth/realtime/postgrest client to the dependency tree, and there is no `.env`, no client singleton, no `src/lib/`. Bolt installed it speculatively. It is **not** in the 175 kB bundle (tree-shaken because nothing imports it), so it costs install time, not runtime. |
| **`eslint-plugin-react-hooks` @ `5.1.0-rc.0`** | ⚠️ Pinned to a **release candidate**, which resolved to the experimental build `5.1.0-rc-fb9a90fa48-20240614`. Not a duplicate, but not a version you want on a production site. |
| **`lucide-react`** | Used, but see the three dead imports in §10. Also explicitly excluded from dep pre-bundling in `vite.config.ts:13-15` (`optimizeDeps.exclude`), a Bolt template default that slows cold dev-server starts for no benefit here. |
| **`@` path alias** | ⚠️ Configured in **two** places — `vite.config.ts:8-12` and `tsconfig.app.json:18-21` — and **never used once**. `grep -rn "from '@/" src/` → no matches. The `.bolt/prompt` file instructs future generations to use it. Harmless, but currently pure ceremony. |
| Duplicated packages | None. |

### Does `npm run build` succeed?

**Yes.** Exit code 0, no errors.

```
> vite-react-typescript-starter@0.0.0 build
> vite build

vite v5.4.8 building for production...
transforming...
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
✓ 1568 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   2.50 kB │ gzip:  0.94 kB
dist/assets/index-tFxjdsT_.css   31.81 kB │ gzip:  5.73 kB
dist/assets/index-C2TkpTeC.js   175.26 kB │ gzip: 54.20 kB
✓ built in 35.87s
```

The only output is a `caniuse-lite` staleness notice — a warning from Browserslist, not a build error.

**`npm run typecheck`** (`tsc --noEmit -p tsconfig.app.json`) — **clean, zero output, exit 0.** Note `"strict": true` is on (`tsconfig.app.json:24`), so this is a meaningful pass.

**`npm run lint`** — **3 errors** (verbatim, §10).

**`npm audit`** — `18 vulnerabilities (2 low, 4 moderate, 12 high)`. All in the dev toolchain (Vite 5.4.8 / esbuild lineage); none reach the shipped bundle. Not urgent, but a `vite` major bump clears most of it.

---

## 2. File tree

```
Blissfulway Academy/
├── .bolt/
│   ├── config.json                                     3 lines
│   └── prompt                                          7 lines
├── public/
│   └── assets/images/
│       └── Blissful_way_Academy_Logo.jpg          (508 KB binary)
├── src/
│   ├── App.tsx                                       174 lines  ← entire site
│   ├── index.css                                      20 lines
│   ├── main.tsx                                       10 lines
│   └── vite-env.d.ts                                   1 line
├── index.html                                         29 lines
├── package.json                                       35 lines
├── package-lock.json                             (145 KB)
├── tailwind.config.js                                 13 lines
├── postcss.config.js                                   6 lines
├── vite.config.ts                                     16 lines
├── eslint.config.js                                   28 lines
├── tsconfig.json                                       7 lines
├── tsconfig.app.json                                  30 lines
├── tsconfig.node.json                                 22 lines
└── .gitignore                                         22 lines
```

**`src/` total: 205 lines across 4 files.**

### Files over 300 lines

**None.** But this metric is actively misleading here and should not be used to judge the scope of work.

`src/App.tsx` is 174 lines and **23,695 characters** — an average of 136 characters per line, with entire page sections collapsed onto single lines. Longest lines:

| Line | Chars | What it is |
|---|---|---|
| `src/App.tsx:168` | **2,151** | The entire footer |
| `src/App.tsx:161` | **2,047** | The entire tutors section |
| `src/App.tsx:163` | **1,788** | The entire pricing section |
| `src/App.tsx:159` | **1,735** | The entire programmes section |
| `src/App.tsx:148` | **1,201** | The hero "live classroom" mock card |
| `src/App.tsx:157` | 948 | The entire trust bar |
| `src/App.tsx:165` | 923 | The final CTA band |
| `src/App.tsx:129` | 527 | The mobile nav drawer |

Reformatted at a normal 100-column width, `App.tsx` would be roughly **900–1,100 lines**. Treat it as a 1,000-line file, not a 174-line one. Every diff against these lines is a whole-line diff; code review and merge conflicts on this file are effectively impossible until it is reflowed.

---

## 3. Routing

**There is no router.** No `react-router-dom`, no `@tanstack/router`, nothing in `dependencies`. `main.tsx` renders `<App />` directly with no provider:

`src/main.tsx:6-10`
```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

This is **one scrolling single-page site with anchor-link navigation**. Smooth scrolling is enabled globally in CSS (`src/index.css:6`, `html { scroll-behavior: smooth; }`).

### Every section id on the page

| `id` | Element | File:line | In header nav? | In footer nav? |
|---|---|---|---|---|
| `home` | Hero `<section>` | `src/App.tsx:133` | ✅ | ✅ (logo link) |
| `igbo-heritage` | Programmes `<section>` | `src/App.tsx:159` | ✅ | ✅ |
| `math-logic` | 2nd `<article>` inside programmes | `src/App.tsx:159` | ✅ | ✅ |
| `pricing` | Pricing `<section>` | `src/App.tsx:163` | ✅ | ✅ |
| `our-tutors` | Tutors `<section>` | `src/App.tsx:161` | ✅ | ✅ |

**Sections with no id (not linkable):** the trust bar (`src/App.tsx:157`) and the final CTA band (`src/App.tsx:165`).

⚠️ **`math-logic` is a fragile anchor.** It is not a section — it is applied to the second card in a `.map()` via an index equality check:

`src/App.tsx:159`
```tsx
{programs.map(({ icon: Icon, ...program }, index) =>
  <article key={program.title} id={index === 1 ? 'math-logic' : undefined} ...>
```

Reorder the `programs` array (§5) or add a third programme, and the "Math & Logic" links in both the header and footer silently point at the wrong card. The id belongs on the data object, not on an array index.

⚠️ **Sticky-header scroll offset.** The header is `sticky top-0` with a fixed `h-[76px]` (`src/App.tsx:117-118`), but no `scroll-margin-top` / `scroll-padding-top` is set anywhere. Every anchor jump lands ~76px too far down, hiding each section's heading behind the header.

---

## 4. Components

### The real inventory

There are exactly **two** React components in the entire codebase, plus one type alias.

| Name | File | Lines | Props | Reusable? |
|---|---|---|---|---|
| `App` | `src/App.tsx:108-172` | 65 (~800 reflowed) | none | ❌ **One-off.** It *is* the site: header, hero, trust bar, programmes, tutors, pricing, CTA, footer, and modal mount — all inline in a single return statement. |
| `BookingModal` | `src/App.tsx:61-106` | 46 | `{ open: boolean; onClose: () => void }` (type `BookingModalProps`, `src/App.tsx:28`) | ⚠️ **Half.** The shell (open/close, body-scroll lock, backdrop, success state) is genuinely generic, but the heading, copy, six form fields, and the literal string `$15 trial` are hardcoded into it. Reusable as a *pattern*; not reusable as a *component*. |

### Everything else that *should* be a component but isn't

These are page regions with no component boundary, no props, and no file of their own. Listed with the single line each occupies:

| Region | File:line | Chars on that line | Data source | Extractable? |
|---|---|---|---|---|
| Header + desktop nav | `src/App.tsx:117-128` | — | nav array literal inlined twice | ✅ easy |
| Mobile nav drawer | `src/App.tsx:129` | 527 | **duplicate** of the header nav array | ✅ easy — and fixes the duplication |
| Hero (copy + CTAs + avatar row) | `src/App.tsx:136-142` | — | 100% baked into JSX | ✅ easy |
| Hero "live classroom" mock card | `src/App.tsx:143-153` | 1,201 on `:148` | 100% baked into JSX | ⚠️ dense but mechanical |
| Trust bar | `src/App.tsx:157` | 948 | **inline `.map()` over an anonymous array literal** | ✅ easy — extract array first |
| Programmes section | `src/App.tsx:159` | 1,735 | `programs` const | ✅ easy |
| Programme card | inside `:159` | — | `programs[]` item | ✅ **best reuse candidate in the codebase** |
| Tutors section | `src/App.tsx:161` | 2,047 | `tutors` const | ✅ easy |
| Tutor card | inside `:161` | — | `tutors[]` item | ✅ **best reuse candidate in the codebase** |
| Pricing section | `src/App.tsx:163` | 1,788 | `pricing` const | ✅ easy |
| Pricing card | inside `:163` | — | `pricing[]` item | ✅ good candidate |
| Final CTA band | `src/App.tsx:165` | 923 | 100% baked into JSX | ✅ easy |
| Footer | `src/App.tsx:168` | 2,151 | 100% baked into JSX incl. email/phone | ✅ easy |

**Duplication worth naming:** the navigation array

```tsx
[['Home', 'home'], ['Igbo Heritage', 'igbo-heritage'], ['Math & Logic', 'math-logic'],
 ['Our Tutors', 'our-tutors'], ['Pricing', 'pricing']]
```

is written out **verbatim twice** — desktop nav at `src/App.tsx:124` and mobile drawer at `src/App.tsx:129` — and a third, differently-shaped copy of the same links lives in the footer at `src/App.tsx:168`. Three places to edit for one nav change.

**Note on styling reuse:** the codebase *does* have a real reuse layer, just in CSS rather than JSX. `src/index.css:11-20` defines seven `@layer components` classes — `.button-gold`, `.button-outline`, `.section-kicker`, `.section-title`, `.section-copy`, `.form-input`, `.avatar`, `.social` — and they are used consistently throughout. This is the healthiest part of the codebase and should survive any refactor intact.

---

## 5. Where the content lives — MOST IMPORTANT

### Verdict: **local `const` arrays at the top of `src/App.tsx`. No separate data files, no fetch, no CMS, no types.**

All three content sets are module-scope constants in lines 30–59 of `App.tsx`, above the components that consume them. Nothing is fetched; nothing is typed beyond TypeScript's inference.

| Content | Where | Lines | Shape | Swap difficulty |
|---|---|---|---|---|
| **Programmes** | `src/App.tsx:30-47` | 18 | 2 objects: `eyebrow`, `title`, `description`, `bullets[]`, `icon`, `accent` | 🟡 Medium — `icon` holds a **React component reference** |
| **Tutors** | `src/App.tsx:49-53` | 5 | 3 objects: `name`, `role`, `initials`, `color`, `quote` | 🟢 **Easy — pure strings** |
| **Pricing** | `src/App.tsx:55-59` | 5 | 3 objects: `name`, `price`, `detail`, `description`, `features[]`, `featured` | 🟢 **Easy — pure strings + one boolean** |
| Trust bar | `src/App.tsx:157` | inline | anonymous array **inside** JSX | 🟡 Must be lifted out first |
| Hero, CTA, footer, contact details | `src/App.tsx:136-153`, `:165`, `:168` | — | **raw JSX text nodes** | 🔴 Hardcoded prose; needs manual extraction |

### Representative snippet: how a tutor card gets its data

**Step 1 — the data** (`src/App.tsx:49-53`, verbatim, all three entries):

```tsx
const tutors = [
  { name: 'Amaka Okoye', role: 'Lead Igbo Language & Cultural Tutor', initials: 'AO', color: 'from-amber-200 to-orange-600', quote: 'Language is a bridge to belonging.' },
  { name: 'David Mensah', role: 'K–12 Mathematics & Logic Tutor', initials: 'DM', color: 'from-cyan-200 to-blue-700', quote: 'Every child can learn to love the why.' },
  { name: 'Nneka Eze', role: 'Early Years Learning Specialist', initials: 'NE', color: 'from-rose-200 to-red-700', quote: 'Curiosity is the first classroom.' },
];
```

**Step 2 — the render** (`src/App.tsx:161`, the 2,047-character line, reflowed here for readability — the source is one line):

```tsx
{tutors.map((tutor) => (
  <button
    key={tutor.name}
    onClick={() => setActiveTutor(activeTutor === tutor.name ? null : tutor.name)}
    className="group text-left"
  >
    <div className={`relative aspect-[.9] overflow-hidden rounded-3xl bg-gradient-to-br ${tutor.color} p-5`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.5),transparent_28%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex justify-between">
          <span className="rounded-full bg-black/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-200">
            CDEP certified
          </span>
          <span className="rounded-full bg-black/20 p-2 text-black/70">
            <Play size={15} fill="currentColor" />
          </span>
        </div>
        <div className="flex items-end justify-center">
          <span className="font-serif text-[8rem] leading-none text-black/50 transition duration-500 group-hover:scale-105">
            {tutor.initials}
          </span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-black/60 p-3 backdrop-blur-md">
        <p className="text-xs italic text-amber-100">“{tutor.quote}”</p>
      </div>
    </div>
    <h3 className="mt-5 text-base font-semibold text-white">{tutor.name}</h3>
    <p className="mt-1 text-xs leading-5 text-neutral-500">{tutor.role}</p>
    {activeTutor === tutor.name && (
      <div className="mt-3 flex items-center gap-2 text-xs text-amber-300">
        <Play size={12} fill="currentColor" /> Playing 45-second introduction
      </div>
    )}
  </button>
))}
```

### How hard is it to swap this for a database query?

**Easier than you would expect. The array/render separation is already correct** — the JSX is a clean `.map()` over a data array and never reaches around it. That is the hard part, and it is already done. Realistic assessment:

**🟢 What makes it easy**
- All three content sets are **already arrays of plain objects**, already mapped over. Replacing `const tutors = [...]` with `const tutors = await db.tutors.findMany()` is a one-line change per section, provided the query returns the same key names.
- `tutors` and `pricing` contain **only JSON-safe primitives** (strings, string arrays, one boolean). They serialize across a network boundary with zero transformation.
- Three tutors, three tiers, two programmes — the seed data is trivially small.
- Zero coupling between sections. Each can be migrated independently.

**🟡 What needs a decision**
1. **`icon` holds a live React component, not data.** `src/App.tsx:36` is `icon: BookOpen` — a direct reference to a `lucide-react` component, destructured at render as `{ programs.map(({ icon: Icon, ...program }) => ...)}`. A database can only store the *string* `"BookOpen"`. You need a lookup map (`const ICONS = { BookOpen, Ruler, ... }`) at the render boundary. Same issue in the trust bar (`Award`, `Globe2`, `MessageCircle`, `Target` at `src/App.tsx:157`).
2. **Tailwind class strings are stored as content.** `color: 'from-amber-200 to-orange-600'` (tutors) and `accent: 'from-amber-400/20 via-transparent to-transparent'` (programmes) put presentation in the data layer. Worse, **Tailwind's JIT scans source files at build time** — class names arriving from a database at runtime will not be in the generated CSS and will silently render unstyled. You must either safelist them in `tailwind.config.js` or, better, store a semantic token (`"amber"`, `"cyan"`) and map it to classes in the component.
3. **No TypeScript interfaces exist for any of this.** Types are inferred from the literals. You will need to author `Tutor`, `Programme`, and `PricingTier` interfaces before a query result can be type-checked against the render. Small job, but currently zero of it is done.
4. **`price: '$100'` is a formatted display string,** not a number with a currency. Any real pricing table stores `amount_cents` + `currency`; formatting moves into the component.
5. **`initials: 'AO'` is denormalised** and, more importantly, there are **no tutor photographs anywhere** — the cards render giant initials over a CSS gradient. Adding a real `photo_url` column changes the card's visual design, not just its data.
6. **The `math-logic` anchor is bound to array index 1** (§3). Database ordering is not guaranteed; this must become a `slug` field before any query replaces the array.

**🔴 What stays hardcoded regardless**
Hero headline and subcopy, all trust-bar strings, the final CTA band, the entire footer including `blissfulwayacademy@gmail.com` and `+234 8104748877` (`src/App.tsx:168`), the modal's heading and its six field definitions, and the `$15 trial` price string — which appears as literal text in **five separate places** (`src/App.tsx:83`, `:126`, `:129`, `:140`, `:165`). Changing the trial price today is a five-site find-and-replace.

**Bottom line:** budget roughly **2–4 hours** to move tutors, programmes, and pricing behind a database — most of it spent on the icon lookup, the Tailwind safelist problem, and writing the interfaces, not on the queries. The prose content (hero/footer/CTA) is a separate and larger extraction job if you want it editable too. And note that `@supabase/supabase-js` is *already installed* (§1) — the intended backend was evidently anticipated and then never wired up.

---

## 6. Design tokens

### What `tailwind.config.js` actually defines

The **entire** config, verbatim (`tailwind.config.js`, 13 lines):

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

**Fonts: yes, defined.** ✅
**Colors: no named colors whatsoever.** ❌ No `theme.extend.colors`. There is no `brand`, no `gold`, no `ink`. Every colour in the site is a **raw Tailwind palette utility written inline in the JSX**.

The de-facto brand palette is `amber-400` (primary gold) on `neutral-950` (ink), but that is a convention held together by repetition, not by a token. Rebranding to a different gold means find-and-replacing `amber-300`, `amber-400`, `amber-500`, `amber-950`, `amber-100`, and `amber-200` across ~90 class-name occurrences, in four 2,000-character lines, by hand.

### Colour count

**Raw hex literals in source: 3 distinct values**, all arbitrary-value Tailwind classes in `src/App.tsx` (plus one repeat in `index.css`):

| Hex | Occurrences | Where |
|---|---|---|
| `#171717` | 4 | `bg-[#171717]` `src/App.tsx:146`, `via-[#171717]` `:148`, `border-[#171717]` in `.avatar` `src/index.css:18` |
| `#251d0e` | 1 | `from-[#251d0e]` `src/App.tsx:148` |
| `#0c1318` | 1 | `to-[#0c1318]` `src/App.tsx:148` |

Plus one inline `rgba(255,255,255,.5)` inside the radial-gradient arbitrary value at `src/App.tsx:161`.

**Named Tailwind colour tokens in use: 28 distinct** (each resolving to its own hex at build time), spanning **10 palette families**:

`amber` (100/200/300/400/500/950 — 9 distinct token+shade combos, ~90 uses) · `neutral` (200/300/400/500/600/800/900/950) · `white` · `black` · `emerald` (200/300/400/700) · `sky` (200/400) · `blue` (700) · `rose` (200) · `red` (700) · `orange` (500/600) · `cyan` (200) · `green` (700)

**So: roughly 31 distinct colour values ship** (28 palette-derived + 3 hand-written hex). The user's guess of `bg-[#0A0A0A]`-style arbitrary hex everywhere is **wrong** — this codebase is disciplined about using the Tailwind palette, and `#171717` is genuinely the only hex used more than once. The real token problem is not arbitrary hex; it is that **none of the 28 palette colours is aliased to a semantic name**.

### Arbitrary-value classes

**44 total arbitrary-value utilities** across `App.tsx` and `index.css`. The bulk are typography and letter-spacing, not colour:

| Category | Count | Examples |
|---|---|---|
| Font size | 17 | `text-[10px]` ×9, `text-[9px]` ×3, `text-[13px]`, `text-[8rem]`, `text-[4.35rem]`, `text-[2.7rem]` |
| Letter spacing | 11 | `tracking-[0.18em]` ×5, `tracking-[0.2em]` ×3, `tracking-[0.24em]` ×2, `tracking-[-0.03em]`, `tracking-[-0.02em]` |
| Colour / gradient | 5 | `bg-[#171717]`, `via-[#171717]`, `from-[#251d0e]`, `to-[#0c1318]`, `border-[#171717]`, `bg-[radial-gradient(...)]` |
| Layout / sizing | 11 | `h-[76px]`, `z-[60]`, `rounded-[28px]`, `rounded-[20px]`, `min-h-[48px]`, `min-h-[340px]`, `max-h-[92vh]`, `aspect-[1.18]`, `aspect-[.9]`, `blur-[120px]`, `leading-[1.08]` |
| Grid templates | 2 | `grid-cols-[1.5fr_1fr_1fr]`, `grid-cols-[1.03fr_.97fr]` |

`text-[10px]` appearing nine times and `tracking-[0.18em]` five times are textbook cases for `theme.extend.fontSize` / `letterSpacing` entries.

### Fonts — which and how loaded

**Two families.**

| Family | Role | Weights requested | Used via |
|---|---|---|---|
| **Cinzel** | Display / headings | 400, 500, 600, 700 | `font-serif` (mapped in `tailwind.config.js:7`) |
| **Inter** | Body / UI | 300, 400, 500, 600, 700 | `font-sans`, applied globally on `body` (`src/index.css:7`) |

**Loading mechanism:** a render-blocking Google Fonts stylesheet in `index.html:5-7`, with correct preconnects and `display=swap`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

⚠️ **Nine weights are downloaded; the site uses far fewer.** Cinzel is only ever rendered at its default weight plus `font-bold` (one instance, `src/App.tsx:159`) — so 500 and 600 are dead weight. This is a third-party render-blocking request on the critical path; self-hosting (or `next/font` after a port) removes an entire DNS+TLS round trip to `fonts.gstatic.com`.

---

## 7. Forms and interactivity

### Is there a booking modal or contact form?

**One booking modal. No contact form.** The `BookingModal` component (`src/App.tsx:61-106`) is the site's only form. It is opened from **six** triggers, all calling `openBooking` (`src/App.tsx:113`):

| Trigger | File:line |
|---|---|
| Header "Book $15 Trial" (desktop, `sm:` and up) | `src/App.tsx:126` |
| Mobile drawer "Book $15 Trial" | `src/App.tsx:129` |
| Hero "Book a $15 trial session" | `src/App.tsx:140` |
| Pricing "Claim your spot" ×3 (one per tier) | `src/App.tsx:163` |
| Final CTA "Book their $15 trial" | `src/App.tsx:165` |

### Fields

Six, all `required` (`src/App.tsx:86-91`):

| # | Label | `name` | Type | Options |
|---|---|---|---|---|
| 1 | Parent full name | `name` | `text` (default) | — |
| 2 | Email address | `email` | `email` | — |
| 3 | Phone number | `phone` | `tel` | — |
| 4 | Child's age | `age` | `select` | 4–6 / 7–9 / 10–12 / 13–16 years |
| 5 | Subject interest | `subject` | `select` | Igbo / Math / Both |
| 6 | Preferred time slot | `time` | `select` | Weekday mornings / afternoons / evenings / Saturday |

There is **no message/notes field**, no timezone field (for a service selling to US, UK, and Canada from a `+234` number, that omission is a real operational gap), and no consent/marketing checkbox.

### Where does submit go?

**Nowhere. The data is discarded.** This is the single most important functional finding in the codebase.

`src/App.tsx:71-74`, verbatim and complete:

```tsx
const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setSubmitted(true);
};
```

That is the entire handler. Not a `console.log`, not a `mailto:`, not a `fetch`, not a Supabase insert, not a Formspree action. The `<form>` element has **no `action` and no `method`** (`src/App.tsx:85`). The `name` attributes on all six inputs are never read — no `FormData`, no controlled state, no `useRef`. The browser holds the values, `preventDefault()` stops the navigation, and the values are garbage-collected when the modal unmounts.

The user is then shown a success screen that actively asserts follow-up will happen (`src/App.tsx:96-101`):

```tsx
<h2 className="font-serif text-3xl text-white">You&apos;re on your way.</h2>
<p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
  Thank you for reaching out. Our learning concierge will be in touch shortly
  to arrange your child&apos;s trial session.
</p>
```

🔴 **If this site is live, every trial booking submitted since launch has been silently lost, and each of those parents was told someone would contact them.** The only working contact routes on the entire page are the `mailto:` and `tel:` links in the footer (`src/App.tsx:168`). This should be treated as the highest-priority fix regardless of what else happens to the codebase.

### Every piece of client state

Four `useState` hooks and one `useEffect`. That is the complete interactive surface.

| State | Component | Line | Type | Purpose | Notes |
|---|---|---|---|---|---|
| `modalOpen` | `App` | `:109` | `boolean` | Booking modal visibility | Set by 6 triggers, cleared by `onClose` |
| `menuOpen` | `App` | `:110` | `boolean` | Mobile nav drawer | Correctly closed on link click and on `openBooking` |
| `activeTutor` | `App` | `:111` | `string \| null` | Which tutor "video" is toggled | ⚠️ **Fake.** Toggling only renders the text *"Playing 45-second introduction"* (`src/App.tsx:161`). There is no video element, no source, no player. The `<Play>` icon on every tutor card promises media that does not exist. |
| `submitted` | `BookingModal` | `:62` | `boolean` | Swap form ↔ success screen | ⚠️ **Never reset.** Reopening the modal after a submit shows the success screen again, not a fresh form — see below. |

**Side effect** (`src/App.tsx:64-67`) — body scroll lock, correctly written with cleanup:

```tsx
useEffect(() => {
  document.body.style.overflow = open ? 'hidden' : '';
  return () => { document.body.style.overflow = ''; };
}, [open]);
```

### Interactivity bugs found

1. 🔴 **Form data discarded** (above).
2. 🟠 **`submitted` never resets.** `BookingModal` returns `null` when closed (`src/App.tsx:69`) but is **not unmounted** — it is always rendered at `src/App.tsx:169`, so React preserves its state. Submit once, close, then click any of the six "Book" buttons again: you get the "You're on your way" screen with no form. A second child can never be booked without a page reload. Fix is one line — reset `submitted` in the `open` effect.
3. 🟠 **Hook ordering violation.** `src/App.tsx:69` has `if (!open) return null;` placed **after** `useState`/`useEffect` — legal here by luck, but the early return sits between the hooks and `handleSubmit`, and any future hook added below line 69 will crash with "rendered fewer hooks than expected". ESLint's `react-hooks` plugin does not flag it because the hooks happen to precede the return.
4. 🟡 **No Escape-key close and no focus trap** on the modal. Closing requires a mouse (backdrop or ✕ button). Keyboard and screen-reader users are stuck inside; focus is never moved into the dialog on open, nor restored on close.
5. 🟡 **Backdrop close uses `onMouseDown`, not `onClick`** (`src/App.tsx:77-78`). Press inside the dialog, drag out, release → the modal closes and the user loses everything typed. Text selection that ends outside the panel triggers it too.
6. 🟡 **Missing dialog semantics.** The overlay is a plain `<div>` with no `role="dialog"`, no `aria-modal="true"`, no `aria-labelledby`. Background content is never `inert`/`aria-hidden`.
7. 🟡 **No `autoComplete` attributes** on name/email/phone — browser autofill won't assist, which measurably depresses conversion on a lead form.
8. 🟡 **No loading, error, or validation-message states** — unsurprising given there is no submission, but they must be built as part of any wiring-up.

---

## 8. Assets

### Every image on the site

**There is exactly one image file in the entire project.**

| Asset | Path | Type | Size | Used at |
|---|---|---|---|---|
| Academy logo/crest | `public/assets/images/Blissful_way_Academy_Logo.jpg` | **Local file in `public/`** ✅ | **519,966 bytes (508 KB)** | Header `src/App.tsx:120`, footer `src/App.tsx:168`, favicon `index.html:8`, OG image `index.html:16`, Twitter image `index.html:20` |

Both `<img>` usages, verbatim:

```tsx
<img src="/assets/images/Blissful_way_Academy_Logo.jpg" alt="Blissful Way Academy crest" className="h-11 w-11 rounded-full object-cover ring-1 ring-amber-400/50" />
<img src="/assets/images/Blissful_way_Academy_Logo.jpg" alt="Blissful Way Academy crest" className="h-10 w-10 rounded-full object-cover" />
```

### 🟢 Hotlinked stock images: **NONE.** Explicitly verified.

A full scan for external URLs across `src/` and `index.html` returns **four** results, and not one is an image:

```
index.html:https://fonts.googleapis.com
index.html:https://fonts.googleapis.com/css2?family=Cinzel...&family=Inter...&display=swap
index.html:https://fonts.gstatic.com
index.html:https://schema.org        ← JSON-LD @context, not a request
```

**Zero `pexels.com`, zero `unsplash.com`, zero `images.` CDN references, zero `<img>` pointing off-domain.** This is the usual failure mode of Bolt-generated sites and this project does not have it. Nothing needs to be de-hotlinked before launch.

### 🔴 The one serious asset problem

**A 508 KB JPEG is being served to render a 44×44 px avatar.** The header renders it at `h-11 w-11` (44 px) and the footer at `h-10 w-10` (40 px). At 2× DPR the largest needed decode is 88×88 px — call it **4 KB as a WebP**. The file as shipped is **roughly 125× larger than necessary**, it is on the critical rendering path, it is the same byte-identical file used as the favicon (so it downloads regardless), and Vite copies it through to `dist/assets/images/` untouched (confirmed in the build output — `dist/` is 508 KB of logo versus 175 KB of JavaScript; **the logo is 74% of the deployed payload**).

It is also a **`.jpg`, so it has no transparency** — the circular crop is achieved with `rounded-full object-cover`, meaning a square photo is being masked rather than a transparent PNG/SVG being placed.

### How images are *not* used

The design deliberately avoids photography, which is why the count is one:

- **Tutors** render giant CSS-gradient tiles with initials (`AO`, `DM`, `NE`) instead of headshots — `src/App.tsx:161`. Real tutor photos would be a design change, not a swap.
- **Hero social proof** renders four gradient circles with the letters `A`, `J`, `K`, `M` instead of parent/child avatars — `src/App.tsx:141`.
- **The hero "live classroom" panel** is a hand-built CSS mock (gradients, blur, icons), not a screenshot or product image — `src/App.tsx:143-153`.
- **Programme cards** use `lucide-react` icons (`BookOpen`, `Ruler`), not illustrations.

All decorative visuals are CSS gradients and blurs (`blur-[120px]`, `blur-3xl`, `bg-gradient-to-br`) plus inline SVG from Lucide. There is no icon sprite and no SVG asset file.

### Videos and embeds

**None.** No `<video>`, no `<iframe>`, no YouTube/Vimeo/Loom, no `<audio>`, no third-party widget (no Calendly, no Intercom, no chat bubble), no analytics script, no tag manager, no pixel.

⚠️ **But the UI promises video.** Every tutor card renders a `<Play>` icon button (`src/App.tsx:161`), and clicking a card displays *"Playing 45-second introduction"* — with nothing behind it (§7). Three tutor intro videos are an implied content deliverable that does not exist yet.

---

## 9. SEO state

### The `<head>` section, quoted in full

`index.html:1-24`, verbatim:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="icon" type="image/jpeg" href="/assets/images/Blissful_way_Academy_Logo.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blissful Way Academy | Online Igbo Language &amp; Math Tutors for Diaspora Kids</title>
    <meta name="description" content="Blissful Way Academy provides live 1-on-1 online Igbo language and K-12 Math tutoring for diaspora children in the US, UK, and Canada. Book a $15 trial session today!" />
    <meta name="keywords" content="Online Igbo language classes for kids, Learn Igbo online diaspora UK US, Quantitative reasoning online tutor, Nigerian online math tutors for children, Igbo language tutors near me, Blissful Way Academy" />
    <meta property="og:title" content="Blissful Way Academy | Connect Your Kids to Igbo Roots &amp; STEM Excellence" />
    <meta property="og:description" content="Interactive 1-on-1 online Igbo &amp; Math tutoring tailored for kids in the US, UK, and Canada." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/assets/images/Blissful_way_Academy_Logo.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Blissful Way Academy | Connect Your Kids to Igbo Roots &amp; STEM Excellence" />
    <meta name="twitter:description" content="Interactive 1-on-1 online Igbo &amp; Math tutoring tailored for kids in the US, UK, and Canada." />
    <meta name="twitter:image" content="/assets/images/Blissful_way_Academy_Logo.jpg" />
    <script type="application/ld+json">
      {"@context":"https://schema.org","@type":"EducationalOrganization","name":"Blissful Way Academy","description":"Live online Igbo language and K-12 Math tutoring for diaspora children.","email":"blissfulwayacademy@gmail.com","telephone":"+2348104748877","address":{"@type":"PostalAddress","addressCountry":"NG"}}
    </script>
  </head>
```

### What's present ✅

| Tag | Status |
|---|---|
| `<html lang="en">` | ✅ Present |
| `charset` | ✅ `UTF-8`, first in head |
| `viewport` | ✅ Correct, no `user-scalable=no` |
| `<title>` | ✅ 79 chars — slightly over the ~60-char SERP cut but well-targeted |
| `meta description` | ✅ 178 chars — over the ~155-char display limit, will be truncated after "…Canada." Includes a CTA. |
| `og:title` / `og:description` / `og:type` / `og:image` | ✅ Present |
| `twitter:card` / `title` / `description` / `image` | ✅ Present |
| **JSON-LD** | ✅ **Present** — valid `EducationalOrganization` |
| Favicon | ✅ Present (but see §8 — it is the 508 KB JPEG) |

This is **markedly better than a default Bolt scaffold**, which typically ships `<title>Vite + React + TS</title>` and nothing else. Someone did real SEO work here.

### What's missing or wrong ⚠️

| Issue | Severity | Detail |
|---|---|---|
| **`og:image` is a relative path** | 🔴 High | `content="/assets/images/Blissful_way_Academy_Logo.jpg"` (`index.html:16`, same at `:20`). The OG spec requires an **absolute URL**. Facebook, LinkedIn, WhatsApp, iMessage, and Slack will all fail to resolve it — **link previews will render with no image.** |
| **No `og:url`** | 🔴 High | Canonical identity for the share graph is undefined. |
| **No `<link rel="canonical">`** | 🔴 High | Nothing prevents duplicate indexing across `www`/apex/trailing-slash/deploy-preview URLs. |
| **`twitter:card` is `summary_large_image`** | 🟠 Med | That card wants a 1200×630 landscape image; the supplied asset is a square logo. Twitter/X will crop it badly or downgrade the card. There is **no 1200×630 social share image in the project at all.** |
| **No `og:site_name`, no `og:locale`** | 🟡 Low | Minor share-preview polish. |
| **No `robots.txt`** | 🟠 Med | Confirmed absent from `public/`. |
| **No `sitemap.xml`** | 🟠 Med | Confirmed absent from `public/`. |
| **`meta keywords`** | 🟡 Low | Ignored by Google since 2009. Harmless, but it publicly advertises your keyword strategy to competitors. |
| **JSON-LD is thin** | 🟠 Med | Missing `url`, `logo`, `sameAs` (the three social links at `src/App.tsx:168` are all `href="#"` — no real profiles to cite), `areaServed`, and `address` beyond a bare country code. |
| **JSON-LD `addressCountry: "NG"` vs. the marketing** | 🟠 Med | Every piece of copy targets **US/UK/Canada** diaspora families; the structured data tells Google the organisation is in **Nigeria**. Not false, but it will pull local-pack relevance toward the wrong geography. Add `areaServed: ["US","GB","CA"]`. |
| **No `Course` / `Offer` / `AggregateRating` schema** | 🟠 Med | Three priced tiers and two programmes are sitting right there in `src/App.tsx:30-59`. `Course` + `Offer` markup would make them eligible for rich results. This is the single highest-ROI SEO addition available. |
| **Client-side rendering** | 🟠 Med | `<body>` ships as `<div id="root"></div>`. Googlebot renders JS, but every other crawler, LLM scraper, and preview bot sees an empty page. All the copy in §5 is invisible without JS execution. **This is the argument for the Next.js port.** |
| **Only one indexable URL** | 🟠 Med | Single-page anchors mean one URL total. The keyword targets in `meta keywords` (e.g. "Quantitative reasoning online tutor", "Learn Igbo online diaspora UK US") each want their own page and can't get one under the current architecture. |
| **No `theme-color`** | 🟡 Low | Cheap polish for mobile browser chrome. |

---

## 10. Quality

### Responsive breakpoints actually used

Tailwind defaults, unmodified (no `screens` override in `tailwind.config.js`). **62 responsive utilities** across `App.tsx` and `index.css`:

| Prefix | Min-width | Count | Notes |
|---|---|---|---|
| `sm:` | 640px | **37** | The workhorse — nearly all padding, type-scale, and layout shifts |
| `lg:` | 1024px | **22** | Desktop nav reveal, multi-column grids |
| `md:` | 768px | **1** | **`md:grid-cols-3` on the tutors grid only** (`src/App.tsx:161`) |
| `xl:` / `2xl:` | — | **0** | Never used |

⚠️ **The breakpoint strategy is inconsistent.** Programmes use `lg:grid-cols-2`, pricing uses `lg:grid-cols-3`, the trust bar uses `sm:grid-cols-2 lg:grid-cols-4` — but tutors uses `md:grid-cols-3`, the lone `md:` in the file. On a 768–1023px tablet, the tutor cards squeeze into three columns while every other section is still stacked. Almost certainly unintentional.

⚠️ **The 640–1023px band is under-served generally.** The desktop nav appears at `lg:` while the primary CTA button appears at `sm:` (`src/App.tsx:126-127`), so between 640px and 1023px the header shows a hamburger **and** a "Book $15 Trial" button side by side. Not broken, but visually cluttered.

**Container discipline is good:** `max-w-7xl mx-auto` with `px-5 sm:px-8` is applied consistently to every section, so nothing runs to the viewport edge.

### Hardcoded pixel widths that will break on mobile

**Good news: no fixed `width` values anywhere.** No `w-[NNNpx]`, no inline `style={{ width }}`, no `min-w-[NNNpx]`. Every arbitrary sizing value is a *height*, an aspect ratio, or a radius. The 360px-wide viewport is safe.

Items worth flagging anyway:

| Value | Location | Risk |
|---|---|---|
| `h-[76px]` | Header, `src/App.tsx:118` | 🟡 Fixed header height. Safe visually, but it is the cause of the **missing `scroll-margin-top`** — every anchor jump hides its heading behind the header (§3). |
| `text-[8rem]` | Tutor initials, `src/App.tsx:161` | 🟡 **128px, with no responsive step-down.** Constrained by `aspect-[.9]` so it doesn't overflow at 360px, but it is visually enormous on small phones. |
| `text-[4.35rem]` | `lg:` hero headline, `src/App.tsx:138` | 🟢 Safe — gated behind `lg:`, with `sm:text-5xl` and `text-[2.7rem]` below it. |
| `min-h-[340px]` | Modal success state, `src/App.tsx:96` | 🟡 340px + padding. Fine on any modern phone; tight on a 568px-tall device in landscape. |
| `min-h-[48px]` | Pricing description, `src/App.tsx:163` | 🟢 Intentional row-alignment spacer. |
| `blur-[120px]` on an `h-80 w-80` orb at `-left-32` | `src/App.tsx:134` | 🟡 A 320px blurred element offset 128px **outside** the viewport. Contained only by `overflow-hidden` on the root wrapper (`src/App.tsx:116`). Also the most GPU-expensive paint on the page — noticeable on low-end Android. |
| `max-w-7xl` (1280px) | every section | 🟢 Correct — `max-*`, not `w-*`. |

### Missing alt text

**None missing.** Both (and only) `<img>` elements carry descriptive alt text (`src/App.tsx:120`, `:168`), both reading `"Blissful Way Academy crest"`.

⚠️ Two nits: (a) the header logo is wrapped in a link to `#home`, so the alt text should describe the *destination* ("Blissful Way Academy — home") rather than the image; (b) the footer copy duplicates the identical alt, giving screen-reader users the same announcement twice. Neither is a violation.

All `lucide-react` icons render inline `<svg>` without `aria-hidden="true"`. Lucide sets no `role`, so most screen readers skip them — low risk, but explicit `aria-hidden` would be correct.

### Missing button / input labels

**Inputs: all correctly labelled.** ✅ Every one of the six fields is wrapped in a `<label>` with visible text (`src/App.tsx:86-91`), e.g.:

```tsx
<label className="text-sm text-neutral-300 sm:col-span-2">Parent full name<input required name="name" placeholder="Your full name" className="form-input" /></label>
```

Implicit association via wrapping is valid. Placeholders supplement rather than replace the labels — the common Bolt failure mode is absent here.

**Buttons — three problems:**

| Issue | Location | Severity |
|---|---|---|
| 🔴 **Mobile menu toggle always announces "Open menu"** | `src/App.tsx:127` | `aria-label="Open menu"` is static while the icon swaps `<Menu/>`↔`<X/>`. Screen-reader users are told "Open menu" when the action is *close*. Needs a dynamic label plus `aria-expanded`. |
| 🟠 **Tutor cards are `<button>` with no accessible name** | `src/App.tsx:161` | The name is computed from all descendant text — *"CDEP certified AO 'Language is a bridge to belonging.' Amaka Okoye Lead Igbo Language & Cultural Tutor"*. Technically named, practically unusable. No `aria-pressed` despite being a toggle. |
| 🟠 **Nested interactive controls** | `src/App.tsx:161` | The `<Play>` icon sits inside a `<span>` **inside** the card `<button>` and looks clickable but isn't focusable. Confusing for keyboard users. |
| ✅ **Modal close button** | `src/App.tsx:79` | Correct — `aria-label="Close booking form"`. |
| ✅ **Social icon links** | `src/App.tsx:168` | Correct — `aria-label="Facebook"` / `"Instagram"` / `"TikTok"`… |
| 🟠 …but all three point to `href="#"` | `src/App.tsx:168` | Dead links that jump to the top of the page. Also why JSON-LD `sameAs` is missing (§9). |

**Other accessibility gaps:** no skip-to-content link; no `<main>` landmark issues (it *is* present at `src/App.tsx:132` ✅); modal lacks `role="dialog"`/focus trap/Escape (§7); `focus-visible` styling is never customised, so focus rings fall back to browser defaults over dark backgrounds — low contrast in places.

**Contrast risks (not measured, flagged for testing):** `text-neutral-600` on `bg-black` in the copyright line (`src/App.tsx:168`) and `text-white/[0.025]` watermark numerals (`src/App.tsx:159`) — the latter is decorative. `placeholder:text-neutral-600` on `bg-black/20` (`src/index.css:17`) is likely below 4.5:1.

### `any` types and TS errors

**Zero `any`.** ✅ `grep -n ': any\|as any\|<any>' src/*.tsx src/*.ts` → no matches.

**Zero TypeScript errors.** ✅ `tsc --noEmit -p tsconfig.app.json` exits 0 with no output, under `"strict": true`.

The only explicit type in the codebase is `type BookingModalProps = { open: boolean; onClose: () => void }` (`src/App.tsx:28`). Everything else is inferred. There are **no interfaces for `Tutor`, `Programme`, or `PricingTier`** — see §5, item 3.

One non-null assertion at `src/main.tsx:6` (`document.getElementById('root')!`) — standard Vite template idiom, safe.

### ESLint — 3 errors, verbatim

```
C:\Users\HP\Desktop\WEBSITES\Blissfulway Academy\src\App.tsx
  11:3  error  'Lightbulb' is defined but never used  @typescript-eslint/no-unused-vars
  17:3  error  'Plus' is defined but never used       @typescript-eslint/no-unused-vars
  20:3  error  'Star' is defined but never used       @typescript-eslint/no-unused-vars

✖ 3 problems (3 errors, 0 warnings)
```

Three dead `lucide-react` imports (`src/App.tsx:11`, `:17`, `:20`) — leftovers from a removed testimonials/features block. Tree-shaken out of the bundle, so cosmetic. Note that `tsconfig.app.json:25` sets `"noUnusedLocals": false`, which is why `tsc` stays silent while ESLint catches them.

### Other quality notes

- 🟡 **`npm audit`: 18 vulnerabilities (2 low, 4 moderate, 12 high)** — all dev-toolchain (Vite/esbuild lineage), none in shipped code.
- 🟡 **`package.json:2` — `"name": "vite-react-typescript-starter"`.** Never renamed from the Bolt template.
- 🟡 **`optimizeDeps.exclude: ['lucide-react']`** (`vite.config.ts:13-15`) — template default that slows cold dev starts here.
- 🟡 **No error boundary.** Any render throw blanks the entire page.
- 🟡 **No `prefers-reduced-motion` handling** despite `scroll-behavior: smooth` (`src/index.css:6`) plus hover translate/scale transitions throughout.
- 🟡 **No tests, no CI, no formatter config** (no Prettier). Given the 2,000-character lines, a Prettier pass is the highest-leverage single action available on this codebase.
- 🟢 **Bundle size is healthy:** 175 kB JS / 54 kB gzipped, 32 kB CSS / 5.7 kB gzipped. The 508 KB logo dwarfs both.

---

## 11. Salvage verdict

| Section | Location | Verdict | Reasoning |
|---|---|---|---|
| **Header** | `src/App.tsx:117-130` | **KEEP WITH EDITS** | Structure, sticky behaviour, and mobile drawer all work — but the nav array is duplicated verbatim between desktop and mobile, `aria-label="Open menu"` never changes when open, and `aria-expanded` is missing. Extract the array once, fix the label, add `scroll-margin-top` for the 76px offset. ~30 min. |
| **Hero** | `src/App.tsx:133-155` | **KEEP WITH EDITS** | Genuinely strong design — the CSS-built "live classroom" mock is the most distinctive thing on the page and worth preserving. But `src/App.tsx:148` is a 1,201-character line and all copy is baked into JSX. Reflow and extract into `<Hero>` + `<ClassroomPreview>`; no visual change needed. ~1 hr. |
| **Trust bar** | `src/App.tsx:157` | **KEEP WITH EDITS** | Clean four-up layout and the right content. Only real sin: the data array is written *inside* the JSX on a 948-character line. Lift the array to module scope beside `programs`/`tutors`/`pricing` and it becomes as clean as the others. ~15 min. |
| **Programmes** | `src/App.tsx:159` | **KEEP WITH EDITS** | Best-architected section on the page — clean data/render separation, good card design. Two fixes: reflow the 1,735-character line, and replace the `index === 1 ? 'math-logic'` anchor hack with a `slug` field so header/footer links survive reordering. ~45 min. |
| **Tutors** | `src/App.tsx:161` | **KEEP WITH EDITS** | Data shape is the cleanest in the codebase (pure strings, DB-ready today). But the section over-promises: a `<Play>` button on every card that only prints *"Playing 45-second introduction"* with no video behind it. Either build the video player or remove the play affordance — shipping a fake button is worse than shipping neither. Also the lone `md:` breakpoint and the unusable button accessible name. ~1 hr, plus whatever the videos cost. |
| **Pricing** | `src/App.tsx:163` | **KEEP WITH EDITS** | Layout, featured-tier treatment, and copy are production-quality. Only structural change needed: `price: '$100'` is a display string — split into `amount` + `currency` before any DB or payment integration. Reflow the 1,788-character line. ~45 min. |
| **Booking modal** | `src/App.tsx:61-106` | **KEEP WITH EDITS** — *but it is the top priority* | The shell is well-built (scroll lock with proper cleanup, labelled inputs, good success state). The submit handler is three lines that call `preventDefault()` and `setSubmitted(true)` — **every booking is silently discarded while the user is told a concierge will call.** Not a rebuild: wire `FormData` to an endpoint (Supabase is already installed), reset `submitted` on reopen, add Escape/focus-trap/`role="dialog"`, switch backdrop close to `onClick`, add a timezone field. ~3–4 hrs and it is genuinely production-ready. |
| **Footer** | `src/App.tsx:168` | **KEEP WITH EDITS** | Right content — real email, real phone, working `mailto:`/`tel:`. But it is the single longest line in the codebase (2,151 chars), all three social links are `href="#"` dead ends, and it holds a third divergent copy of the nav links. Reflow, add real URLs (or drop the icons), share the nav array. ~30 min. |

**No section warrants REBUILD.** The visual design is well above typical AI-generated output and the data/render separation in three of four content sections is already correct. What this codebase needs is **decomposition and one working form submission** — not a rewrite. Total remediation without any framework change: **roughly 8–10 hours**, and the modal fix alone (3–4 hrs) removes the only actively harmful defect.

---

## 12. Port cost

### Estimate: **14–20 hours** for a careful, production-quality port. Realistically **16 hours** — call it two focused days.

Not the 4-hour job the 174-line count suggests, and not a two-week rewrite either. Breakdown:

| Task | Hours | Notes |
|---|---|---|
| Scaffold Next.js 15, port Tailwind/PostCSS/TS config | 1.0 | `index.css` `@layer components` block ports verbatim — the healthiest asset here |
| **Prettier pass + reflow the four 1,700–2,150-char lines** | 2.0 | Prerequisite for everything else; see pain point #1 |
| Split `App.tsx` into ~10 components under `components/` | 3.0 | The real work of the port |
| `'use client'` boundary placement + state lift | 1.5 | See pain point #2 |
| `index.html` → `metadata` export + JSON-LD + fix relative `og:image` | 1.5 | See pain point #3 |
| Google Fonts → `next/font/google` (Cinzel + Inter) | 0.5 | Trim the 9 requested weights to ~4 while you're there |
| Logo → `next/image`, convert 508 KB JPEG → WebP/SVG | 1.0 | 508 KB → ~4 KB |
| Write `Tutor`/`Programme`/`PricingTier` interfaces, move data to `lib/content.ts` | 1.5 | Includes the icon-name lookup map |
| **Wire the booking form to a Server Action + real storage** | 3.0 | Not strictly "porting", but the port is the moment to fix it — and App Router Server Actions make it easy |
| Accessibility fixes bundled in (modal semantics, aria-label, scroll-margin) | 1.5 | Cheapest to do during decomposition |
| Deploy config, `robots.ts`, `sitemap.ts`, smoke testing | 1.0 | App Router gives both as file conventions |
| **Total** | **17.5** | Drop the form wiring (−3.0) and it's ~14.5 hrs for a pure port |

### The three most painful things — specifically

#### 1. 🔴 Reflowing the four monster lines before you can split anything (~2–3 hrs, and it is unavoidable)

This is the genuinely underestimated cost and it comes **first**, blocking everything else.

`src/App.tsx:168` is 2,151 characters. `:161` is 2,047. `:163` is 1,788. `:159` is 1,735. Together with `:148` (1,201), `:157` (948), and `:165` (923), **seven lines hold roughly 45% of the file's 23,695 characters.** Reformatted at 100 columns, the file is ~1,000 lines, not 174.

Why this hurts more than it sounds:
- You **cannot** split a component out of a 2,000-character line by reading it. You have to run Prettier first, read the result, *then* cut. Prettier will produce a diff touching essentially every line of the file.
- Every one of these lines mixes structure, three levels of conditional Tailwind interpolation (`${plan.featured ? '...' : '...'}`), and `.map()` bodies with nested ternaries. `src/App.tsx:159` alone contains a destructured map param (`{ icon: Icon, ...program }`), a conditional `id`, a template-literal className, a nested `.map()` over `bullets`, and an absolutely-positioned decorative watermark — all on one line.
- Git history becomes useless across the reformat. With only one commit (`640c8fe`) that's cheap here, but any work-in-progress branch will conflict catastrophically.
- Bugs are **hiding** in these lines. The `index === 1 ? 'math-logic' : undefined` anchor hack (§3) and the missing `aria-pressed` on tutor cards are both invisible at 2,000 characters wide and obvious at 100.

**Do not skip this and try to port section-by-section from the compressed source.** Prettier, commit the reformat alone, then port.

#### 2. 🟠 Getting real value out of Server Components rather than slapping `'use client'` on everything (~1.5–2 hrs, plus judgment)

The entire site currently lives inside one client component. `App` owns three `useState` hooks (`modalOpen`, `menuOpen`, `activeTutor` — `src/App.tsx:109-111`), and those hooks are consumed by handlers scattered through **every single section**:

- `openBooking` is called from the header (`:126`), the mobile drawer (`:129`), the hero (`:140`), **all three pricing cards** (`:163`), and the final CTA (`:165`) — six call sites across five sections.
- `activeTutor` is read *and* written inside the tutors `.map()` (`:161`).
- `menuOpen` spans header and drawer.

The lazy port is `'use client'` at the top of `app/page.tsx`, done in five minutes — and you get a Next.js app with **exactly the SEO characteristics of the current Vite app**, which defeats the main reason to port (§9: the page currently ships as an empty `<div id="root">`).

The correct port keeps `page.tsx` as a Server Component and pushes the boundary down:
- Hero, programmes, tutors, pricing, trust bar, footer → **server-rendered** (all their content is static or DB-sourced).
- `<BookingProvider>` (client) wrapping a context, so `<BookTrialButton>` — a small client leaf — can be dropped into six server-rendered sections without dragging them client-side.
- `<MobileNav>` and `<TutorCard>` → small client islands.

That is a genuine architectural decision requiring care, and it's where a rushed port quietly fails. The alternative (prop-drilling `onClick` through server components) **doesn't work** — functions aren't serializable across the RSC boundary, and that error message is confusing the first time you hit it.

#### 3. 🟠 Metadata, JSON-LD, and the OG image — more fiddly than expected (~1.5 hrs)

`index.html` has **14 hand-written meta tags plus a JSON-LD block** (§9), which is unusually thorough for a Bolt output and means there is real content to migrate rather than a stub to replace.

- The `<meta>` tags map to a `metadata` export, but the mapping isn't mechanical: `og:*` becomes a nested `openGraph` object, `twitter:*` becomes `twitter`, and `meta name="keywords"` becomes `keywords: []` (worth dropping entirely, §9).
- **JSON-LD has no `metadata` equivalent.** It must be injected as a `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />` in the layout — a pattern people get wrong, and React will complain if you try to pass the object as a child.
- 🔴 **The relative `og:image` must be fixed as part of the port.** `index.html:16` and `:20` both use `/assets/images/...`, which OG requires to be absolute. Next's `metadataBase` solves it — but only if you set it, which means **you must know the production domain before you can complete the port**. If that domain isn't decided yet, this becomes a genuine blocker on an otherwise-finished migration.
- The 508 KB JPEG is simultaneously the favicon, the OG image, and the Twitter `summary_large_image` source. Next's file conventions want these as three separate files: `app/icon.png`, `app/opengraph-image.png` (1200×630), `app/twitter-image.png`. **None of those exist** — the 1200×630 landscape share image has to be *designed*, not converted. Budget design time outside this estimate.

### Honest counterweight — why this is *not* a hard port

To not be pessimistic where the evidence doesn't support it:

- **No router to migrate.** Zero route files, zero `<Link>` rewrites, zero nested-layout mapping. Anchor links work identically in App Router. This is usually the single biggest port cost and here it is **zero hours**.
- **No data fetching to convert.** No `useEffect` fetches, no SWR, no React Query, no loading states to convert to Suspense. All content is module-scope constants (§5).
- **No auth, no sessions, no middleware, no API routes, no env vars.** There isn't even a `.env` file.
- **TypeScript is already strict and clean** — zero `any`, zero `tsc` errors. Nothing to untangle.
- **Tailwind 3.4.17 + the `@layer components` block port over unchanged.** (Decide separately whether to jump to Tailwind v4 — that is its own migration and should *not* be bundled into this one.)
- **Only 1 image, 0 videos, 0 iframes, 0 third-party scripts, 0 hotlinked stock photos** (§8). No CSP surprises, no external-domain config in `next.config.js`.
- **`@supabase/supabase-js` is already a dependency** (§1) — if it becomes the form backend, that's zero install friction.
- The build is green, the types are clean, and the design is good. **You are porting a healthy small site, not rescuing a broken one.**

### Recommendation

If SEO is the driver, the port is worth it — the current site renders to an empty `<div>` and single-page anchors cap you at one indexable URL for keyword targets that each want their own page (§9). If SEO is *not* the driver, spend the **8–10 hours from §11** instead: decompose in place, fix the booking form, and ship. The Vite build works fine.

Either way, **fix the booking-form submit handler first.** It is three lines, and until it is fixed the site is telling parents that someone will call them back while throwing their details away (§7).
