# Changelog

All notable changes to this project will be documented in this file. **Update this file after every completed task.**

## [Unreleased]

### Fixed

- **Support request form flicker / scroll jump while typing** – The URL was previously updated on every formData change (every keystroke), causing the page to re-render and the browser to treat it like a navigation, which led to flicker and scroll reset. URL is now synced only when the step changes (Next or Previous). Implemented via `useSyncSupportRequestUrl`: an effect that runs when `activeStep` changes and reads current formData/cases from refs so it does not run on every keystroke. Prefill from URL params on load is unchanged; shareable URLs still reflect the current step and committed data.

### Added

- **useSyncSupportRequestUrl hook** – New hook in `src/hooks/useSyncSupportRequestUrl.ts` that syncs the support-request page URL with form state only on step transitions (Next/Previous). Keeps URL logic in one place and avoids tying URL updates to individual button handlers.

### Security

- **npm audit vulnerabilities** – Resolved 15 vulnerabilities (1 moderate, 14 high). Ran `npm audit fix` to address the moderate ajv ReDoS issue. Added `overrides` in `package.json` to force `minimatch` >=10.2.1 (fixes ReDoS in ESLint/plugin dependency tree) without requiring a breaking upgrade to ESLint 10. `npm audit` now reports 0 vulnerabilities; production build verified.

### Fixed

- **Loading overlay – single reusable overlay, correct placement and stacking** – Replaced two separate overlay implementations (route loading and submit) with one global overlay. **Stacking:** Overlay is now rendered via React portal into `document.body` with `z-index: 1001` (above the header at 1000) so it truly covers the full screen. **Triggering:** Any component can show/hide it via `useLoadingOverlay()` from `LoadingOverlayProvider` (`showLoading(message?)`, `hideLoading()`). **CSS:** Single class `.app-loading-overlay` in `globals.css` using `inset: 0`, `height: 100dvh` (with `100vh` fallback) for correct viewport coverage and mobile. **Usage:** `app/loading.tsx` triggers the overlay on mount and hides on unmount for route transitions; `SupportRequestStepper` syncs overlay with `isSubmitting` and hides on unmount. Removed duplicate `.global-loading-overlay` / `.loading-overlay` styles and inline overlay markup from the stepper.
- **GET /api/sf/projects 500 when Salesforce not configured** – The route now always returns **200** with empty cases and the actual error message in `error` (no more 500). The support-request page loads; the case list step shows “Could not load case list,” the real error text, and a Retry button. Fixes cases where the error message didn’t match the previous token-detection logic.
- **redirect_uri_mismatch on Netlify** – Added **SF_OAUTH_BASE_URL** env var. When set (e.g. `https://cpt-support-portal.netlify.app`), the app uses it as the OAuth redirect origin so the callback URL sent to Salesforce matches the Connected App exactly, even if the request host differs (e.g. branch deploy subdomain). In Salesforce use exactly that URL with `/oauth/callback` (no trailing slash).
- **OAuth callback 500 on Netlify** – Token file write is now non-fatal (serverless fs is often read-only). Callback shows the refresh_token on the success page so you can copy it into the SF_REFRESH_TOKEN env var. Callback also catches token-exchange errors and returns a clear error page with the expected callback URL. OAuth start cookies now use Secure on HTTPS and URI-encoded values so they are sent when Salesforce redirects back.
- **Case selector step infinite loop on Netlify** – When `/api/sf/projects` returns 500 (e.g. Salesforce env not configured on deploy), the case list step no longer triggers an endless retry loop. `CasesProvider` now marks the “load once” attempt as done after the first request (success or failure), so the effect does not re-call `loadOnce` on every re-render. **Retry** still works via `refetch()`, which clears the flag and fetches again.
- **Netlify build** – TypeScript: webhook payload typed as `{ caseName: string; requestTypes: string }` (explicit string types in support-request route); `SupportRequestStepper` sfId type fixed from `(data.id as string) | undefined` to `data.id as string | undefined` so `|` is not parsed as bitwise OR.

### Added

- **LoadingOverlayProvider and useLoadingOverlay** – Global loading overlay is provided by `LoadingOverlayProvider` (in `src/providers/LoadingOverlayProvider.tsx`) and triggered via `useLoadingOverlay()`. Returns `showLoading(message?)` and `hideLoading()`. Overlay is portaled to `document.body` and uses theme variables (`--maskbg`, `--text-color`). Use in any component inside the provider to show a full-screen loading state.
- **Where to view submissions in Salesforce** – Docs: new “Where to view submitted data in Salesforce” section in `docs/salesforce.md` (use **Support Channel** in the left nav, not Projects). Success page shows the Support Channel record ID and a short note for staff on where to view the submission.
- **SF_REFRESH_TOKEN for serverless (Netlify)** – On deploy, `.sf_tokens.json` is not persistent. You can set **SF_REFRESH_TOKEN** in Netlify (or other host) env with the `refresh_token` from the OAuth success page (or from `.sf_tokens.json` after completing OAuth locally). The app then uses it to obtain access tokens when the file is missing. See `docs/salesforce.md` § Deploying to Netlify.
- **Verification script for Support_Channel__c fields** – `scripts/verify-support-channel-fields.js` runs `sf sobject describe` and ensures every portal-mapped field (Case_Name__c, First_Name__c, Last_Name__c, etc.) is createable so submissions save all data. Run: `node scripts/verify-support-channel-fields.js` or with `--org your@email.com`. Docs: `docs/salesforce.md` § Verifying that submissions will save all data. **Remember to update this changelog after each completed task.**
- **Case name in Salesforce** – Portal submission now maps **caseName** to **Case_Name__c** so the list view "Case Name" column shows the matter the user selected (e.g. "Alcazar v. Fashion Nova, Inc.") instead of a project or other value. Docs: `docs/salesforce.md` § List view columns.
- **Portal-only custom fields on Support_Channel__c** – Portal form data is stored in **dedicated fields** created via the Salesforce CLI instead of reusing org fields. **`salesforce-metadata/force-app`** contains field metadata (First_Name__c, Last_Name__c, CPT_ID__c, Previous_Address__c, New_Address__c, Previous_Name__c, New_Name__c, SSN_Tax_ID__c, Beneficiary_Name__c, Beneficiary_Address__c, Beneficiary_Email__c, Additional_Description__c). Deploy with **`scripts/deploy-support-channel-fields.ps1`** or **`scripts/deploy-support-channel-fields.sh`** (one-time per org). API mapping in `src/app/api/support-request/route.ts` uses these fields; no more writing to Activation_Request_Notes__c for portal data. Docs: `docs/salesforce.md` § Deploying portal fields.
- **Salesforce integration (Support_Channel__c)** – OAuth2 Authorization Code + PKCE for Connected App. **Routes**: `GET /oauth/start`, `GET /oauth/callback` (tokens in `.sf_tokens.json`), `GET /api/sf/describe/support-channel`, `POST /api/support-request` (creates Support_Channel__c). Form submit now calls `POST /api/support-request` with payload from `buildSupportRequestPayload(submission)`; on success redirects to success page with `sfId` in query. Env: `SALESFORCE_CONSUMER_KEY`, `SALESFORCE_CONSUMER_SECRET` (or `SF_CLIENT_ID`/`SF_CLIENT_SECRET`), optional `SF_LOGIN_URL`, `SF_API_VERSION`. **Docs**: `docs/salesforce.md`; canonical Support_Channel__c describe: `docs/salesforce-support-channel-schema.json`. `.sf_tokens.json` in .gitignore.

- **Case list from Salesforce** – Case dropdown is now sourced from **GET /api/sf/projects** (Project__c). Replaced hardcoded CASE_LIST with `CasesProvider` + `useCases()`; cases are fetched when the user reaches the **Select Case** step (step 1) and cached for the session. A loading overlay is shown on the case list step until the list is loaded. **GET /api/sf/projects** returns CaseOption shape and is cached 5 min server-side. URL param parsing/validation and buildURLParams use the API case list when available; case validation is skipped until the list is loaded. Submissions still POST to the single Support project (SUPPORT_CHANNEL_DEFAULT_PROJECT_ID); payload includes case identity (caseId = selected case’s SF Project Id, caseName, caseCaseID, caseProjectName) for relations.
- **Creating the Support project** – Docs and scripts for one-time creation of the Support Project__c via Salesforce CLI: `docs/salesforce.md` (option A/B), `scripts/create-support-project.sh`, `scripts/create-support-project.ps1`. Create the project to match the portal instead of reusing a case project. Support project created via `sf data create record --sobject Project__c --values "Name=Support" -o <username>`; `SUPPORT_CHANNEL_DEFAULT_PROJECT_ID` set in `.env.local`.

### Changed

- **Support request payload** – `buildSupportRequestPayload` now sends the full submission (all portal fields: reason, email, caseId, caseCaseID, requestTypeLabels, firstName, lastName, phone, address, etc.). The API still maps only createable Support_Channel__c fields for the POST; any body keys not mapped or not createable are logged server-side: `[support-request] Not sent to Salesforce (no mapping or not createable): ...`.
- **Teams webhook on submission** – Optional `SUPPORT_SUBMISSION_WEBHOOK_URL` (Teams Incoming Webhook). On successful support-request submit, a fire-and-forget POST sends case name and request type(s) to the channel. Failures are never surfaced to the user or the API response. Helper: `notifySupportSubmissionTeams()` in `src/utils/webhooks.ts`.
- **Type__c picklist resolution** – Support_Channel__c `Type__c` is a restricted picklist. The API fetches picklist values from describe and resolves portal request type labels to the SF API value. **All 17 portal options** (from `REQUEST_TYPES`) are supported: match by SF label (case-insensitive), SF value (case-insensitive), or canonical form (spaces → underscores) if that value exists in the picklist. Only labels in the portal list are used; first matching selected type is sent (single picklist). If no match, `Type__c` is omitted (nillable) so the record still creates. See `docs/salesforce.md` § Type__c picklist.
- **Salesforce CLI (Support project)** – `docs/salesforce.md`: expanded “Creating the Support project” with step-by-step org login, use of `--json` and `-o`/`--target-org`, and Windows full-path fallback (`C:\Program Files\sf\bin\sf.cmd`) when `sf` is not on PATH. **PowerShell script** `scripts/create-support-project.ps1`: uses full path to `sf.cmd` when `sf` is not in PATH; added optional `-TargetOrg` parameter for non-default orgs.

## [1.18.8] - 2026-02-17

### Added
- **Initial step from URL** – Pasting a support-request URL in a new tab now opens on the correct step: URL with both `requestType` and `case`/`caseName` opens on **Support Request Data** (step 3); URL with only `requestType` opens on **Select Case** (step 2); otherwise **Support Request Selection** (step 1).

### Changed
- **InputGroup addon (address block)** – The addon (map pin, home, building icons) next to address and other inputs now uses theme variables (`--surface-d`, `--text-color`, `--surface-border`) so its background and icon color match the selected theme in all six themes.

## [1.18.7] - 2026-02-17

