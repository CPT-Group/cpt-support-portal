# Changelog

All notable changes to this project will be documented in this file.

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

