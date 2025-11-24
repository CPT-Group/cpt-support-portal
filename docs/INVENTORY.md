# CPT Support Portal - Complete Inventory & Structure Analysis

**Generated:** 2025-01-27  
**Purpose:** Transition from showcase/demo app to production support portal

---

## 📊 Executive Summary

This application was originally built as a **component showcase/demo** but is now transitioning to its **real purpose as a support ticket submission portal**. This inventory identifies:

- ✅ **Core Production Features** (KEEP)
- 🗑️ **Showcase/Demo Code** (REMOVE)
- ⚠️ **Unused/Dead Code** (CLEAN UP)
- 📦 **Dependencies** (REVIEW)

---

## 🎯 Core Production Features (KEEP)

### Pages & Routes
- ✅ `/` - Home page with welcome message and navigation
- ✅ `/support-request` - Main support ticket form (4-step stepper)
- ✅ `/support-request/success` - Success confirmation page

### Core Components
- ✅ `src/components/pages/Home/HomeHero.tsx` - Home page hero section
- ✅ `src/components/pages/SupportRequest/` - All support form step components
  - `StepCaseSelection.tsx` - Case dropdown selection
  - `StepPersonalInfo.tsx` - Name and email inputs
  - `StepIssueDetails.tsx` - Issue types, confirmation email, date picker
  - `StepDescriptionUpload.tsx` - Description textarea and file upload
  - `SupportRequestStepper.tsx` - Main stepper container

### Core Hooks
- ✅ `src/hooks/useSupportRequestForm.ts` - Form state management and validation

### Core Types
- ✅ `src/types/supportRequest.ts` - All TypeScript definitions for support form

### Core Constants
- ✅ `src/constants/CASELIST.ts` - 1,392 real cases (production data)
- ✅ `src/constants/supportRequest.ts` - Issue type options and confirmation email options

### Core UI Components (CPT Wrappers)
- ✅ `src/components/input/` - All CPT component wrappers (used in production)
  - CPTButton, CPTCard, CPTCalendar, CPTDropdown, CPTFileUpload
  - CPTInputText, CPTInputTextarea, CPTMessage, CPTMultiSelect
  - CPTSteps, CPTProgressSpinner, etc.

### Common Components
- ✅ `src/components/common/AnimatedBackground.tsx` - Used on home and support pages

### Providers
- ✅ `src/providers/PrimeReactProvider.tsx` - PrimeReact theme setup
- ✅ `src/providers/Providers.tsx` - Provider wrapper

---

## 🗑️ Showcase/Demo Code (REMOVE)

### Pages & Routes
- ❌ `/component-showcase` - Entire showcase page
  - `src/app/component-showcase/page.tsx`

### Showcase Components (11 sections)
- ❌ `src/components/pages/ComponentShowcase/` - Entire directory
  - `ButtonsSection.tsx` - Button variants showcase
  - `ChartSection.tsx` - Chart components showcase
  - `DataSection.tsx` - DataTable, DataView, TreeTable showcase
  - `FileSection.tsx` - File upload showcase
  - `FormInputsSection.tsx` - Form inputs showcase
  - `MediaSection.tsx` - Media components showcase
  - `MenuSection.tsx` - Menu components showcase
  - `MessagesSection.tsx` - Message components showcase
  - `MiscellaneousSection.tsx` - Misc components showcase
  - `OverlaysSection.tsx` - Dialog/overlay showcase
  - `PanelSection.tsx` - Panel components showcase

### Showcase Dummy Data
- ❌ `src/constants/dummyData.ts` - Products, Customers, TreeNodes, TimelineEvents, OrgChartNodes (492+ lines)
- ❌ `src/constants/formDummyData.ts` - Dropdown options, countries, products for showcase (136+ lines)
- ❌ `src/constants/case-csv.csv` - Original CSV file (if not needed)

### Unused Constants
- ❌ `src/constants/QUESTION_ONE.ts` - Appears unused (3 lines, similar to ISSUE_TYPE_OPTIONS)