### Added - URL parameters for support request
- **Request type and case in URL** – Support request flow now reads and writes URL params so the link is shareable and reflects the current step. Params: `requestType` (single or comma-separated; human-readable labels in URL, e.g. `Request Notice Packet,Request Passcode`), `case` / `caseName` (case name resolved to case id), plus all form fields (firstName, lastName, email, phone, address, etc.). Parsing accepts both IDs and labels for request types.
- **Step-based URL** – URL is synced to the current step only: on step 0 (Support Request Selection) only `requestType` is in the URL; on step 1 (Select Case) `case` and `caseName` are added; on step 2 (Request Data) all filled form fields are included. Clicking **Previous** from the case step removes `case` and `caseName` from the URL.
- **Validation and error handling** – Invalid URL params (unknown request type ids, case name not found) show an error message on the support-request page with options to start fresh or go home; form still renders below with no invalid prefilled data.
- **Loading overlay** – Full-screen loading overlay on route transitions (`app/loading.tsx`) and during support request submit, using theme variables (`--maskbg`, `--text-color`) for all themes.

### Changed
- **Toast position** – Error/info toasts now appear in the bottom-right corner instead of top-right.
- **Panel toggle icon (light mode)** – Additional Information panel plus/minus icon uses `var(--text-color)` so it is visible in CPT Legacy Light and other light themes.
- **FileUpload (supporting documents)** – Drop zone and button bar use theme variables so the supporting documentation upload area has a light background in light mode instead of the previous dark blue/grey.

### Fixed
- **Invalid params** – Unknown or invalid `requestType` / `caseName` in the URL no longer break the form; validation runs on load and shows a clear error with actions.

## [1.18.6] - 2025-02-12

### Changed - CPT Legacy Dark parity with other themes
- **cpt-legacy-dark.scss** – Brought in line with other themes so background/card and error styling match:
  - **Card** – Added `--card-shadow` and `--card-border` so cards have clear separation from the dark ground (shadow was previously the light-theme fallback). Error messages now use theme variables.
  - **Error message** – Added `--message-error-bg`, `--message-error-border`, `--message-error-text` and scoped overrides for `.p-message.p-message-error` so error messages use dark-appropriate contrast (light text on dark red) and the same variable set as CPT Legacy Light.
- **cpt-legacy-light.scss** – Added `--card-shadow` and `--card-border` for parity with other theme files.

## [1.18.5] - 2025-02-12

### Changed - Default theme and CPT Legacy Light error message contrast
- **Default theme** – Confirmed CPT Legacy Light remains the default (ThemeProvider and layout script use `cpt-legacy-light` when no stored preference).
- **Error message contrast (CPT Legacy Light)** – PrimeReact Message severity="error" was using lara-dark-blue’s light pink text on a light background, which was hard to read. In `cpt-legacy-light.scss`: added theme variables `--message-error-bg`, `--message-error-border`, `--message-error-text` and overrides for `.p-message.p-message-error` so error messages use solid dark red text (`#7f1d1d`) on a light red background (`#fef2f2`) with a clear border (`#b91c1c`). Overrides apply only when `data-theme='cpt-legacy-light'` so other themes are unchanged.

## [1.18.4] - 2025-02-12

### Changed - Dark Synth secondary button: neon purple + glow
- **Secondary button theming** – Added optional theme variables `--button-secondary-bg`, `--button-secondary-text`, `--button-secondary-hover-bg`, `--button-secondary-border`, `--button-secondary-shadow` in `variables.scss` (defaults use surface/text so other themes unchanged). **Dark Synth** overrides these to a neon purple style: bg `#b872f9`, text `#07071b`, hover `#c89cff`, with a soft purple glow (`box-shadow`). `primereact-overrides.scss` applies these vars to `.p-button-secondary` (filled and outlined) so the Previous button and other secondary actions match the synthwave look in dark-synth only.

### Fixed - Scrollbars use theme colors (dropdown, list, sidebar)
- **Global scrollbars** – In `base.scss`: WebKit scrollbars (`*::-webkit-scrollbar`, track, thumb, thumb:hover) now use `var(--scrollbar-track-bg)`, `var(--scrollbar-thumb-bg)`, `var(--scrollbar-thumb-hover-bg)` and `--scrollbar-size`/`--scrollbar-border-radius`. Firefox: `html` uses `scrollbar-color` and `scrollbar-width: thin`.
- **Overlay scrollbars (Firefox)** – In `primereact-overrides.scss`: `.p-dropdown-panel`, `.p-dropdown-items-wrapper`, `.p-listbox-list`, `.p-sidebar-content`, `.p-dialog-content`, `.p-accordion-content` set `scrollbar-color` so dropdown/list/sidebar scrollbars match the active theme (e.g. dark-synth no longer shows white scrollbars).

### Summary
- Theme system: six separate themes (CPT Legacy Light/Dark, Dark, Light, MS Access 2010, Dark Synth), single PrimeReact base + SCSS overrides; light mode contrast, Dropdown/InputText/Sidebar/Steps use theme variables; theme switcher dropdown in sidebar.
- Button icon/label gap and center alignment; theme variables checklist doc for future overrides/themes.

## [1.18.3] - 2025-02-12

### Fixed - Light mode contrast (body, main, headings, sidebar)
- **Body and document text** - lara-dark-blue hardcodes white text; our theme SCSS overrides variables but did not apply them to the document. In `base.scss`: `html` and `body` now use `color: var(--text-color)` and `body` uses `background-color: var(--page-background)` so light themes get dark text and correct background.
- **Main content and headings** - In `globals.css`: `main`, `main h1`–`h4`, `main p`, `main a`, `main label` now use `color: var(--text-color)`; `main a:hover` uses `var(--primary-color)`; added `.text-color-secondary` utility so light mode contrast is correct across page content.
- **Sidebar** - PrimeReact Sidebar used lara-dark-blue hardcoded dark bg/white text. In `primereact-overrides.scss`: `.p-sidebar`, header, content, close/icon buttons, and links/headings inside sidebar now use theme variables (`--surface-card`, `--text-color`, `--text-color-secondary`, `--surface-hover`, `--surface-border`) so the sidebar follows the active theme.

### Fixed - Button icon/label spacing and alignment; Steps (stepper) theme colors
- **Button** – Icon and label were too close and not vertically centered. In `primereact-overrides.scss`: `.p-button` now uses `display: inline-flex`, `align-items: center`, `justify-content: center`, and `gap: 0.5rem`; icon margin overrides set to 0 so gap controls spacing. Previous/Next and other icon+label buttons now have consistent gap and center alignment.
- **Steps (stepper)** – PrimeReact Steps used lara-dark-blue hardcoded white/gray. Overrides added so step number, title, connector line, and highlight state use theme variables (`--text-color`, `--text-color-secondary`, `--surface-border`, `--focus-ring`, `--highlight-bg`, `--highlight-text-color`). Stepper respects the active theme on all six themes.

### Added - Theme variables checklist and override rules
- **docs/theme-variables-checklist.md** – Lists every CSS variable that PrimeReact overrides and base/globals depend on. Rules: (1) New component overrides must use only theme variables so every theme gets the right colors. (2) New themes must define the full variable set with that theme's color scheme. Ensures no PrimeReact component "misses" its theme (e.g. light theme dropdown/inputs staying dark).
- **primereact-overrides.scss** – Header comment lists the variables it uses and points to the checklist. **docs/theme-rework-reference.md** – Linked to the checklist for future overrides/themes.

### Fixed - Light theme Dropdown and InputText use theme colors
- **Dropdown** - lara-dark-blue hardcodes dark background and white text for `.p-dropdown` and `.p-dropdown-panel`. Added overrides in `primereact-overrides.scss` so dropdown trigger, label, placeholder, panel, and items use theme variables (`--surface-card`, `--surface-overlay`, `--text-color`, `--text-color-secondary`, `--surface-hover`, `--highlight-bg`, `--highlight-text-color`, `--surface-border`, `--focus-ring`). Light theme dropdowns now show light backgrounds and dark text.
- **InputText** - Same fix for `.p-inputtext`, filled variant, float label, and placeholder: overrides use theme variables so light theme inputs are light with dark text.

### Changed - Single PrimeReact theme; no legacy theme CSS
- **Layout** - Confirmed only one PrimeReact theme is imported (`lara-dark-blue/theme.css`); no old or duplicate theme CSS. Comment in `layout.tsx` documents that our `main.scss` overrides use theme variables.

### Changed - Themes fully separate; reference doc and dark-synth cleanup
- **Theme separation** - All six themes are documented as completely separate (no shared/merged colors). Each theme file is self-contained with its own literal values; CPT Legacy Dark/Light are support-portal brand; Dark, Light, MS Access 2010, Dark Synth align with cpt-internal-tools. See `docs/theme-rework-reference.md` §7 and theme file headers.
- **Dark Synth** - Removed redundant hardcoded `html`/`body` background and color in `dark-synth.scss`; dark-synth now uses only CSS variables (`--page-background`, `--text-color`) like other themes, applied via base.scss.

### Changed - Theme switcher is a dropdown with all themes
- **HeaderThemeToggle** - Replaced the cycle-theme button with a PrimeReact Dropdown that lists all six themes (CPT Legacy Light/Dark, Dark, Light, Dark Synth, MS Access 2010). Sidebar uses full-width dropdown; same component can be used elsewhere with optional compact width. Selecting a theme applies it and, in the sidebar, closes the menu via `onToggle`.

### Fixed - Light theme header icons visible
- **Header foreground** - Light themes (cpt-legacy-light, light, ms-access-2010) were showing white icons on a light header background. Added `--header-fg` to variables and CPT legacy themes: dark (`#1a3a5c`) for light themes, light (`rgba(255,255,255,0.95)`) for cpt-legacy-dark. Applied in `globals.css` so `header.sticky` and its toolbar/buttons/icons use `var(--header-fg)` for color and focus ring, making header icons visible in all themes.

### Changed - Theme System Aligned with internal-dashboard / cpt-internal-tools
- **Theme architecture** - Adopted the same pattern as internal-dashboard and cpt-internal-tools: one PrimeReact theme CSS (`lara-dark-blue`) plus a single SCSS bundle; theme applied via `data-theme` on `<html>` only (no dynamic theme `<link>` swap).
- **Layout** - `layout.tsx` now imports `primereact/resources/themes/lara-dark-blue/theme.css` and `main.scss`; `<html>` has default `data-theme="cpt-legacy-light"`; added `theme-init` script (`beforeInteractive`) to read `localStorage['cpt-theme']`, validate against allowed theme ids, and set `data-theme` before React to avoid flash.
- **SCSS structure** - Added `src/styles/` with `variables.scss` (default cpt-legacy-light), `base.scss` (resets, Lato fonts), `utilities.scss`; `src/styles/themes/` with six theme files: `dark.scss`, `light.scss`, `dark-synth.scss`, `ms-access-2010.scss`, `cpt-legacy-dark.scss`, `cpt-legacy-light.scss`; `primereact-overrides.scss` for Card, Accordion, Message, Button, Dialog, Panel, ListBox, Fieldset. `src/app/main.scss` orchestrates load order: variables → base → utilities → theme files → primereact-overrides.
- **ThemeProvider** - Removed all dynamic `<link>` creation/update; only sets `document.documentElement.setAttribute('data-theme', theme)` and `localStorage.setItem('cpt-theme', theme)`. Theme type extended to six: `dark`, `light`, `dark-synth`, `ms-access-2010`, `cpt-legacy-dark`, `cpt-legacy-light`. Added `setTheme(theme)`, `cycleTheme()`; kept `toggleTheme()` for CPT legacy light/dark flip. Default theme remains `cpt-legacy-light`.
- **HeaderThemeToggle** - Uses `cycleTheme()` to cycle through all six themes; tooltip/label show current theme name (e.g. "CPT Legacy Light", "Dark Synth"). Icon remains sun for light-like themes, moon for dark-like.
- **globals.css** - Logo and body background/overlay selectors updated for all six themes (light-like: light, cpt-legacy-light, ms-access-2010; dark-like: dark, cpt-legacy-dark, dark-synth). Removed obsolete comments about dual theme CSS loading.
- **Dependency** - Added `sass` (dev) for SCSS compilation.
- **Docs** - `docs/theme-rework-reference.md` documents the reference codebases and target pattern; no change to README theme section (still describes CPT legacy + theme toggle).

