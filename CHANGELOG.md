# Changelog

All notable changes to this project will be documented in this file.

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

