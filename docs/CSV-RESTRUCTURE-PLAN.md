# CSV Restructure Plan

## Overview
This document outlines the plan to restructure FAQ and Support Request CSV files to be more human-readable and maintainable for the team.

## Goals
1. Make CSVs human-readable and straightforward
2. Enable non-technical team members to update content easily
3. Support future features (FAQ dialog links, field breakdown analysis)
4. Maintain data integrity and consistency

---

## 1. FAQ CSV Structure

### File: `docs/faq/FAQ-CONTENT.csv`

**New Structure:**
- **Column 0: Sort Order** - Numeric order (1, 2, 3, etc.) - determines display order
- **Column 1: Title** - FAQ question title/heading
- **Column 2: Description** - Full FAQ answer/description text

**Initial State:**
- 3 empty rows for team to fill in
- Header row with column names

**Purpose:**
- Team can easily add/update FAQ content
- Sort order allows reordering without code changes
- Simple structure for content management

---

## 2. Support Request Types CSV

### File: `docs/support-form/SUPPORT-REQUEST-TYPES.csv` (NEW)

**Structure:**
- **Column 0: ID** - Unique identifier (1, 2, 3, etc.)
- **Column 1: Sort Order** - Display order (1, 2, 3, etc.)
- **Column 2: Label** - Display name for the request type
- **Column 3: Required Fields** - Comma-separated list of required field IDs (e.g., "name,cptId,email,phone")
- **Column 4: Optional Fields** - Comma-separated list of optional field IDs (e.g., "supportingDocs")
- **Column 5: FAQ ID Link** - Reference to FAQ item ID (for future dialog feature)
- **Column 6: Additional Notes** - Any additional context or notes

**Field ID Reference:**
- name, email, cptId, phone, mailingAddress
- previousAddress, newAddress, previousName, newName
- reason, address, detailedResponse, ssnTaxId
- beneficiaryName, beneficiaryAddress, beneficiaryEmail
- supportingDocs, additionalDescription

**Purpose:**
- Clear visibility of what fields each request type needs
- Easy to add new request types or modify existing ones
- FAQ links prepared for future dialog feature
- Notes column for team context

**Old Files to Delete:**
- `docs/support-form/SUPPORT-FORM-FIELDS_SupportRequest.csv`
- `docs/support-form/SUPPORT-FORM-FIELDS.csv` (if not needed)

---

## 3. Field Breakdown CSV (Optional)

### File: `docs/support-form/SUPPORT-REQUEST-FIELDBREAKDOWN.csv` (NEW)

**Structure:**
- **Column 0: Request Type ID** - Matches ID from SUPPORT-REQUEST-TYPES.csv
- **Column 1: Request Type Label** - Human-readable name
- **Columns 2-N: Field Columns** - One column per field type
  - name, email, cptId, phone, mailingAddress
  - previousAddress, newAddress, previousName, newName
  - reason, address, detailedResponse, ssnTaxId
  - beneficiaryName, beneficiaryAddress, beneficiaryEmail
  - supportingDocs, additionalDescription
- **Values:** TRUE/FALSE (or YES/NO) indicating if field is used

**Purpose:**
- Quick visual reference of which fields each request type uses
- Easy to spot patterns and inconsistencies
- Useful for analysis and form optimization
- Matrix-style view for comprehensive understanding

**Example:**
```
Request Type ID,Request Type Label,name,email,cptId,phone,mailingAddress,previousAddress,newAddress,...
1,Address Update,TRUE,FALSE,TRUE,TRUE,FALSE,TRUE,TRUE,...
2,Name Change,TRUE,FALSE,TRUE,TRUE,FALSE,FALSE,FALSE,...
```

---

## 4. Implementation Steps

### Step 1: Update FAQ CSV
- [x] Create new structure with Sort Order, Title, Description
- [x] Add 3 empty rows for team to fill
- [x] Keep existing FAQ data if any (migrate if needed)

### Step 2: Create Support Request Types CSV
- [x] Extract all request types from `src/constants/requestTypes.ts`
- [x] Map required and optional fields
- [x] Add FAQ ID links where applicable (from faqReference field)
- [x] Include all notes and context
- [x] Ensure human-readable format

### Step 3: Create Field Breakdown CSV
- [x] List all unique field IDs from `src/constants/formFields.ts`
- [x] Create matrix with one row per request type
- [x] Mark TRUE/FALSE for each field usage
- [x] Include request type ID and label for reference

### Step 4: Cleanup
- [x] Delete old CSV files that are no longer needed
- [x] Verify new CSVs match current code implementation
- [x] Test CSV structure is readable and maintainable

### Step 5: Documentation
- [x] Update any references to old CSV files
- [x] Document field ID mappings
- [x] Create guide for team on how to update CSVs

---

## 5. Field ID Reference

### Identity Fields
- `name` - Full Name
- `email` - Email Address
- `cptId` - CPT ID
- `phone` - Phone Number
- `mailingAddress` - Mailing Address

### Request-Specific Fields
- `previousAddress` - Previous Address
- `newAddress` - New Address
- `previousName` - Previous Name
- `newName` - New Name
- `reason` - Reason (textarea)
- `address` - Address
- `detailedResponse` - Detailed Response (textarea)
- `ssnTaxId` - SSN/Tax ID

### Beneficiary Fields
- `beneficiaryName` - Beneficiary Name
- `beneficiaryAddress` - Beneficiary Address
- `beneficiaryEmail` - Beneficiary Email

### Optional Fields
- `supportingDocs` - Supporting Documents (file upload)
- `additionalDescription` - Additional Description (textarea)

---

## 6. Testing Checklist

- [ ] FAQ CSV opens correctly in Excel/Google Sheets
- [ ] Support Request Types CSV is human-readable
- [ ] Field Breakdown CSV matrix is clear and accurate
- [ ] All request types from code are represented
- [ ] All field IDs match code implementation
- [ ] FAQ ID links are properly referenced
- [ ] Old CSV files are removed
- [ ] Team can easily understand and update CSVs

---

## 7. Future Enhancements

### FAQ Dialog Feature
- When a request type has an FAQ ID Link, display FAQ in dialog before form
- Link FAQ IDs between SUPPORT-REQUEST-TYPES.csv and FAQ-CONTENT.csv
- Implement dialog component to show FAQ content

### CSV Import/Export
- Consider automated CSV to code generation
- Validation scripts to ensure CSV matches code
- Version control for CSV changes

---

## Notes
- All field IDs must match exactly with `src/constants/formFields.ts`
- Sort orders determine display sequence in UI
- FAQ ID links are placeholders for future feature
- Keep CSV format simple for non-technical users

