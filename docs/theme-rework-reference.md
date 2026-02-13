# Theme Rework Reference – internal-dashboard & cpt-internal-tools

This document summarizes how **PrimeReact** and **custom theming** are set up in the two reference codebases. **As of v1.18.3 the support portal has been updated** to use the same pattern, with six themes: dark, light, dark-synth, ms-access-2010 (from the reference apps) plus **cpt-legacy-dark** and **cpt-legacy-light** (kept as additional options).

---

## 1. Reference codebases

| Codebase | Stack | Entry | Theme approach |
|----------|--------|-------|-----------------|
| **internal-dashboard** | Next.js, React, PrimeReact | `src/app/layout.tsx` | One PrimeReact theme CSS + SCSS bundle + `data-theme` only (no link swap) |
| **cpt-internal-tools** | Vite, React, PrimeReact | `src/main.tsx` | Same: one PrimeReact theme + SCSS bundle + `data-theme` only |

---

## 2. Target pattern (both reference apps)

### Core idea

- **One** PrimeReact theme CSS file is imported **statically** (in layout or main entry).
- **One** SCSS bundle defines variables and theme overrides; theme is applied **only** by the `data-theme` attribute on `<html>`.
- **No** dynamic `<link>` swap. All theme-specific values live in SCSS and are selected via `[data-theme='...']`.

### Load order (conceptual)

1. **PrimeReact theme** – `primereact/resources/themes/lara-dark-blue/theme.css` (component structure + baseline variables).
2. **App SCSS bundle** – variables → base → utilities → theme override files → primereact-overrides.
3. **Other** – primeflex, primeicons, primereact.min.css (and in cpt-internal-tools: rc-dock, then primereact-overrides.css **last**).

Our SCSS runs **after** the PrimeReact theme, so our `:root` and `[data-theme='...']` rules override PrimeReact’s variables.

---

## 3. internal-dashboard (Next.js) – main reference

### Layout (`src/app/layout.tsx`)

- Imports **before** any app styles:
  - `primereact/resources/themes/lara-dark-blue/theme.css`
  - `./main.scss`
- **No** theme `<link>` in the HTML.
- `<html>` has default `data-theme="dark-synth"` (or desired default).
- A **theme-init script** (`strategy="beforeInteractive"`) runs before React:
  - Reads `localStorage.getItem('cpt-theme')`.
  - Validates against `['dark','light','dark-synth','ms-access-2010']`.
  - Sets `document.documentElement.setAttribute('data-theme', theme)` and optionally corrects localStorage.
- So first paint already has the correct `data-theme` and no flash.

### SCSS orchestration (`src/app/main.scss`)

```scss
@use '../styles/variables.scss' as *;
@use '../styles/base.scss' as *;
@use '../styles/utilities.scss' as *;
@use '../styles/themes/dark.scss';
@use '../styles/themes/light.scss';
@use '../styles/themes/dark-synth.scss';
@use '../styles/themes/ms-access-2010.scss';
@use '../styles/primereact-overrides.scss';
```

Order: **variables → base → utilities → theme overrides → primereact-overrides**.

### ThemeProvider (`src/providers/ThemeProvider.tsx`)

- **Does not** create or update any `<link>`.
- On mount: reads `localStorage.getItem('cpt-theme')`, parses with `parseStoredTheme()` (invalid → default `'dark-synth'`), sets state and `document.documentElement.setAttribute('data-theme', savedTheme)`.
- When `theme` changes: sets `data-theme` and `localStorage.setItem('cpt-theme', theme)`.
- Exposes `theme`, `setTheme(theme)`, `cycleTheme()`.
- Theme type: `'dark' | 'light' | 'dark-synth' | 'ms-access-2010'`.

### Styles structure

