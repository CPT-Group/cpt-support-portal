# Theme Variables Checklist

This doc ensures **every theme** defines the variables our overrides use, and **every new override** uses only theme variables so all themes (including light) get the correct colors.

## Why this matters

The base PrimeReact theme (lara-dark-blue) uses **hardcoded dark colors**. Our `primereact-overrides.scss` overrides components to use **CSS variables** instead. When you switch to CPT Legacy Light (or any light theme), those variables are set by the theme SCSS files. If a theme is missing a variable, the component can fall back to lara-dark-blue and look wrong (e.g. dark dropdown on a light page).

## Rule 1: New component overrides

When you add or change overrides in `src/styles/primereact-overrides.scss`:

- **Use only theme variables** (e.g. `var(--surface-card)`, `var(--text-color)`). No hardcoded hex/rgba for colors.
- If you need a new variable (e.g. `--dropdown-panel-bg`), add it to **variables.scss** and to **every theme file** in `src/styles/themes/` with the correct value for that theme. Prefer reusing existing variables (e.g. `--surface-overlay` for dropdown panel) when possible.

## Rule 2: New themes

When you add a new theme file (e.g. `src/styles/themes/my-theme.scss`):

1. Copy the variable set from an existing theme (e.g. `light.scss` or `dark.scss`).
2. Replace every value with **your theme’s** colors. Do not leave any variable unset.
3. Register the theme in `ThemeProvider`, theme-init script in `layout.tsx`, `HeaderThemeToggle` options, and `globals.css` (logo/body background) as needed.
4. Add the theme to the load order in `src/app/main.scss` (`@use '../styles/themes/my-theme.scss';`).

## Variables used by overrides and base

These are the variables that **primereact-overrides.scss**, **base.scss**, and **globals.css** depend on. Every theme file must define all of them (with that theme’s colors).

| Variable | Used by | Notes |
|----------|---------|--------|
| `--surface-card` | Card, Panel, ListBox, Fieldset, Sidebar, Dropdown, InputText | Background for cards and inputs |
| `--surface-overlay` | Dialog, Dropdown panel | Overlays (modals, dropdown list) |
| `--surface-ground` | Dropdown filled, InputText filled | Page/input ground |
| `--surface-border` | All components | Borders |
| `--surface-hover` | Accordion, ListBox, Sidebar, Dropdown items | Hover state background |
| `--text-color` | All components, body, main | Primary text |
| `--text-color-secondary` | Card subtitle, Sidebar secondary, Dropdown placeholder/trigger, InputText label/placeholder | Muted text |
| `--primary-color` | Message, Button primary, Dropdown/Input focus border, **ProgressSpinner** (stroke) | Brand/action color |
| `--primary-color-text` | Button primary | Text on primary buttons |
| `--button-primary-background-hover` | Button primary hover | Optional; fallback `var(--primary-color)` |
| `--button-secondary-bg`, `--button-secondary-text`, `--button-secondary-hover-bg`, `--button-secondary-border`, `--button-secondary-shadow` | Secondary button, **AutoComplete dropdown button**, input-group icon-only buttons (e.g. dark-synth neon purple) | Optional; default from variables uses surface/text |
| `--focus-ring` | Accordion, Sidebar, Dropdown, InputText | Focus outline/box-shadow |
| `--highlight-bg` | ListBox selected, Dropdown selected | Selected item background |
| `--highlight-text-color` | ListBox selected, Dropdown selected | Selected item text |
| `--page-background` | base.scss body | Page background |
| `--border-radius` | Card, Accordion, etc. | Optional; :root has 6px |
| `--content-padding` | Accordion, Sidebar | Optional; fallback 1rem |
| `--card-shadow` | Card | Optional; fallback in overrides |
| `--header-bg` | globals.css header | Header background |
| `--header-fg` | globals.css header | Header text/icons |
| `--scrollbar-track-bg`, `--scrollbar-thumb-bg`, `--scrollbar-thumb-hover-bg` | base.scss (global scrollbars), primereact-overrides (Firefox overlay scrollbars) | **Required** – all six themes set these so dropdown/list/sidebar scrollbars match theme (e.g. dark-synth not white) |
| `--loading-overlay-bg` | globals.css .app-loading-overlay | **Required** – light themes use transparent white/grey (e.g. rgba(255,255,255,0.78)); dark themes use dark overlay (e.g. rgba(0,0,0,0.65)) so overlay matches theme |
| *(Steps/stepper)* Same as above | Steps number, title, connector line, highlight | Uses `--text-color`, `--text-color-secondary`, `--surface-border`, `--focus-ring`, `--highlight-bg`, `--highlight-text-color` |

## Quick audit

To confirm all themes define the core set, grep for the variables above in `src/styles/themes/*.scss`. Each theme should set at least:

- `--surface-card`, `--surface-overlay`, `--surface-ground`, `--surface-border`, `--surface-hover`
- `--text-color`, `--text-color-secondary`
- `--primary-color`, `--primary-color-text`
- `--focus-ring`, `--highlight-bg`, `--highlight-text-color`
- `--page-background`

Current theme files (all six define these): `cpt-legacy-dark.scss`, `cpt-legacy-light.scss`, `dark.scss`, `light.scss`, `ms-access-2010.scss`, `dark-synth.scss`.
