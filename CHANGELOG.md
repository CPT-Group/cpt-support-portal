# Changelog

All notable changes to this project will be documented in this file.

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