| File | Role |
|------|------|
| `src/styles/variables.scss` | `:root` design tokens (default theme, e.g. dark-synth). Theme files override these when their selector matches. |
| `src/styles/base.scss` | Resets, html/body, fonts (Lato from `/themes/.../fonts/`), layout. Uses **only** `var(--...)`; no hardcoded theme colors. |
| `src/styles/utilities.scss` | Focus, sr-only, etc. |
| `src/styles/themes/dark.scss` etc. | `html[data-theme='dark-synth'], [data-theme='dark-synth'] { ... }` with variable overrides (`!important`). |
| `src/styles/primereact-overrides.scss` | Shared PrimeReact component overrides (Card, Accordion, DataTable, etc.) using theme variables so they work for all themes. |

### Docs (internal-dashboard)

- **theme-system.md** – Canonical: how the theme system works, how to use/update/add themes, theme-init script, no link swap.
- **theme-system-cpt-internal-tools-mirror.md** – How dashboard mirrors cpt-internal-tools (where dark-synth lives, base vs themes, load order).
- **theme-implementation-notes.md** – Legacy: why the old link-based approach was replaced.
- **primereact-theming.md** – Legacy; points to theme-system.md for current behavior.

---

## 4. cpt-internal-tools (Vite) – same pattern

### Entry (`src/main.tsx`)

- Imports in order:
  1. `primereact/resources/themes/lara-dark-blue/theme.css`
  2. `./main.scss`
  3. (later) primeflex, primeicons, primereact.min.css, rc-dock, then **`@/styles/primereact-overrides.css`** last.

### SCSS orchestration (`src/main.scss`)

```scss
@use './styles/variables.scss' as *;
@use './styles/base.scss' as *;
@use './styles/utilities.scss' as *;
@use './styles/themes/dark.scss';
@use './styles/themes/light.scss';
@use './styles/themes/dark-synth.scss';
@use './styles/themes/ms-access-2010.scss';
```

Note: primereact-overrides is **CSS** and imported in main.tsx **after** all other CSS so it wins.

### ThemeProvider (`src/providers/ThemeProvider/`)

- **Does not** create or update any `<link>`.
- State: `theme` from localStorage or system preference (`prefers-color-scheme: dark`).
- `useEffect`: `document.documentElement.setAttribute('data-theme', theme)` and updates `<meta name="theme-color">`.
- Exposes `theme`, `setTheme(theme)`, `toggleTheme()`.
- Theme type: `'light' | 'dark' | 'dark-synth' | 'ms-access-2010'` (from `@/types/Theme`).
- Optional: ThemeSettingsModal for multiple themes (recent themes, filterable list).

### Styles structure

- Same idea: `variables.scss` (`:root`), `base.scss`, `utilities.scss`, `themes/*.scss` with `html[data-theme='...'], [data-theme='...']`.
- PrimeReact overrides in `src/styles/primereact-overrides.css` (plain CSS), loaded last in main.tsx.

### Docs (cpt-internal-tools)

- **THEME-SYSTEM-FINAL.md** – KISS: colors only in theme files; semantic variables; no hardcoded colors in components (except excluded tools).
- **THEME-SYSTEM-CLEAN.md** – 100% SCSS; ThemeProvider only sets `data-theme`; no legacy theme CSS in public.
- **THEME-SYSTEM-SIMPLE.md** – Two-color simplification (shell-header-bg, shell-content-bg).
- **THEME-VARIABLES-AUDIT.md** – Variable audit.

---

## 5. Current support portal (what we have now)

- **Layout:** Imports only `./globals.css`. No PrimeReact theme import in layout.
- **PrimeReactProvider:** Imports primereact.min.css, primeicons, primeflex. No theme CSS.
- **ThemeProvider:** Creates/updates a `<link id="theme-stylesheet">` and sets `href` to `/themes/cpt-legacy-light/theme.css` or `/themes/cpt-legacy-dark/theme.css`; sets `data-theme` and `localStorage('cpt-theme')`. Theme type: `'light' | 'dark'`; only `toggleTheme`.
- **Themes on disk:** `public/themes/cpt-legacy-light/theme.css` and `public/themes/cpt-legacy-dark/theme.css` (full CPT theme CSS; no SCSS theme overrides).
- **globals.css:** Tailwind + custom rules; uses `data-theme` for logo and body/background styles.