### Removed
- **Unused theme CSS files** - Deleted `public/themes/cpt-legacy-dark/theme.css` and `public/themes/cpt-legacy-light/theme.css`; theme styling is now entirely from SCSS variable overrides. Font folders under `public/themes/cpt-legacy-dark/fonts/` and `cpt-legacy-light/fonts/` are kept (Lato is referenced from `base.scss`).

## [1.18.2] - 2025-02-11

### Changed - Compact Layout and Screen Real Estate
- **Main content** - Reduced `<main>` top padding from 5rem to 1.25rem so content sits closer to the header.
- **Support request stepper** - Reduced wrapper padding: top 4rem → 1rem, left/right 10rem → 1.5rem; stepper-to-content and content-to-buttons margins from mt-4 to mt-2.
- **Step cards** - Card margins (mt-4 → mt-2) and step titles (mb-2 → mb-1, mt-0) in StepRequestTypeSelection, StepCaseSelection, StepRequestData for a more compact form.
- **PrimeReact card (themes)** - In both cpt-legacy-light and cpt-legacy-dark: card body padding 1.25rem → 0.75rem; card title margin-top 0, margin-bottom 0.5rem → 0.25rem; card subtitle margin-bottom 0.5rem → 0.25rem; card content and footer padding 1.25rem → 0.5rem.
- **Headings and stepper** - In globals.css: main h1/h2 margin-top 0, margin-bottom 0.25rem; .p-steps vertical padding 0.25rem so the Next button and main content fit without unnecessary scrolling.
- **Line height and vertical rhythm** - Theme CSS `--line-height` 1.5 → 1.35 in both themes; globals: main p and main .line-height-3 use line-height 1.35, paragraph margins 0.5rem bottom. Step components: gap-3 → gap-2, gap-4 → gap-3, mb-3 → mb-2; FAQ intro mb-6 → mb-3; FAQ accordion content line-height 1.75 → 1.35 and contentClassName line-height-3 → line-height-2; FAQFeedbackDialog gaps and mt tightened.
- **Header overlap and vertical centering** - Added `--header-offset` in globals so main content clears the fixed header. Support request stepper wrapper uses `min-height: calc(100vh - var(--header-offset) - 1rem)` with `box-sizing: border-box` and 0.5rem top/bottom padding so total page height does not exceed 100vh when content fits (removes main page scrollbar). Stepper + form block is vertically centered when there is room.
- **No page scrollbar when content fits; less top padding** - html/body set to `margin: 0; padding: 0` to remove default browser margin (strip above header) and avoid extra document height. `--header-offset` reduced to 3.5rem; header Toolbar padding 0.75rem → 0.5rem; stepper wrapper padding 1rem → 0.5rem so only the list scrolls when needed, not the whole page.
- **Smaller step titles** - Support request step titles (e.g. "Support Request Selection") changed from `h2`/`text-3xl` to `h3`/`text-2xl` in StepRequestTypeSelection, StepCaseSelection, and StepRequestData; main h3 added to compact heading rules in globals.
- **Slimmer header** - Toolbar padding 0.5rem → 0.35rem; menu button 2.5rem → 2rem; logo height 32px → 28px; `--header-offset` 3.5rem → 3rem so main content aligns with the shorter header.
- **Tighter text and list spacing** - StepRequestTypeSelection, StepCaseSelection, StepRequestData: gap-2 → gap-1 (or gap-3 → gap-2), title/description/selected paragraphs use mb-0/mb-1 and mt-0 to remove extra line breaks; label uses mt-1 mb-0. ListBox (both themes): header padding 0.75rem 1.25rem → 0.4rem 0.75rem; list padding 0.75rem 0 → 0.25rem 0; item padding 0.75rem 1.25rem → 0.35rem 0.75rem so more options fit on screen.
- **Address duplicate label fix** - CPTAddressBlock now accepts `hideLabel`; when used from SupportRequestField the parent’s FieldLabel is the only label, so "Address *" no longer appears twice.
- **Input layout and phone width** - Email and phone are on the same row on md+ (like first/last name); phone has fixed width 14rem so it stays consistent across screens. Phone-only sections still render phone at 14rem.
- **Max width for support form on large screens** - Added `--support-form-max-width: 56rem`; stepper and form content wrapper use it so the form and inputs don’t stretch too wide on large viewports.

## [1.18.1] - 2025-02-11

### Changed
- **Local dev** - Dev server now runs on port 3777 (`npm run dev` uses `next dev -p 3777`).

### Security
- **axios** - Upgraded from 1.13.2 to 1.13.5 to fix high-severity DoS (GHSA-43fc-jf86-j433 / CVE-2026-25639). Vulnerability was in `mergeConfig` when config contained a `__proto__` key; no application code changes required.

## [1.18.0] - 2025-02-02

### Added - Single Prop/Data-Driven Dialog Shell
- **AppDialog** - One reusable dialog component in `src/components/common/AppDialog.tsx` so content and behavior come from props/children; no need to define many dialog components. Update header and children per screen as needed.
- **not-found** - Error Report dialog now uses `AppDialog`; content (form, success view) remains driven by page state and passed as children.
- **FAQFeedbackDialog** - Uses `AppDialog` instead of raw PrimeReact `Dialog` so all content dialogs share the same shell. Header and content still driven by props (view, selectedFaq, callbacks).

## [1.17.9] - 2025-02-02