---

## ⚠️ Unused/Dead Code (CLEAN UP)

### Empty/Placeholder Files
- ⚠️ `src/components/layout/index.ts` - Empty export (no layout components)
- ⚠️ `src/util/index.ts` - Empty export (no utility functions)
- ⚠️ `src/constants/index.ts` - Exports `dummyData` which should be removed

### Unused CPT Component Wrappers
Check if these are actually used in production:
- ⚠️ `CPTCheckbox` - Verify usage
- ⚠️ `CPTDialog` - Verify usage
- ⚠️ `CPTInputNumber` - Verify usage
- ⚠️ `CPTRadioButton` - Verify usage
- ⚠️ `CPTTag` - Verify usage
- ⚠️ `CPTTooltip` - Verify usage
- ⚠️ `CPTToggleButton` - Verify usage
- ⚠️ `CPTProgressBar` - Verify usage

### Documentation Files
- ⚠️ `docs/` - Review if these are still needed:
  - `CODE-REVIEW-SUPPORT-TICKET-FORM.md`
  - `CODE-REVIEW.md`
  - `COMPREHENSIVE-CODE-REVIEW.md`
  - `EXPERT-CODE-REVIEW-CASE-LIST.md`
  - `EXPERT-REVIEW-ANIMATED-BACKGROUND.md`
  - `FOUNDATION-DESIGN-PLAN.md` - May want to keep as architecture reference

---

## 📦 Dependencies Analysis

### Production Dependencies (KEEP)
- ✅ `next: 16.0.1` - Framework
- ✅ `react: 19.2.0` - Core library
- ✅ `react-dom: 19.2.0` - React DOM
- ✅ `primereact: ^10.9.7` - UI library
- ✅ `primeicons: ^7.0.0` - Icons
- ✅ `primeflex: ^4.0.0` - Utility classes
- ✅ `@cpt-group/cpt-prime-react: ^1.0.0` - CPT component package
- ✅ `react-hook-form: ^7.66.1` - Form management (if used)

### Showcase-Only Dependencies (REVIEW)
- ⚠️ `chart.js: ^4.5.1` - Used in ChartSection showcase
- ⚠️ `quill: ^2.0.3` - Rich text editor (verify if used in production)
- ⚠️ `lodash-es: ^4.17.21` - Utility library (verify usage)

### Dev Dependencies (KEEP)
- ✅ All TypeScript, ESLint, Tailwind configs

---

## 📁 Current File Structure

```
src/
├── app/
│   ├── component-showcase/     ❌ REMOVE
│   │   └── page.tsx
│   ├── support-request/         ✅ KEEP
│   │   ├── page.tsx
│   │   └── success/
│   │       └── page.tsx
│   ├── page.tsx                ✅ KEEP (home)
│   ├── layout.tsx              ✅ KEEP
│   └── globals.css             ✅ KEEP
│
├── components/
│   ├── input/                  ✅ KEEP (CPT wrappers)
│   ├── common/                 ✅ KEEP (AnimatedBackground)
│   ├── layout/                 ⚠️ EMPTY - Clean up
│   └── pages/
│       ├── Home/               ✅ KEEP
│       ├── SupportRequest/     ✅ KEEP
│       └── ComponentShowcase/  ❌ REMOVE (11 files)
│
├── constants/
│   ├── CASELIST.ts             ✅ KEEP (production data)
│   ├── supportRequest.ts       ✅ KEEP
│   ├── dummyData.ts            ❌ REMOVE (showcase)
│   ├── formDummyData.ts        ❌ REMOVE (showcase)
│   ├── QUESTION_ONE.ts         ❌ REMOVE (unused)
│   └── case-csv.csv            ⚠️ REVIEW (source file?)
│
├── hooks/
│   └── useSupportRequestForm.ts ✅ KEEP
│
├── providers/                  ✅ KEEP
├── types/                      ✅ KEEP
└── util/                       ⚠️ EMPTY - Clean up
```