So the support portal uses the **old** pattern: **dynamic theme link swap** and two separate full theme CSS files in `public/themes/`. The reference apps use **one** PrimeReact theme + **one** SCSS bundle with theme overrides and **no** link swap.

---

## 6. Summary: what to align with

For the major theme rework, the support portal can move to the same pattern as internal-dashboard and cpt-internal-tools:

1. **Single PrimeReact theme** – Import `lara-dark-blue/theme.css` once (e.g. in layout before app styles).
2. **Single SCSS bundle** – e.g. `main.scss` → variables → base → utilities → theme files (e.g. light, dark, optionally more) → primereact-overrides. No theme CSS in `public/themes/` for *variable* overrides (those live in SCSS); `public/themes/` can still hold fonts if needed.
3. **Theme application** – Only `data-theme` on `<html>`. ThemeProvider (and optional theme-init script) only set `data-theme` and localStorage; **no** dynamic theme `<link>`.
4. **Theme-init script (optional)** – In layout, `beforeInteractive` script that reads `cpt-theme` from localStorage, validates, sets `data-theme` (and optionally corrects storage) to avoid flash.
5. **Variables and overrides** – `:root` in variables.scss; each theme in its own file with `html[data-theme='...'], [data-theme='...']`; shared PrimeReact overrides in one file using theme variables.
6. **localStorage key** – Keep `cpt-theme` for consistency across CPT apps.
7. **Extend Theme type** if we add more themes (e.g. dark-synth, ms-access-2010) and add `setTheme` / `cycleTheme` if the UI needs them.

The reference docs in internal-dashboard (`docs/theme-system.md`, `docs/theme-system-cpt-internal-tools-mirror.md`) and cpt-internal-tools (`docs/THEME-SYSTEM-FINAL.md`, `docs/THEME-SYSTEM-CLEAN.md`) are the canonical descriptions of this setup.

---

## 7. Theme separation (no merging)

The six themes are **completely separate**. No theme shares or merges colors with another.

| Theme | Source of colors | Scope |
|-------|------------------|--------|
| **cpt-legacy-dark** | Support portal CPT brand (dark) – `#1a2332`, `#222c61`, `#405c8e`, etc. | Only `[data-theme='cpt-legacy-dark']` |
| **cpt-legacy-light** | Support portal CPT brand (light) – `#f8f9fa`, `#1a3a5c`, `#405c8e`, etc. | Only `[data-theme='cpt-legacy-light']` |
| **dark** | Aligned with **cpt-internal-tools** `src/styles/themes/dark.scss` (navy, `#60a5fa`) | Only `[data-theme='dark']` |
| **light** | Aligned with **cpt-internal-tools** `src/styles/themes/light.scss` (white/slate, `#3b82f6`) | Only `[data-theme='light']` |
| **ms-access-2010** | Aligned with **cpt-internal-tools** `src/styles/themes/ms-access-2010.scss` (Office 2010 orange/teal) | Only `[data-theme='ms-access-2010']` |
| **dark-synth** | Aligned with **cpt-internal-tools** `src/styles/themes/dark-synth.scss` (purple/cyan synthwave) | Only `[data-theme='dark-synth']` |

- Each theme file defines **all** variables it needs with **literal** hex/rgba values (or `var(...)` only to other variables **within the same theme block**). No theme references another theme’s variables.
- Only one `data-theme` is active at a time; only that theme’s SCSS block applies. Load order of theme files does not merge them.
- For **Dark**, **Light**, **MS Access 2010**, and **Dark Synth**, the canonical color definitions are in **cpt-internal-tools** at `C:\local_dev\Github-CPT-Group\cpt-internal-tools\src\styles\themes\`. Support portal theme files are kept in sync with those for consistency.
- **Theme variable checklist** – When adding new PrimeReact overrides or a new theme, every override must use only theme variables, and every theme must define the same variable set. See **docs/theme-variables-checklist.md** for the full list and rules.
