# Support Form Requirements

**Created:** 2025-01-27  
**Last Updated:** 2025-01-27  
**Status:** Requirements Gathering Complete - Ready for Implementation

---

## Overview

The support form is designed to streamline the support request process by ensuring users provide all required information upfront. This helps the support team process requests faster by eliminating back-and-forth communication for missing information.

**Key Principle:** All verification is done manually by the support team after submission. The form's job is to collect complete, normalized data.

---

## Architecture Concept

### Home Page Structure
- Home page will have multiple buttons/options
- Each button can navigate to different routes or forms
- Components will be **reusable** - same functional components with different props
- React's prop-based approach allows one component to handle different behaviors

### Component Reusability Strategy
- Create functional components that accept props
- Props control behavior, content, and validation rules
- Same component can be used across different routes with different configurations
- Example: A form stepper component that accepts different step configurations via props

### Data Normalization
- **CRITICAL:** All fields must use consistent names across all routes
- Example: Email field should always be `email` (not `emailAddress`, `email_address`, etc.)
- JSON output must be normalized so the same field name is used regardless of route
- This ensures backend processing is consistent

---

## Form Flow (4 Steps)

### Step 1: Select Case
- Source: Master case list (existing `CASE_LIST` constant)
- User selects which case their request relates to
- Single selection dropdown

### Step 2: Support Request Selection
- **Multi-select** - User can select multiple request types
- Options come from `SUPPORT-FORM-FIELDS.csv` (17 request types)
- Some request types have FAQ references (see FAQ Integration section)

### Step 3: Support Request Data
- **Field De-duplication is CRITICAL**
- When multiple request types are selected, combine all required fields
- If multiple request types need "Name", "Email", etc., show each field only once
- Display all unique required fields + all unique optional fields
- Fields are collected for:
  1. Identity verification (Name, CPT ID, Email, Phone, etc.)
  2. All selected request type specific fields

### Step 4: Confirmation w/ SLA
- Elegant, professional confirmation page
- Message: "Your support request has been received. A CPT representative will get back to you as soon as possible."
- **Important Note (italicized):** "Please be advised, making more than one ticket for the same request will slow down response time for you and others."
- Research popular support sites for similar messaging patterns

---

## Support Request Types (17 Total)

See `SUPPORT-FORM-FIELDS.csv` for complete list with required/optional fields.

**Key Request Types:**
1. Address Update
2. Name Change
3. Notice Packet Request
4. Passcode Request (has FAQ reference)
5. Requests to Be Added
6. Check Reissue Request
7. Dispute Work Weeks/Shifts
8. Deceased Class Member
9. Deficiency Response
10. Tax Form Request
11. Copy of Cashed Check
12. Request Fraud Affidavit
13. SSN Response
14. What is my settlement amount (FAQ reference - may resolve without submission)
15. When will I receive my check (FAQ reference - may resolve without submission)
16. Did you receive my claim form/response (status inquiry)
17. Have you received my supporting documents (status inquiry)

---

## Routes

### Active Routes
- `/support-request` - New Request flow (4 steps as described above)

### Future Routes (Not Implemented)
- `/support-request/update` - Update Request flow
  - **Status:** Needs clarification from manager
  - **UI:** Add to interface but mark as "(Not Implemented)"
  - **Behavior:** When selected, do nothing/show message
  - **Documentation:** Add to CSV with notes column for manager discussion

---

## FAQ Integration

### FAQ Reference Popup
When a request type has an FAQ reference (see `SUPPORT-FORM-FIELDS.csv` column "FAQ_Reference"):

1. **Trigger:** Show a popup/dialog when user selects that request type
2. **Header:** "Did you know?"
3. **Content:** 
   - Display the FAQ question and answer
   - Use FAQ ID from the reference to look up in `FAQ_DATA` constant
4. **Footer:** 
   - "Read more" link that navigates to `/faq` page
5. **Purpose:** May resolve user's issue without requiring form submission

**Example:** Request Type 4 (Passcode Request) has FAQ reference "How to find on notice" - show relevant FAQ in popup.

---

## Optional Additional Documentation Section

**Location:** End of Step 3 (before confirmation)

**Purpose:** Allow users to add any additional documentation or context

**Components:**
- **Description:** Textarea for additional notes/context
- **Documents:** File upload component

**File Upload Requirements:**
- Use reusable `SupportFileUpload` component (`src/components/common/SupportFileUpload.tsx`)
- Component features:
  - Drag and drop
  - Multiple file selection
  - File preview (images)
  - File size display and limit (configurable, default: 1 MB)
  - Progress bar
  - Remove individual files
  - Clear all files
  - Customizable props (maxFileSize, accept, label, emptyMessage, etc.)