---

## 🔍 Component Import Analysis

### Production Code Uses:
- ✅ Local wrappers: `@/components/input` (CPTButton, CPTCard, CPTDropdown, etc.)

### Showcase Code Uses:
- ❌ Package directly: `@cpt-group/cpt-prime-react` (in all showcase sections)

**Note:** Production code correctly uses local wrappers. Showcase code bypasses wrappers and uses package directly.

---

## 🎨 Styling & Assets

### CSS
- ✅ `src/app/globals.css` - Tailwind + custom animations (used by AnimatedBackground)

### Public Assets
- ⚠️ Review `public/` folder:
  - `cpt-screensaver.png`
  - `NOVA_CORE.png`
  - `nova-bot.png`, `nova-bot2.png`
  - `nova-neon.png`, `nova-neon-2.png`
  - `opengraph-image.png`
  
  **Action:** Verify which images are actually used in production vs showcase.

---

## 📋 Cleanup Checklist

### Phase 1: Remove Showcase Code
- [ ] Delete `src/app/component-showcase/` directory
- [ ] Delete `src/components/pages/ComponentShowcase/` directory (11 files)
- [ ] Remove showcase exports from `src/components/pages/index.ts`
- [ ] Delete `src/constants/dummyData.ts`
- [ ] Delete `src/constants/formDummyData.ts`
- [ ] Delete `src/constants/QUESTION_ONE.ts`
- [ ] Remove dummyData export from `src/constants/index.ts`

### Phase 2: Clean Up Unused Code
- [ ] Review and remove unused CPT component wrappers (if not used)
- [ ] Remove empty `src/components/layout/index.ts` or add actual layout components
- [ ] Remove empty `src/util/index.ts` or add utility functions
- [ ] Review and clean up `public/` assets (remove unused images)

### Phase 3: Dependency Cleanup
- [ ] Remove `chart.js` if not used in production
- [ ] Remove `quill` if not used in production
- [ ] Remove `lodash-es` if not used in production
- [ ] Run `npm install` to update lock file

### Phase 4: Documentation
- [ ] Archive or remove old code review docs (move to archive/ or delete)
- [ ] Keep `FOUNDATION-DESIGN-PLAN.md` as architecture reference (optional)
- [ ] Update `README.md` to reflect production purpose
- [ ] Update `CHANGELOG.md` with cleanup entries

### Phase 5: Verification
- [ ] Verify all production routes work (`/`, `/support-request`, `/support-request/success`)
- [ ] Test form submission flow
- [ ] Verify no broken imports
- [ ] Run build to ensure no errors
- [ ] Run linter

---

## 🎯 Recommended Structure After Cleanup

```
src/
├── app/
│   ├── support-request/         ✅ Main feature
│   │   ├── page.tsx
│   │   └── success/
│   │       └── page.tsx
│   ├── page.tsx                ✅ Home
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── input/                   ✅ CPT wrappers (only used ones)
│   ├── common/                  ✅ Shared components
│   └── pages/
│       ├── Home/
│       └── SupportRequest/
│
├── constants/
│   ├── CASELIST.ts             ✅ Production data
│   └── supportRequest.ts       ✅ Form options
│
├── hooks/
│   └── useSupportRequestForm.ts
│
├── providers/
├── types/
└── util/                        ⚠️ Add utilities or remove
```

---

## 📝 Notes

1. **Component Wrappers**: Keep all CPT wrappers even if not currently used - they may be needed for future features
2. **AnimatedBackground**: Currently used on both home and support pages - consider if this should be configurable
3. **Success Page**: Currently shows JSON submission data for debugging - may want to remove in production
4. **Case List**: 1,392 cases loaded at build time - consider if this should be fetched from API instead
5. **Form Validation**: Currently client-side only - may need server-side validation for production

---

**Status:** Ready for cleanup  
**Next Steps:** Begin Phase 1 - Remove showcase code