### Fixed - Header Logo Not Showing (Inline SVG from cpt-internal-tools)
- **Header logo** - Replaced external image/PrimeReact Image with the same **inline SVG** used in cpt-internal-tools `Logo.tsx` so the logo always renders (no path/basePath issues):
  - `HeaderLogo.tsx` now renders the CPT Group logo as inline SVG (viewBox, defs, paths, star, streamers) from internal-tools `src/components/Logo/Logo.tsx`.
  - Logo styling in `globals.css`: `.logo` (height 32px, width auto), `.logo__text` (fill #0c1f3a light / #ffffff dark), `.logo__star` (radial-gradient light / radial-gradient-dark dark) using `html[data-theme='dark']` to match our theme toggle.
  - Logo is visible in both light and dark mode with correct text and star colors.

## [1.17.8] - 2025-02-02

### Changed - FileUpload Aligned with PrimeReact Documentation
- **SupportFileUpload** - Updated to follow [PrimeReact FileUpload](https://primereact.org/fileupload/) API and types:
  - Added `uploadOptions` (chooseOptions, uploadOptions, cancelOptions per Template section)
  - Typed `uploadHandler` as `(event: FileUploadHandlerEvent) => void` and imported `FileUploadHandlerEvent`; no-op handler for customUpload + auto flow
  - Added Tooltip for `.custom-upload-btn` to match docs Template example
  - Comment in headerTemplate that uploadButton is omitted by design (auto-add on select only)

### Changed - Component Extractions and Hooks (KISS / Small Functions)
- **FAQFeedbackDialog** - Extracted FAQ dialog from SupportRequestStepper into a dedicated component:
  - New `FAQFeedbackDialog.tsx` with three sub-views: FAQContentView, FAQRatingView, FAQConfirmationView
  - Stepper now passes state and callbacks as props; dialog is presentational and reusable
  - SupportRequestStepper reduced from ~552 lines to ~320 (under ~300-line guideline for main route component)
- **SupportRequestField** - Extracted field rendering from StepRequestData into a dedicated component:
  - New `SupportRequestField.tsx` encapsulates one field’s rendering (text, email, phone, textarea, ssn, address, file) with small helpers: buildCommonProps, FieldLabel, FieldError
  - StepRequestData no longer has a 250+ line `renderField` function; it maps over sections and renders `<SupportRequestField />`
  - StepRequestData reduced from ~403 lines to ~115
- **SupportRequestStepper** - Handlers and hooks cleanup:
  - Extracted `handleNextClick` into `useCallback` (no large inline onClick)
  - All FAQ dialog handlers wrapped in `useCallback` (onFaqHide, onFaqThumbsDown, onFaqThumbsUp, onFaqCloseWithoutFeedback, onFaqSubmitFeedback, onFaqBackToHome, onFaqViewFaq) to avoid unnecessary rerenders
  - `STEPS` and `scrollToTopIfMobile` moved to module-level constants/helpers
  - `handleRequestTypesChange`, `handleCaseChange` wrapped in `useCallback`
- **SupportRequest index** - Exported `FAQFeedbackDialog` and `SupportRequestField` from barrel

## [1.17.7] - 2025-02-02

### Changed - Themes and Header Logo from cpt-internal-tools
- **Light and dark themes** - Replaced `public/themes/cpt-legacy-light/theme.css` and `public/themes/cpt-legacy-dark/theme.css` with the updated versions from `cpt-internal-tools`. Same paths and font references; CSS variables and component styles now match the internal-tools codebase. Ready for fine-tuning of both light and dark mode CSS.
- **Header logo** - Replaced header image with CPT Group SVG logo from cpt-internal-tools:
  - Copied `CPTGroupLogo.svg` from cpt-internal-tools `public/` to support-portal `public/`.
  - Updated `HeaderLogo` to use PrimeReact `Image` (not Next.js Image) with `src="/CPTGroupLogo.svg"`, `preview={false}`, and `imageStyle` for sizing so the logo displays correctly and scales in light/dark mode.
- **SupportFileUpload** - Fixed TypeScript: file-remove button `onClick` now wraps PrimeReact `onRemove(event)` in a no-arg callback so the template callback type stays strict.

## [1.17.6] - 2025-02-02

### Added - CPT → PrimeReact Refactor Review
- **Refactor review** - Added `docs/CPT-TO-PRIMEREACT-REFACTOR-REVIEW.md` reviewing the v1.17.5 CPT-to-PrimeReact migration:
  - Verified all CPT components replaced with correct PrimeReact imports and APIs (Dialog, Steps, Toast, Button, Card, ListBox, Dropdown, FileUpload, etc.)
  - Confirmed no remaining @cpt-group/cpt-prime-react references; package and imports correct
  - Checked TypeScript usage and project style (KISS, naming, structure) per Kyle style profile

### Fixed - TypeScript Typing
- **SupportFileUpload** - Replaced loose `callback: Function` with `callback: () => void` in `onTemplateRemove` to adhere to project rule: no loose typings (no any/unknown/Function).

## [1.17.5] - 2025-02-02

### Changed - Removed CPT Prime React Library (Use Base PrimeReact)
- **Removed @cpt-group/cpt-prime-react** - Replaced all CPT wrapper components with base PrimeReact components so theming drives colors and styles directly:
  - CPTButton → Button (primereact/button)
  - CPTDialog → Dialog (primereact/dialog)
  - CPTSteps → Steps (primereact/steps)
  - CPTInputTextarea → InputTextarea (primereact/inputtextarea)
  - CPTMessage → Message (primereact/message)
  - CPTCard → Card (primereact/card)
  - CPTListbox → ListBox (primereact/listbox)
  - CPTDropdown → Dropdown (primereact/dropdown)
  - CPTProgressSpinner → ProgressSpinner (primereact/progressspinner)
  - CPTInputText → InputText (primereact/inputtext)
  - CPTInputMask → InputMask (primereact/inputmask)
  - CPTAutoComplete → AutoComplete (primereact/autocomplete)
  - CPTFieldset → Fieldset (primereact/fieldset)
  - CPTPanel → Panel (primereact/panel)
  - CPTDivider → Divider (primereact/divider)
- **Removed unused dependencies** - No longer needed without CPT library barrel:
  - chart.js
  - quill
- **Theme unchanged** - Existing themes in `public/themes/` (cpt-legacy-light, cpt-legacy-dark) continue to drive all colors and styles via ThemeProvider.
- **README** - Updated Tech Stack to list PrimeReact components instead of @cpt-group/cpt-prime-react; removed "Required peer dependencies" note.

## [1.17.4] - 2025-02-02

### Removed - Stale Code and Unused Dependencies
- **Orphaned Step Components** - Deleted legacy step components from pre-consolidation 4-step flow:
  - Removed `StepPersonalInfo.tsx` (replaced by identity section in StepRequestData)
  - Removed `StepIssueDetails.tsx` (replaced by request type selection + dynamic fields)
  - Removed `StepDescriptionUpload.tsx` (replaced by optional fields in StepRequestData)
  - Support request form has been 3-step (Request Type → Case → Request Data) since v1.5.0; these were never imported or exported
- **Unused Dependencies** - Removed from package.json:
  - `chart.js` - Not imported anywhere
  - `quill` - Not imported anywhere
  - Kept `react-hook-form` for future use as requested
  - Note: `lodash-es` was not present in current package.json
- **Code Review Follow-Up** - Added `CODE-REVIEW-FOLLOW-UP.md` with a pass against project coding style (KISS, file size, structure); documented file-size findings and optional refactor suggestions. Updated `CODE-REVIEW-REPORT.md` to reference the follow-up.

## [1.17.3] - 2025-01-27

### Changed - FAQ Feedback UI
- **Rating Stars Size** - Increased star size in FAQ feedback rating component:
  - Changed from `text-2xl` to `text-4xl` for better visibility and user experience

## [1.17.2] - 2025-01-27

### Changed - Sidebar Navigation Labels
- **Home Button Label** - Simplified sidebar home button label:
  - Changed from "Back To Home" to "Home" for cleaner UI
  - Updated aria-label and tooltip to match
- **Theme Toggle Labels** - Simplified theme toggle button labels:
  - Changed from "Switch to Dark Theme" / "Switch to Light Theme" to "Dark Theme" / "Light Theme"
  - Updated aria-label and tooltip to match

## [1.17.0] - 2025-01-27

### Added - Enhanced Metadata and Legal Pages
- **Enhanced Page Metadata** - Improved SEO and metadata across all pages:
  - Root layout: Updated to "CPT Group Support Portal | Class Member Support Center"
  - Added class action and settlement administration keywords
  - Enhanced descriptions with class action context
  - Home page: Added page-specific metadata
  - FAQ page: Enhanced with class action keywords and descriptions
  - Support Request page: Enhanced with detailed descriptions
  - Success page: Updated branding to CPT Group
- **Terms and Privacy Pages** - Created legal pages with iframe integration:
  - `/terms` - Terms of Use page with iframe from cptgroupcaseinfo.com
  - `/privacy` - Privacy Policy page with iframe from cptgroupcaseinfo.com
  - Both pages use iframe to display content from cptgroupcaseinfo.com
  - Pages have `noindex, nofollow` metadata to prevent search engine indexing
  - Styled with white card, shadow, and 600px height matching reference sites
- **Sidebar Footer Links** - Added Terms and Privacy links to sidebar footer:
  - Small text links below CPT Group button
  - Separated by pipe character
  - Links close sidebar and navigate to respective pages
  - Styled to match reference site patterns
- **Robots.txt** - Created robots.txt to control search engine crawling:
  - Disallows: `/terms`, `/privacy`, `/support-request/success`, `/api/`
  - Allows all other pages for proper SEO

### Changed - Next.js Configuration
- **Headers Configuration** - Added X-Frame-Options headers for Terms/Privacy pages:
  - Configured in `next.config.ts` for proper iframe handling
  - Ensures compatibility with Netlify deployment

## [1.16.2] - 2025-01-27

### Changed - File Upload Improvements
- **Auto-Upload File Selection** - Files now automatically upload when selected:
  - Removed upload button from file upload component
  - Files are added immediately upon selection (no manual upload step)
  - Header now shows only "Choose" (file select) and "Clear" (delete) buttons
  - Simplified user experience with instant file addition

### Fixed - Navigation Confirmation Logic
- **Back to Home Button** - Fixed false confirmation dialog appearing on non-form pages:
  - Confirmation dialog now only shows when actually on `/support-request` page
  - Added pathname check to ensure confirmation only appears for support request form
  - FAQ page and other pages no longer show "you'll lose progress" message incorrectly
  - Confirmation only appears when form is active AND user is on support request page

## [1.16.1] - 2025-01-27

### Changed - UI Improvements
- **Scrollable Listboxes** - Added max height constraints to prevent long lists from making screens too tall:
  - Request Type Selection listbox: Max height of 30vh with scrollable overflow
  - Case Selection dropdown: Scroll height set to 35vh for better viewport management
  - Improves user experience by keeping form content within viewport

## [1.16.0] - 2025-01-27

### Fixed - Header Visibility
- **Header Always Visible** - Removed conditional hiding logic:
  - Header (logo and hamburger menu) is now always visible on all pages
  - Removed FAQ dialog conditional hiding that was causing header to disappear
  - Header now properly displays on all support request form steps (including steps 2 and 3)
  - Fixed positioning ensures header stays at top on all pages

### Added - Sidebar Navigation
- **FAQ Link in Sidebar** - Added FAQ navigation option to sidebar menu:
  - FAQ button appears in sidebar between "Back to Home" and "Theme Toggle"
  - Only shows when user is not already on FAQ page
  - Navigates to `/faq` and closes sidebar on click
  - Uses question-circle icon for consistency

### Changed - UI Improvements
- **Stepper Transparency** - Made Steps component boxes transparent:
  - All step boxes now have transparent backgrounds on both dark and light themes
  - Background images and overlays show through the stepper
  - Applies to all states: default, hover, focus, and active/highlighted
- **Development Port** - Changed dev server port from 3000 to 3005:
  - Updated `package.json` dev script to use port 3005
  - Prevents port conflicts with other services

## [1.15.0] - 2025-01-27

### Added - Custom 404 Error Page with Error Reporting
- **Custom 404 Page** - Created beautiful 404 page using PrimeReact components:
  - Large 404 icon and clear messaging
  - Three action buttons: "Back to Home", "CPT Corporate", "Report This Error"
  - Responsive design with centered layout
  - Follows Next.js App Router conventions (`app/not-found.tsx`)
- **Error Reporting Dialog** - Integrated error reporting feature:
  - Optional fields: Name, Email, Additional Information (textarea)
  - Cancel and Send buttons
  - Success confirmation with auto-close
  - Error handling with user-friendly messages
  - Loading states during submission
- **Error Report Webhook** - Server-side API route for error reporting:
  - Created `/api/webhooks/error-report` API route
  - Proxies requests to Microsoft Teams webhook (avoids CORS)
  - Formats messages for Teams with error details
  - Handles empty submissions ("No feedback given") to reduce bot traffic
  - Includes error type, path, timestamp, and optional user feedback
- **Webhook Utilities** - Added error reporting functions:
  - `ErrorReportWebhookData` interface
  - `sendErrorReportWebhook()` function in `src/utils/webhooks.ts`

### Changed - Header Navigation Simplified
- **Hamburger Menu Default** - Made hamburger menu the default for all screen sizes:
  - Removed mobile detection logic and breakpoints
  - Always shows hamburger menu button (no desktop buttons)
  - Cleaner, more consistent header design
- **Removed Desktop Buttons** - Removed "Back to Home" and "Theme Toggle" from header:
  - All navigation now through sidebar menu
  - Removed unused imports and mobile breakpoint logic
  - No media queries needed for header buttons
- **Sidebar Footer** - Added CPT Group link at bottom of sidebar:
  - Outlined button with external link icon
  - Confirmation dialog before navigating to https://cptgroup.com
  - Positioned at bottom using flexbox layout

## [1.14.0] - 2025-01-27

### Changed - Support Form Text Updates
- **Optional Fields Section** - Renamed to "Additional Information":
  - Panel header changed from "Optional Fields" to "Additional Information"
  - More user-friendly naming convention
- **Sub-section Headers Removed** - Simplified optional fields display:
  - Removed sub-section headers (e.g., "Identity Verification") from Additional Information section
  - Fields now display directly without verbose section grouping
  - Reduces visual clutter when multiple optional fields are present
- **CPT ID Help Text** - Updated with clearer instructions:
  - Changed from: "CPT ID is optional but may help us process your request faster"
  - Changed to: "CPT ID can be located on your Notice. It's typically in the upper right corner of a letter or email or above your address on a postcard."
  - Provides specific location guidance for users

## [1.13.0] - 2025-01-27

### Fixed - Layout and Overflow Issues
- **Body Height and Padding** - Removed fixed height and padding-top from body:
  - Body is now dynamic (no fixed height causing overflow)
  - Removed `padding-top: 5rem` from body
  - Removed `height: 100%` from body
- **MainContent Wrapper** - Created new MainContent component for proper spacing:
  - Wraps all page content in `<main>` element
  - Adds `padding-top: 5rem` for all pages except home (`/`)
  - Home page has `padding-top: 0` (handles its own spacing)
  - Content is dynamic - no fixed heights causing scrollbars
- **Home Hero Overflow** - Fixed scrollbar issue on large screens:
  - Updated height calculation to use `box-sizing: border-box`
  - Simplified padding to prevent overflow
  - Hero section now fits within viewport without causing scrollbars

### Changed - Background Images Restored
- **Background Images** - Uncommented and restored background images:
  - Light theme: `cptbg-law-light.png`
  - Dark theme: `cptbg-law.png`
  - Background images are active again
- **Overlay Opacity** - Increased static overlay darkness:
  - Changed from 70% to 80% opacity for better contrast
  - Light theme: `rgba(255, 255, 255, 0.8)`
  - Dark theme: `rgba(0, 0, 0, 0.8)`
- **Animated Gradient** - Restored animated gradient overlay (was temporarily commented out)

### Technical Details
- Created `src/components/layout/MainContent.tsx` for conditional padding
- Updated `src/app/layout.tsx` to wrap children in MainContent
- Updated `src/components/layout/index.ts` to export MainContent
- Updated `src/app/globals.css` to remove body height/padding constraints
- Updated `src/components/pages/Home/HomeHero.tsx` with better height calculation

## [1.12.0] - 2025-01-27

### Added - FAQ Feedback System with Inline Dialog
- **FAQ Feedback Dialog** - Integrated feedback collection directly in FAQ dialog:
  - Removed navigation to separate `/congratulations` page
  - Feedback form now appears inline within the FAQ dialog
  - Three dialog views: FAQ content, Rating form, Confirmation
  - Header dynamically hides when FAQ dialog is open
- **Webhook Integration** - Server-side API route for Teams webhook:
  - Created `/api/webhooks/faq-feedback` API route to proxy webhook requests
  - Avoids CORS issues by handling webhook on server-side
  - Formats messages for Microsoft Teams incoming webhooks
  - Webhook triggers when user closes dialog or submits feedback (not on initial "Yes" click)
- **Feedback Data Collection**:
  - When user clicks "Close": Sends webhook with "No feedback given"
  - When user submits: Sends webhook with rating and description
  - Teams message format includes FAQ question, FAQ ID, rating (if provided), description (if provided), and timestamp
- **Confirmation View Updates**:
  - Changed "Continue to Form" to "Back to Home" and "View FAQ" buttons
  - Users who found FAQ helpful don't need to continue with form

### Changed - FAQ Dialog Flow
- **Thumbs Up Button** - No longer sends webhook immediately:
  - Now just switches to rating view
  - Webhook sent when user closes or submits feedback
- **Close Button** - Now sends webhook with "No feedback given" status
- **Submit Button** - Sends webhook with full feedback data (rating + description)

### Changed - UI Improvements
- **Body Top Margin** - Added 5rem top padding to body to account for fixed header
- **Background Images** - Temporarily commented out background images in globals.css
- **Rating Form** - Removed introductory text, goes straight to rating and comments fields
- **Button Labels** - Changed "Cancel" to "Close" in feedback form

### Technical Details
- Created `src/app/api/webhooks/faq-feedback/route.ts` for server-side webhook proxy
- Updated `src/utils/webhooks.ts` to use API route instead of direct fetch
- Updated `src/providers/HeaderProvider.tsx` to track FAQ dialog state
- Updated `src/components/layout/Header.tsx` to hide when FAQ dialog is open
- Updated `src/components/pages/SupportRequest/SupportRequestStepper.tsx` with inline feedback flow
- Teams webhook format: Simple text format with structured data
- Netlify configuration updated to document `NEXT_PUBLIC_FAQ_FEEDBACK_WEBHOOK_URL` requirement

## [1.11.0] - 2025-01-27

### Added - FAQ Feedback System
- **FAQ Feedback Page** - New `/congratulations` page for collecting user feedback:
  - Personalized message based on FAQ topic (e.g., "We're glad our address change FAQ helped you!")
  - PrimeReact Rating component (1-5 stars) for support rating
  - Optional textarea for additional comments and suggestions
  - Submit button with loading spinner during submission
  - Confirmation state after submission with "Back to Home" button
  - JSON data display for prototype/testing purposes
- **Webhook Integration** - Webhook utility for sending FAQ feedback data:
  - Sends initial webhook when user clicks thumbs up on FAQ dialog
  - Sends detailed feedback webhook with rating and comments after form submission
  - Configurable via `NEXT_PUBLIC_FAQ_FEEDBACK_WEBHOOK_URL` environment variable
  - Gracefully handles missing webhook URL (logs in development, silent in production)
- **FAQ Dialog Enhancement** - Updated thumbs up button behavior:
  - Now navigates to feedback page instead of just closing dialog
  - Sends initial webhook with FAQ ID, question, and timestamp
  - Improved tooltip text: "Yes - Share feedback"

### Technical Details
- Created `src/utils/webhooks.ts` for webhook functionality
- Created `src/app/congratulations/page.tsx` with feedback form
- Created `src/app/congratulations/layout.tsx` with metadata (noindex)
- Updated `SupportRequestStepper.tsx` to handle FAQ feedback navigation
- Uses PrimeReact Rating component directly (not wrapped in CPT component)
- Feedback data includes: FAQ ID, question, timestamp, rating (1-5), and optional comments

## [1.10.0] - 2025-01-27

### Changed - Header and FAQ Improvements
- **Header Full Width** - Fixed header to span full viewport width:
  - Changed from `sticky` to `fixed` positioning to break out of parent padding
  - Header now extends edge-to-edge regardless of page padding
  - Prevents horizontal scrolling issues
  - Content scrolls below header, header stays fixed at top
- **Header Transparency** - Enhanced header backdrop blur effect:
  - Dark mode: More transparent (`rgba(120, 140, 160, 0.3)`) with lighter grey-blue tint
  - Light mode: More transparent (`rgba(220, 230, 240, 0.7)`) with darker blue-grey
  - Added `backdropFilter: blur(10px)` for frosted glass effect
- **Header Icon Brightness** - Improved icon and menu text visibility:
  - Dark mode: Brighter blue-white colors (`rgba(235, 245, 255, 1)`)
  - Sidebar icons and text use brighter blue-white for better contrast
  - Hover states use even brighter colors
- **Steps Component Background** - Fixed white background issue:
  - Light mode: Changed from white to theme background (`var(--surface-ground)`)
  - Dark mode: Changed from transparent to theme background (`var(--surface-ground)`)
  - Step numbers now blend with page background
- **FAQ Dialog Improvements**:
  - Dynamic header: Uses FAQ question as dialog header instead of "Did you know?"
  - HTML rendering: FAQ answers now render HTML for proper bullet points
  - Removed duplicate bullet characters (•) from list items
  - Left-aligned content for better readability with lists
  - Updated FAQ data to use proper HTML `<ul>` and `<li>` tags

### Fixed
- **Horizontal Scroll Prevention** - Added `overflow-x: hidden` to html/body
- **Header Scrollbar Issues** - Fixed double scrollbar and scroll past header issues

## [1.9.0] - 2025-01-27

### Added - Sticky Header with Mobile Responsiveness
- **New Header Component** - Created a sticky header component using PrimeReact Toolbar:
  - CPT logo on the left (links to home)
  - "Back To Home" button and theme toggle on the right (desktop)
  - Hamburger menu button on mobile that opens a sidebar
  - Sticky positioning with proper z-index
  - Uses `--header-bg` CSS variable for theme-aware background color
- **Modular Header Components** - Refactored header into reusable, performant sub-components:
  - `HeaderLogo.tsx` - Memoized logo component with configurable props
  - `HeaderThemeToggle.tsx` - Memoized theme toggle with desktop/mobile variants
  - `HeaderBackToHome.tsx` - Memoized navigation button with desktop/mobile variants
  - `HeaderSidebar.tsx` - Memoized sidebar component for mobile menu
  - All components use `React.memo()` and proper `useCallback`/`useMemo` for performance
- **Header Provider** - Created `HeaderProvider` context to manage form active state:
  - Allows pages to communicate form state to header for confirmation dialogs
  - Prevents accidental navigation away from active forms
- **Mobile Responsive Design** - Header transforms on mobile (< 992px):
  - Hamburger menu button replaces desktop buttons
  - Sidebar slides in from right with menu options
  - Full-width buttons with left-aligned icons in sidebar
  - Sidebar closes automatically on navigation or theme toggle

### Changed - UI Contrast and Color Improvements
- **Header Background Colors** - Added `--header-bg` CSS variable:
  - Dark mode: Lighter blue (`#4a6a9e`) for better visibility
  - Light mode: White (`#ffffff`) matching the theme
- **Listbox Selection Colors** - Improved contrast for selected/focused items:
  - Dark mode: White text on blue-gold background (`rgba(91, 122, 168, 0.4)`)
  - Light mode: Darker blue text on light blue background (`#D4E4F5`)
  - Focus states use brighter blue-gold colors for better visibility
- **Step Number Colors (Dark Mode)** - Enhanced visibility:
  - Regular steps: White text with blue-gold border and subtle background
  - Highlighted steps: White text on stronger blue-gold background
  - Better contrast against dark backgrounds
- **Button Text Contrast (Dark Mode)** - Improved button visibility:
  - Text buttons: Increased opacity from 60% to 95% white
  - Hover states: Full white with blue-gold background tint
  - Active states: Full white with stronger blue-gold background
  - Icons inherit brighter colors automatically

### Removed
- **Old Components** - Removed standalone components replaced by header:
  - `src/components/common/ThemeToggle.tsx` (functionality moved to Header)
  - `src/components/layout/BackToHome.tsx` (functionality moved to Header)
  - Updated index files to remove exports

## [1.8.0] - 2025-01-27

### Changed - Theme Transformation to CPT Brand
- **Theme Renaming** - Renamed themes from `soho-light`/`soho-dark` to `cpt-legacy-light`/`cpt-legacy-dark`:
  - Updated theme folder names in `public/themes/`
  - Updated all code references in `ThemeProvider.tsx` and `PrimeReactProvider.tsx`
  - Themes now reflect CPT brand identity
- **CPT Legacy Light Theme** - Updated to match CPT brand colors from example sites:
  - Primary color: Changed to CPT blue (`#405c8e`) matching the banner gradient
  - Red accent: Updated to American red (`#db1a4f`) for buttons and accents
  - Background: Maintained light gray (`#f5f7fa`) for clean, professional appearance
  - Text colors: Dark blue/navy (`#1a3a5c`) for excellent readability
  - Updated blue and primary color scales to match banner colors
- **CPT Legacy Dark Theme** - Updated to match CPT brand colors:
  - Primary color: Updated to American red (`#db1a4f`) for buttons and interactive elements
  - Background: Dark blue (`#222c61`) matching the banner gradient middle color
  - Surfaces: Updated card and overlay colors to match dark blue theme
  - Focus rings and highlights: Updated to use American red with appropriate tints
  - Updated red and primary color scales to match brand
- **Default Theme** - Light theme remains the default (already configured)
- All theme switching functionality preserved and working seamlessly

## [1.7.0] - 2025-01-27

### Changed - FAQ Data Update
- **Updated FAQ Content** - Replaced all FAQ items with new content from `Support Portal - FAQ-CONTENT.csv`:
  - Updated all 15 FAQs with new questions and answers
  - Changed FAQ IDs from `faq-001` format to UUID format (e.g., `550e8400-e29b-41d4-a716-446655440001`)
  - FAQs now ordered by sort order (1-15) matching the CSV
- **Updated Request Type FAQ Links** - Updated all `faqLink` references in request types to use new UUIDs:
  - Request Passcode (ID: 4) → `550e8400-e29b-41d4-a716-446655440010` (What is my ID and/or Passcode?)
  - Request Check Reissue (ID: 6) → `550e8400-e29b-41d4-a716-446655440015` (What if I Did Not Receive my Payment?)
  - Did you Receive my Response? (ID: 14) → `550e8400-e29b-41d4-a716-446655440011` (Did you Receive my Response?)
  - Have you Received my Supporting Documents? (ID: 15) → `550e8400-e29b-41d4-a716-446655440012` (Did you Receive my Supporting Documents?)
  - What is my Settlement Amount? (ID: 16) → `550e8400-e29b-41d4-a716-446655440004` (What is my Settlement Amount?)
  - When will I Receive my Settlement Payment? (ID: 17) → `550e8400-e29b-41d4-a716-446655440013` (When Will I Receive my Settlement Payment)

## [1.6.0] - 2025-01-27

### Changed - Major Field Consolidation and Request Type Reordering
- **Request Types Reordered by Sort Order** - Request types are now displayed in sort order (1-17) instead of ID order:
  - Sort 1: Request Notice Packet (ID: 3)
  - Sort 2: Request Passcode (ID: 4)
  - Sort 3: Update Mailing Address (ID: 1) - renamed from "Update Contact Information"
  - Sort 4: Request Name Change (ID: 2) - renamed from "Name Change"
  - Sort 5: Deceased Class Member (ID: 8)
  - Sort 6: Request to Be Added to Case (ID: 5)
  - Sort 7: Respond to Dispute Notice (ID: 7)
  - Sort 8: Respond to Deficient Notice (ID: 9)
  - Sort 9: Respond to SSN/W9 Request (ID: 13)
  - Sort 10: Request Check Reissue (ID: 6)
  - Sort 11: Request Cashed Check Copy (ID: 11)
  - Sort 12: Request Tax Forms (ID: 10)
  - Sort 13: Request Fraud Affidavit Packet (ID: 12)
  - Sort 14: Did you Receive my Response? (ID: 14)
  - Sort 15: Have you Received my Supporting Documents? (ID: 15)
  - Sort 16: What is my Settlement Amount? (ID: 16)
  - Sort 17: When will I Receive my Settlement Payment? (ID: 17) - renamed from "When will I Receive my Check?"
- **Address Field Consolidation** - Consolidated `mailingAddress` and `address` into a single `address` field:
  - Removed `mailingAddress` field from form configuration
  - All references to `mailingAddress` now use `address`
  - Updated URL parameter parsing to handle both `address` and legacy `mailingAddress` parameters
  - Address fields now consistently use `address`, `previousAddress`, and `newAddress` only
- **Field Renaming for Clarity**:
  - `detailedResponse` → `additionalDescription` (text area for user input)
  - `supportingDocs` → `supportingDocumentation` (file upload field)
  - Updated all field normalization maps and display labels
  - Updated all component references to use new field names
- **Updated Request Type Field Requirements** - Updated required and optional fields for all 17 request types based on new CSV:
  - "Request Passcode" now only requires `name, email, phone` (no address)
  - "Update Mailing Address" requires `previousAddress` and `newAddress` (no separate `address` field)
  - "Request Check Reissue" requires `previousAddress` and `newAddress` (no separate `address` field)
  - "Respond to Deficient Notice" now requires `additionalDescription` (was `detailedResponse`)
  - "Respond to SSN/W9 Request" has `supportingDocumentation` and `additionalDescription` as optional
  - All request types now consistently use `address` instead of `mailingAddress`
- **Field Name Consistency** - Standardized field name casing:
  - `ssnTaxId` used consistently (not `ssnTaxID`)
- **Removed Unnecessary Normalization Maps** - Cleaned up unused normalization code:
  - Removed `FIELD_NORMALIZATION_MAP` and `NORMALIZED_TO_DISPLAY` from `formConfig.ts` (never used)
  - Removed `normalizeFieldName` function from `formFields.ts` (never called)
  - Field IDs are used directly throughout the codebase
  - Labels come directly from `FieldConfig.label` in `formFields.ts`
  - No conversion needed since we use consistent field IDs everywhere

### Technical Details
- Request types array in `requestTypes.ts` reordered by sort order (1-17)
- Form fields configuration updated in `formFields.ts`:
  - Removed `mailingAddress` field definition
  - Renamed `detailedResponse` to `additionalDescription`
  - Renamed `supportingDocs` to `supportingDocumentation`
- Removed unused normalization maps and functions (field IDs used directly)
- URL parameter parsing updated in `urlParams.ts` to handle address consolidation
- JSON generator already handles field names dynamically, no changes needed
- Field consolidation logic works with new field names automatically
- All components use field configurations dynamically, so updates propagate automatically

## [1.5.1] - 2025-01-27

### Changed - Updated Request Types and Field Requirements from QA/Project Owners CSV
- **Updated All Request Type Labels** - Updated all 17 request type labels to match the updated CSV exactly:
  - "Address Update" → "Update Contact Information"
  - "Notice Packet Request" → "Request Notice Packet"
  - "Passcode Request" → "Request Passcode"
  - "Requests to Be Added" → "Request to Be Added to Case"
  - "Check Reissue Request" → "Request Check Reissue"
  - "Dispute Work Weeks/Shifts" → "Respond to Dispute Notice"
  - "Deficiency Response" → "Respond to Deficient Notice"
  - "Tax Form Request" → "Request Tax Forms"
  - "Copy of Cashed Check" → "Request Cashed Check Copy"
  - "Request Fraud Affidavit" → "Request Fraud Affidavit Packet"
  - "SSN Response" → "Respond to SSN/W9 Request"
  - "Did you receive my claim form/response?" → "Did you Receive my Response?"
  - "Have you received my supporting documents?" → "Have you Received my Supporting Documents?"
  - "What is my settlement amount?" → "What is my Settlement Amount?"
  - "When will I receive my check?" → "When will I Receive my Check?"
- **Updated Field Requirements** - Updated required and optional fields for all request types based on CSV:
  - Added `email` and `mailingAddress` as required for many more request types
  - Added `address` as required for ALL request types (was previously only for some)
  - Added `reason` requirement for several types (Name Change, Request to Be Added, Check Reissue, Respond to Dispute) - satisfied by auto-generation
  - Request types 14-17 no longer require `firstName` and `lastName` (name field), but they appear as optional in UI
- **Made CPT ID Optional** - `cptId` is now optional for all request types:
  - Added `cptId` to `optionalFields` array for all 17 request types
  - Updated `formFields.ts` to set `required: false` for `cptId`
  - Updated placeholder to "Enter your CPT ID (optional)"
  - Added help text: "CPT ID is optional but may help us process your request faster"
- **JSON Output Updates** - Updated JSON generator to match CSV requirements:
  - Creates `fullName` field from `firstName` + `lastName` for JSON output (UI still uses separate fields)
  - Excludes `firstName` and `lastName` from JSON payload (only sends `fullName`)
  - Ensures `reason` field is always included in payload (even if empty string, though it should always have content)
- **Field Consolidation Logic** - Enhanced field consolidation to properly handle required vs optional:
  - Required fields from consolidation now have `required: true` set explicitly
  - Optional fields from consolidation now have `required: false` set explicitly
  - This ensures UI correctly shows asterisks (*) for required fields and not for optional fields
- **Validation Logic Updates** - Updated validation to respect consolidated field requirements:
  - `validateField` now accepts optional `fieldConfig` parameter to use consolidated field config
  - Validation now properly respects whether a field is required or optional based on selected request types
  - Optional fields (like `firstName`/`lastName` for types 14-17) are only validated if they have values

### Technical Details
- All changes are logic/code-behind updates - no UI/styling changes
- Form is now entirely driven by request type configurations (no hardcoded requirements)
- Field requirements can be easily updated by modifying `requestTypes.ts` arrays
- Maintains existing sort order and input priorities with order properties

## [1.5.0] - 2025-01-27

### Fixed - Critical Form Submission and Validation Issues
- **Fixed Infinite Loop in Address Component** - Resolved "Maximum update depth exceeded" error in `CPTAddressBlock.tsx`
  - Used `useRef` to track last address value and prevent unnecessary `onChange` calls
  - Implemented `onChangeRef` pattern to avoid dependency array issues
  - Initialization now only runs once on mount using `initializedRef`
  - Prevents infinite re-render loops that were blocking form submission
- **Simplified Address Validation** - Removed strict validation requirements for address fields
  - Removed `minLength` validation from all address fields (mailingAddress, previousAddress, newAddress, address, beneficiaryAddress)
  - Address fields now only validate:
    - Presence when `required: true`
    - Maximum length (500 characters) if value exists
  - No pattern matching or complex validation rules for addresses
  - Address validation logic skips minLength, pattern, and custom validation checks
- **Fixed Optional Fields Validation** - Ensured optional fields don't block form submission
  - `additionalDescription` and `supportingDocs` correctly set to `required: false`
  - Validation logic only validates optional fields if they have values
  - Optional fields with empty values won't cause validation errors
  - Fixed validation to properly distinguish between required and optional fields
- **Disabled API Autocomplete** - Commented out all Geoapify API functionality
  - All API-related code is commented out in `CPTAddressBlock.tsx`
  - Address component defaults to manual entry mode only
  - No API calls are being made to prevent errors and reduce complexity
  - Removed unused imports (axios, AutoComplete, etc.)
- **Improved Submit Button and Toast Notifications** - Enhanced user feedback during submission
  - Added loading spinner to submit button during form processing
  - Button is disabled during submission to prevent double submissions
  - Toast notifications for validation errors, submission progress, and success
  - Proper error messages for all field types

### Fixed - Duplicate File Upload and Container Height Issues
- **Removed Duplicate File Upload in Optional Fields Panel** - Removed the duplicate `additionalFiles` field that was appearing alongside `supportingDocs` in the optional fields panel
  - Removed `additionalFiles` field definition from `formFields.ts`
  - Removed logic in `StepRequestData.tsx` that was adding `additionalFiles` to optional fields
  - Only `supportingDocs` (order 2) remains as the file upload field in the optional section
  - This eliminates the duplicate file upload component that was confusing users
- **Fixed Container Height Issue** - Fixed the stepper container and optional fields panel so they grow properly with content
  - Added `height: auto` and `overflow: visible` styles to CPTCard, CPTPanel, and container divs in `StepRequestData.tsx`
  - Added `height: auto` and `overflow: visible` styles to container divs in `SupportRequestStepper.tsx`
  - Added CSS rules in `globals.css` to ensure PrimeReact Panel and Card components allow content to expand properly
  - The optional fields panel now expands correctly when opened, and the stepper buttons stay at the bottom as expected
  - Parent containers now grow with their content instead of having fixed heights that cut off expanded panels

### Fixed - Critical Form Submission Bugs
- **Fixed Maximum Update Depth Exceeded Error** - Removed problematic `useEffect` in `StepRequestData.tsx` that was causing infinite re-render loops
  - The effect was calling `onFieldChange` which triggered `updateFormData`, causing `formData.reason` to change, which retriggered the effect
  - Removed redundant reason pre-fill logic from `StepRequestData` (already handled in `SupportRequestStepper`)
  - This was preventing form submission and causing React to throw "Maximum update depth exceeded" errors
- **Fixed Submit Button Not Working** - Corrected submit button logic to properly validate and submit the form
  - Submit button now directly calls `handleSubmit()` which validates step 2 before submission
  - Previously, submit button was calling `goToNextStep()` which wouldn't work on the final step
  - Added `validateStep` to hook return values and properly memoized `handleSubmit` callback
- **Memoized Callback Functions** - Wrapped `handleFieldChange` and `handleFieldBlur` in `useCallback` to prevent unnecessary re-renders
  - Prevents child components from re-rendering when parent re-renders
  - Follows React best practices for performance optimization
- **UI Overflow Fixes** - Added `overflow: visible` styles to form containers to prevent content clipping
  - Applied to `CPTCard`, `CPTPanel`, and stepper container elements
  - Ensures address autocomplete dropdowns and other dynamic content display correctly

### Changed - Stepper Flow and Optional Section Consolidation
- **Removed Step 4** - The "Additional Documentation" step has been removed from the stepper flow.
- **Consolidated Optional Fields** - The `additionalDescription` (textarea) field is now integrated into Step 3's "Optional Fields" section.
- **Updated Optional Field Ordering** - Within the optional section, fields are now ordered as:
  - `additionalDescription` (order 1)
  - `supportingDocs` (order 2) - file upload field
- **Reduced Stepper to 3 Steps** - The support request form now consists of 3 steps: "Support Request Selection", "Select Case", and "Support Request Data".
- **Adjusted Navigation Logic** - The `useSupportRequestForm` hook and `SupportRequestStepper` component have been updated to reflect the 3-step flow, with the "Submit" button appearing on the final (third) step.
- **Deleted StepAdditionalDocumentation Component** - Removed the standalone `StepAdditionalDocumentation.tsx` component as its functionality is now integrated into `StepRequestData`.

### Changed - Field Ordering and Section Organization
- **Comprehensive Field Ordering** - Added `order` property to ALL fields in `formFields.ts`
  - Identity section fields: Name (1), Email Address (2), CPT ID (3), Phone (4), Mailing Address (5)
  - Request-specific fields: Previous Address (1), New Address (2), Previous Name (3), New Name (4), Reason (5), Address (6), Detailed Response (7), SSN/Tax ID (8)
  - Beneficiary fields: Beneficiary Name (1), Beneficiary Address (2), Beneficiary Email (3)
  - Optional fields: Additional Description (1), Supporting Documents (2), Additional Files (3)
- **Section-Based Organization** - Added `section` property to `FieldConfig` type
  - Sections: `identity` (order 1), `request-specific` (order 2), `beneficiary` (order 3), `optional` (order 4)
  - Created `organizeFieldsBySection()` function to group and order fields by sections
  - Section order is configurable via `SECTION_ORDER` constant in `formFields.ts`
  - Section labels defined in `SECTION_LABELS` constant
  - Identity section (personal information) always appears first by default
- **Updated StepRequestData Rendering** - Now dynamically renders fields organized by sections
  - Required fields grouped by section with Fieldset components
  - Optional fields grouped by section within collapsible Panel
  - Sections automatically ordered according to `SECTION_ORDER` configuration
  - Dividers automatically inserted between sections

### Changed - Address Component Improvements
- **API Call Optimization** - Updated `CPTAddressBlock` to require minimum 4 characters before making Geoapify API calls
  - Changed from 3 to 4 character minimum to reduce API usage and stay within free tier limits
  - Debounced API calls remain at 300ms delay
- **Fixed API Parameter Error** - Removed invalid `type: 'address'` parameter from Geoapify API call
  - The `type` parameter only accepts: country, state, city, postcode, street, amenity, locality
  - Removed the parameter to allow API to return all relevant address results
  - Fixed 400 Bad Request error that was preventing address autocomplete from working
- **Enhanced Error Handling** - Improved error logging for API failures
  - Now logs detailed error information including status code, status text, and response data
  - Better debugging information in browser console
- **Smart API Response Caching** - Implemented intelligent caching to prevent redundant API calls
  - Caches API responses for 5 minutes to avoid repeated calls for the same query
  - Handles substring matching: if user types "Irvine" then deletes to "Irvin", uses cached "Irvine" results
  - Handles forward typing: if user types "Irvin" and we have cached "Irvine", filters cached results
  - Automatically cleans up expired cache entries when cache size exceeds 50 entries
  - Caches both successful results and empty results (to avoid repeated calls for invalid queries)
  - Significantly reduces API usage and improves response time for previously searched addresses
- **Enhanced ZIP Code Input** - Improved ZIP code mask to support extended format
  - Changed from `99999` to `99999? -9999` mask pattern
  - Supports both 5-digit (12345) and extended 9-digit (12345-6789) ZIP codes
  - Updated placeholder to show both formats: "12345 or 12345-6789"
- **InputGroup Structure** - All address fields properly use PrimeReact InputGroup components
  - Street address with home icon
  - City with building icon
  - State with map icon
  - ZIP code with inbox icon and proper InputMask

### Added - Field Ordering and Address Component
- **Field Ordering System** - Added `order` property to `FieldConfig` type for consistent field display order
  - Identity verification fields now display in fixed order: Name (1), Email Address (2), CPT ID (3), Phone (4), Mailing Address (5)
  - Updated `fieldConsolidation.ts` to sort fields by order property before displaying
  - Fields without order property fall back to alphabetical sorting by label
- **CPTAddressBlock Component** - New reusable address input component with Geoapify autocomplete integration
  - Created `src/components/inputs/CPTAddressBlock.tsx` with full address autocomplete functionality
  - Uses PrimeReact InputGroup, InputMask, and AutoComplete components
  - Features:
    - Real-time address autocomplete via Geoapify API
    - Manual address entry mode with structured fields (Street, City, State, ZIP)
    - Toggle between autocomplete and manual entry modes
    - Debounced API calls (300ms) to reduce API usage
    - Proper error handling and validation
    - Accessible with ARIA labels and error messages
  - Integrated into Step 3 (Request Data) for all address fields (mailingAddress, previousAddress, newAddress, beneficiaryAddress, address)
- **Environment Variable Support** - Added Geoapify API key configuration
  - Requires `NEXT_PUBLIC_GEOAPIFY_API_KEY` environment variable
  - API key must be added to `.env.local` for local development
  - API key must be added to Netlify environment variables for production deployment
- **Dependencies** - Added `axios` package for API calls to Geoapify service

### Changed - Address Field Type
- **Field Type Updates** - Changed address-related fields from `textarea` to `address` type
  - Updated fields: `mailingAddress`, `previousAddress`, `newAddress`, `beneficiaryAddress`, `address`
  - All address fields now use the new `CPTAddressBlock` component instead of textarea
  - Maintains backward compatibility with existing form data structure

## [1.0.3] - 2025-01-27

### Changed - Documentation Updates
- **README.md** - Comprehensive update with project overview, features, tech stack, project structure, and deployment information
- Removed outdated `docs/CPT-THEME-DIAGNOSTIC.md` (no longer using CPT package themes, using local themes instead)

### Changed - Custom American Flag Theme Colors
- **Light Theme (soho-light)** - Updated to elegant red, white, and blue palette:
  - Primary color changed from purple (`#7254f3`) to soft pastel blue (`#5B8FC7`)
  - Background: White with light blue-gray tints
  - Text: Navy blue (`#1a3a5c`) for better readability
  - Accents: Pastel red (`#E85D75`) for highlights and interactive elements
  - Focus rings: Soft blue (`#8BB3E8`) for accessibility
  - Highlight backgrounds: Light blue (`#E3EEF8`)
  - Updated all hardcoded color values throughout theme CSS (300+ instances)
- **Dark Theme (soho-dark)** - Updated to dark navy with red accents:
  - Background: Dark navy (`#1a2332`) replacing previous dark gray
  - Primary color changed from purple (`#b19df7`) to red accent (`#E85D75`)
  - Text: White/light for high contrast
  - Surfaces: Dark navy variations for depth
  - Focus rings: Red-tinted (`#ff8fa3`) for visibility
  - Highlight backgrounds: Red-tinted with transparency (`rgba(232, 93, 117, ...)`)
  - Updated all hardcoded color values throughout theme CSS (200+ instances)
- All color scales (red, blue, primary) updated to match new palette
- Maintained all existing styling, sizing, spacing, and layout - only colors changed
- Theme toggle functionality works seamlessly between light and dark themes

### Added - SEO and Metadata Enhancements
- Comprehensive metadata configuration in root layout:
  - `metadataBase` set for proper OG image resolution
  - Title with template support
  - Description and keywords for SEO
  - Open Graph tags for social sharing
  - Twitter Card metadata
  - Robots configuration for search engines
  - Icons configuration (favicon, apple-icon, general icon)
- Page-specific metadata layouts:
  - FAQ page metadata (`src/app/faq/layout.tsx`)
  - Support request page metadata (`src/app/support-request/layout.tsx`)
  - Success page metadata with noindex (`src/app/support-request/success/layout.tsx`)
- Image files for metadata (Next.js file-based conventions):
  - `src/app/opengraph-image.png` - Main OG image
  - `src/app/twitter-image.png` - Twitter card image
  - `src/app/icon.png` - General icon
  - `src/app/apple-icon.png` - Apple touch icon
  - Route-specific OG images for FAQ and support-request pages
- Environment variable support: `NEXT_PUBLIC_SITE_URL` for production metadata base URL

### Added - Theme Toggle Component
- Created `ThemeToggle` component (`src/components/common/ThemeToggle.tsx`)
- Sticky button in top-left corner with sun/moon icons
- Smooth theme switching between light and dark modes
- Theme preference persisted in localStorage
- Integrated into root layout for global access

### Added - Theme Provider
- Created `ThemeProvider` context (`src/providers/ThemeProvider.tsx`)
- Dynamic theme loading via `<link>` element swapping
- Themes loaded from `/public/themes/` directory
- Supports soho-light and soho-dark themes
- Theme state management with React context

## [Unreleased]

### Added - Support Form Requirements & Documentation
- Converted XLSX support form data to CSV format
- Created comprehensive support form requirements document
- Organized support form fields CSV with 17 request types
- Documented 4-step form flow (Select Case → Request Selection → Data Collection → Confirmation)
- Documented FAQ integration with popup references
- Documented field de-duplication requirements for multi-select requests
- Documented optional additional documentation section
- Created reusable `SupportFileUpload` component in `src/components/common/`
- SupportFileUpload features: drag & drop, file preview, progress bar, size limits, multiple files
- Added support form routes CSV documenting New Request and Update Request flows
- Cleaned up unnecessary CSV files (UserValidation, KBArticles, Layout sheets)

### Added - FAQ Page
- Created `/faq` route and page component
- Created `FAQAccordion` component using PrimeReact Accordion
- Created `FAQ_DATA` constant in `src/constants/faqData.ts` with 17 templated FAQ items
- FAQ items extracted and generalized from multiple old MVC sites
- FAQ content includes generic questions like opt-out, objections, legal representation, etc.
- Uses PrimeReact Accordion directly (CPT wrapper has known issue with nested components - documented in CPT library)
- Component structure: `src/components/pages/FAQ/FAQAccordion.tsx`
- All FAQ content templated with placeholders for easy customization per case

### Removed - Component Showcase Cleanup
- Removed `/component-showcase` route and page
- Removed all ComponentShowcase section components (11 files):
  - ButtonsSection, ChartSection, DataSection, FileSection
  - FormInputsSection, MediaSection, MenuSection, MessagesSection
  - MiscellaneousSection, OverlaysSection, PanelSection
- Removed showcase dummy data files:
  - `src/constants/dummyData.ts` (492+ lines of showcase data)
  - `src/constants/formDummyData.ts` (136+ lines of form demo data)
  - `src/constants/QUESTION_ONE.ts` (unused constant)
- Cleaned up component exports in `src/components/pages/index.ts`
- Cleaned up constants exports in `src/constants/index.ts`
- Component showcase code moved to separate repository: `cpt-component-demo`

### Changed - Migrated to CPT Prime React Library
- **Removed all local CPT component wrappers** - Deleted `src/components/input/` directory (20 component files)
  - All components now imported from `@cpt-group/cpt-prime-react` library
  - Components removed: CPTButton, CPTCard, CPTCalendar, CPTDropdown, CPTFileUpload, CPTInputText, CPTInputTextarea, CPTMessage, CPTMultiSelect, CPTSteps, CPTProgressSpinner, and more
- **Updated all component imports** - Replaced `@/components/input` with `@cpt-group/cpt-prime-react` in:
  - `StepCaseSelection.tsx`
  - `StepPersonalInfo.tsx`
  - `StepIssueDetails.tsx`
  - `StepDescriptionUpload.tsx`
  - `SupportRequestStepper.tsx`
  - `HomeHero.tsx`
  - `support-request/success/page.tsx`
- **Fixed FileUpload ref issue** - Removed ref usage and replaced with helper function for file size formatting
- **Updated component exports** - Removed `input` export from `src/components/index.ts`
- **Restored dependencies** - Kept `chart.js`, `lodash-es`, and `quill` for future use with library components

### Changed - Codebase Cleanup
- Updated build process to verify no broken imports after cleanup
- Verified production routes: `/`, `/support-request`, `/support-request/success`
- All production features remain intact and functional

### Removed - Styles Cleanup
- **Removed AnimatedBackground component** - Deleted `src/components/common/AnimatedBackground.tsx`
- **Removed AnimatedBackground usage** - Removed from home page and support request page
- **Cleaned up globals.css** - Removed all custom animations and keyframes:
  - Removed `gradient-shift`, `gradient-shift-reverse`, `float-slow`, `float-medium`, `pulse-slow` keyframes
  - Removed all `@layer utilities` animation classes
  - Now only contains `@import "tailwindcss"` for basic layout utilities
- **Background now controlled by PrimeReact theme** - All background styling comes from `soho-dark` theme
- **Barebones styling approach** - Only PrimeReact theming and basic layout utilities (centering, spacing) remain

### Added
- Enhanced FormInputsSection with multiple examples per component:
  - Added multiple examples for CPTDropdown (Basic, With Filter, Countries)
  - Added multiple examples for CPTMultiSelect (Basic, With Filter, Chip Display)
  - Added multiple examples for CPTAutoComplete (Fruits, Countries, With Dropdown)
  - Added multiple examples for CPTSelectButton (Single, Multiple, Payment Methods)
  - Added multiple examples for CPTListbox (Basic, With Filter, Multiple Selection)
  - Added multiple examples for CPTInputNumber (With Buttons, Currency, Decimal)
  - Added multiple examples for CPTInputMask (Phone, Date, Credit Card)
  - Added multiple examples for CPTCalendar (Date, Inline, Month/Year View, Time)
  - Added multiple examples for CPTPassword (Basic, With Feedback, With Header/Footer)
  - Added multiple examples for CPTSlider (Basic, Range, With Step, Vertical)
  - Added multiple examples for CPTRating (Basic, Cancel, Readonly)
  - Added multiple examples for CPTInputText (Basic, Disabled, Invalid)
  - Added multiple examples for CPTInputTextarea (Auto Resize, Fixed Size)
  - Added multiple examples for CPTColorPicker (Basic, Inline, Format)
  - Added multiple examples for CPTInputSwitch (Basic, Disabled)
  - Added multiple examples for CPTChips (Basic, Separator)
  - Added multiple examples for CPTToggleButton (Basic, With Icon)
- Created comprehensive dummy data file (`src/constants/formDummyData.ts`) with:
  - Extended dropdown options (cities, countries, products)
  - Multi-select options (basic items, technology tags)
  - AutoComplete suggestions (fruits, countries)
  - SelectButton options (basic, payment methods)
  - Listbox options (cities)
- **Data Section Component** - Created comprehensive DataSection component for component showcase page
  - Includes DataTable with multiple variants: Basic, Pagination, Sortable, Templates, Striped Rows, Grid Lines, Selection
  - Includes DataView with List and Grid layouts
  - Includes TreeTable for hierarchical data display
  - Includes Timeline component for event tracking
  - Includes OrganizationChart for organizational structure visualization
  - Includes VirtualScroller for efficient large dataset rendering
  - Created dummy data constants file with Product, Customer, TreeNode, TimelineEvent, and OrgChartNode types
  - All components use CPT wrappers from @cpt-group/cpt-prime-react package
  - Follows PrimeReact documentation examples and patterns
  - Organized in CPTCard components for clear presentation
  - Note: Some components (DataScroller, OrderList, PickList, Tree, Paginator) are commented out until available in package

- **Buttons Section Component** - Created comprehensive ButtonsSection component for component showcase page
  - Includes all Button variants: Basic, Link, Icons, Loading, Severity, Disabled, Raised, Rounded, Text, Outlined, Icon Only, Badges, Sizes
  - Includes ButtonGroup component showcase
  - Includes SplitButton with all severity variants
  - Includes SpeedDial with all types: Linear, Circle, Semi Circle, Quarter Circle
  - Includes SpeedDial with Tooltip and Mask options
  - Follows PrimeReact documentation examples and patterns
  - Uses CPT components from @cpt-group/cpt-prime-react package
  - Organized in CPTCard components for clear presentation

### Fixed
- **Component Showcase Page** - Fixed PrimeReact component usage issues:
  - Wrapped CPTPassword component in a `<form>` element to resolve browser warning about password fields not being contained in a form
  - Fixed TriStateCheckbox to properly handle `boolean | null` type instead of using number workaround, allowing proper indeterminate state support
  - Fixed CPTTreeSelect to use `undefined` instead of empty string for unselected value
  - All controlled inputs now properly initialized to prevent controlled/uncontrolled component warnings

### Added
- **Animated Background Component** - Created dynamic animated background inspired by PrimeFlex
  - Animated gradient backgrounds with shifting colors (blue, indigo, purple, pink, rose)
  - Floating animated elements with fade, scale, and pulse animations
  - Dark mode support with appropriate color adjustments
  - Smooth CSS animations using Tailwind utilities and custom keyframes
  - Integrated on home page and support request page
  - Uses Tailwind CSS classes with custom animations in `@layer utilities`
  - Expert consultation: CSS Expert and Tailwind Expert reviewed implementation

## [Unreleased] - 2025-01-27

### Changed - Case List Structure and Data Migration
- Moved `CASE_LIST` from `supportRequest.ts` to dedicated `CASELIST.ts` file for better organization
- Updated `CaseOption` type structure:
  - Changed from: `firstName`, `lastName`, `email`
  - Changed to: `name`, `projectName`, `caseID`
- Populated `CASE_LIST` with 1,392 real cases from SQL database CSV export
- Implemented fast lookup Maps for O(1) access:
  - `CASE_LIST_BY_ID` - Lookup by ID
  - `CASE_LIST_BY_CASE_ID` - Lookup by caseID
  - `CASE_LIST_BY_PROJECT_NAME` - Lookup by projectName
- Added CSV parsing to extract case data:
  - Uses `caseName` column for `name` field
  - Uses `SQLName` column for `projectName` field (removes `_SQL` suffix)
  - Automatically generates display `label` from name and projectName
- Optimized `useSupportRequestForm` hook:
  - Inlined validation logic in `goToNextStep` to fix useCallback dependency issues
  - Removed unnecessary function dependencies from useCallback

### Added - Support Ticket Stepper Form MVP
- Created CPTSteps, CPTCalendar, CPTCard, CPTMessage component wrappers
- Created support request type definitions (SupportRequestFormData, CaseOption, IssueTypeOption, etc.)
- Created useSupportRequestForm hook for state management and validation
- Created 4 step components:
  - StepCaseSelection - Case dropdown selection
  - StepPersonalInfo - First name, last name, email inputs
  - StepIssueDetails - Issue types multi-select, confirmation email, date picker
  - StepDescriptionUpload - Description textarea and file upload
- Created SupportRequestStepper container component using PrimeReact Steps
- Created success/confirmation page with personalized thank you message
- Integrated stepper into support-request page
- Added CSS transitions for step content fade animations
- Form validation prevents progression without required fields
- Mobile-responsive design using PrimeFlex utility classes

### Added - Home Page UI
- Created `HomeHero` component with welcome message and Begin button
- Implemented navigation to support request form using Next.js App Router
- Added `/support-request` route placeholder for stepper component
- Used PrimeReact CPTButton with loading state and transitions

### Added
- Installed PrimeReact dependencies (`primereact@^10.9.7`, `primeicons@^7.0.0`, `primeflex@^4.0.0`)
- Created complete folder structure matching reference codebase:
  - `src/components/input/` - PrimeReact component wrappers
  - `src/components/common/` - Shared/common components
  - `src/components/layout/` - Layout components
  - `src/components/pages/` - Page-specific components
  - `src/providers/` - React context providers
  - `src/hooks/` - Custom React hooks
  - `src/types/` - TypeScript type definitions
  - `src/util/` - Utility functions
  - `src/constants/` - App constants
- Created PrimeReact provider setup:
  - `PrimeReactProvider.tsx` - PrimeReact provider with soho-dark theme
  - `Providers.tsx` - Main providers wrapper
  - Configured CSS imports for PrimeReact theme, core styles, icons, and PrimeFlex
- Created all 13 CPT component wrappers:
  - `CPTButton` - Button component
  - `CPTCheckbox`ութ - Checkbox input
  - `CPTDialog` - Modal dialogs
  - `CPTDropdown` - Select dropdown
  - `CPTFileUpload` - File upload component
  - `CPTInputNumber` - Number input
  - `CPTInputText` - Text input
  - `CPTInputTextarea` - Multi-line text input
  - `CPTMultiSelect` - Multi-select dropdown
  - `CPTProgressSpinner` - Loading spinner
  - `CPTRadioButton` - Radio button
  - `CPTToast` - Toast notifications (with forwardRef)
  - `CPTToggleButton` - Toggle switch
- Set up barrel exports (`index.ts`) for all component folders
- Updated root layout to use Providers wrapper
- Created foundation design plan document (`FOUNDATION-DESIGN-PLAN.md`)

### Changed
- Updated `src/app/layout.tsx` to integrate PrimeReact Providers
- Removed Geist font imports (using PrimeReact theming instead)

### Technical Details
- All components follow functional component pattern with TypeScript
- All CPT components properly extend PrimeReact props
- All client components marked with `'use client'` directive
- CPTToast uses forwardRef pattern for ref forwarding
- PrimeReact soho-dark theme configured for mobile-friendly dark UI
- Clean separation of concerns following reference codebase patterns
- All barrel exports properly configured with empty exports for TypeScript module validation
- Build verified successful with Next.js production build

### Code Review
- Expert code review completed (see `CODE-REVIEW.md`)
- All components pass React Expert review
- Architecture matches reference codebase structure
- TypeScript strict mode validation passed
- No linting errors
- Build compilation successful