- Component is reusable across all routes/forms
- Based on PrimeReact FileUpload with custom template

**Label:** "Additional Documentation (Optional)"

**Note:** This section appears on ALL routes/request types as an optional addition.

---

## Field Requirements

### Identity Verification Fields (Common Across All Requests)
- Name
- CPT ID
- Email Address
- Phone
- Mailing Address (when required by selected request types)

### Request-Specific Fields
See `SUPPORT-FORM-FIELDS.csv` for complete field mapping per request type.

**Common Field Types:**
- Text inputs (Name, Address, etc.)
- Email inputs
- Phone inputs
- Textarea (Reason, Detailed Response, etc.)
- File upload (Supporting Docs - optional on most, required on some)

### Field De-duplication Logic
1. Collect all required fields from all selected request types
2. Collect all optional fields from all selected request types
3. Remove duplicates (same field name = same field)
4. Display unique required fields first, then unique optional fields
5. Ensure consistent field names across all routes for JSON normalization

---

## Validation Rules

### No Automated Verification
- **No validation against database** - we cannot verify users automatically
- **No SSN/identity verification** - all verification done manually by support team
- Form's purpose: Ensure all required information is collected upfront

### Required Field Validation
- All required fields must be filled before proceeding
- Standard HTML5 validation (email format, etc.)
- Custom validation messages for clarity

### File Upload Validation
- File size limits (e.g., 1 MB per file)
- File type restrictions (if needed)
- Multiple files allowed

---

## JSON Output Structure

### Normalization Requirements
- All fields use consistent naming across routes
- Example structure:
```json
{
  "caseId": "string",
  "requestTypes": ["Address Update", "Name Change"],
  "name": "string",
  "cptId": "string",
  "email": "string",
  "phone": "string",
  "mailingAddress": "string",
  "previousAddress": "string",
  "newAddress": "string",
  "previousName": "string",
  "newName": "string",
  "reason": "string",
  "additionalDocumentation": {
    "description": "string",
    "files": []
  }
}
```

**Key Point:** Field names must be consistent. If "Email Address" is used in one request type, use the same normalized name (`email`) in JSON output.

---

## UI/UX Requirements

### Form Stepper
- Use existing stepper pattern (similar to current support request form)
- 4 steps as outlined above
- Progress indication
- Navigation: Next/Previous buttons
- Validation prevents progression without required fields

### FAQ Popup/Dialog
- Use PrimeReact Dialog component
- Elegant, non-intrusive design
- Easy to dismiss
- Clear "Read more" link to FAQ page

### Confirmation Page
- Professional, clean design
- Clear success message
- Important note about duplicate tickets (italicized, subtle)
- Option to submit another request (if needed)

### File Upload Component
- Custom template with preview
- Drag and drop interface
- Progress indicators
- File size limits clearly displayed
- Remove/clear functionality

---

## Data Sources

### Constants Files
- `src/constants/CASELIST.ts` - Case selection dropdown
- `src/constants/faqData.ts` - FAQ items for popup references
- `docs/support-form/SUPPORT-FORM-FIELDS.csv` - Request types and field mappings

### CSV Files
- `SUPPORT-FORM-FIELDS.csv` - Main data source for request types
- `SUPPORT-FORM-ROUTES.csv` - Route definitions and status

---

## Implementation Notes

### Update Request Route
- **Status:** Not implemented - needs manager clarification
- **Action:** Add to UI with "(Not Implemented)" label
- **Behavior:** Show message or do nothing when selected
- **Documentation:** Track in CSV notes column for future discussion

### Field Mapping
- CSV has been reorganized for clarity
- Required fields and optional fields are clearly separated
- FAQ references are documented
- Notes column added for future clarifications

### Component Structure
- Reuse existing stepper pattern
- Create reusable field components
- Props-based configuration for different request types
- Maintain consistent field naming for JSON normalization

---

## Questions for Manager (Future)

1. **Update Request Flow:** What is the difference between New Request and Update Request? Same steps or different?
2. **Status Inquiries (Types 14-17):** Should these be handled differently (lookup/search) vs form submission?
3. **SLA Details:** What specific SLA information should be shown on confirmation page?
4. **File Upload Limits:** What are the actual file size and type restrictions?

---

## Next Steps

1. ✅ Convert XLSX to CSV - **Complete**
2. ✅ Reorganize CSV for clarity - **Complete**
3. ✅ Document requirements - **Complete**
4. ⏳ Create field mapping constants from CSV
5. ⏳ Implement FAQ popup component
6. ⏳ Implement field de-duplication logic
7. ⏳ Build new support request form with 4 steps
8. ⏳ Create optional additional documentation component
9. ⏳ Build confirmation page with SLA messaging
10. ⏳ Implement JSON normalization for submission
