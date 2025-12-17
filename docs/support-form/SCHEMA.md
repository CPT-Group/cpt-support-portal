# Support Portal Schema

## Request Types Configuration

Each request type has the following structure:

```typescript
interface RequestTypeConfig {
  id: string;                    // Request type ID (e.g., '1', '2', '3')
  label: string;                 // Display label (e.g., 'Request Notice Packet')
  faqLink?: string;              // UUID to specific FAQ item (null/undefined = no FAQ)
  requiredFields: string[];       // Array of field IDs that are required
  optionalFields: string[];       // Array of field IDs that are optional
  notes?: string;                 // Internal notes
}
```

### Request Types (Ordered by Sort Order 1-17)

| Sort | ID | Label | Required Fields | Optional Fields | FAQ Link |
|------|----|-------|----------------|-----------------|----------|
| 1 | 3 | Request Notice Packet | firstName, lastName, email, phone, address | cptId | - |
| 2 | 4 | Request Passcode | firstName, lastName, email, phone | cptId | faq-007 |
| 3 | 1 | Update Mailing Address | firstName, lastName, email, phone, previousAddress, newAddress | cptId | - |
| 4 | 2 | Request Name Change | firstName, lastName, email, phone, address, previousName, newName, supportingDocumentation, additionalDescription | cptId | - |
| 5 | 8 | Deceased Class Member | firstName, lastName, email, phone, address, ssnTaxId, beneficiaryName, beneficiaryAddress, beneficiaryEmail, supportingDocumentation | cptId, additionalDescription | - |
| 6 | 5 | Request to Be Added to Case | firstName, lastName, email, phone, address, supportingDocumentation | additionalDescription | - |
| 7 | 7 | Respond to Dispute Notice | firstName, lastName, email, phone, address, supportingDocumentation | cptId | - |
| 8 | 9 | Respond to Deficient Notice | firstName, lastName, email, phone, address, additionalDescription, supportingDocumentation | cptId | - |
| 9 | 13 | Respond to SSN/W9 Request | firstName, lastName, email, phone, address, ssnTaxId | cptId, supportingDocumentation, additionalDescription | - |
| 10 | 6 | Request Check Reissue | firstName, lastName, email, phone, previousAddress, newAddress | cptId | - |
| 11 | 11 | Request Cashed Check Copy | firstName, lastName, email, phone, address | cptId | - |
| 12 | 10 | Request Tax Forms | firstName, lastName, email, phone, address, ssnTaxId | cptId | - |
| 13 | 12 | Request Fraud Affidavit Packet | firstName, lastName, email, phone, address | cptId | - |
| 14 | 14 | Did you Receive my Response? | firstName, lastName, email, phone, address | cptId | faq-007 |
| 15 | 15 | Have you Received my Supporting Documents? | firstName, lastName, email, phone, address | cptId | faq-007 |
| 16 | 16 | What is my Settlement Amount? | firstName, lastName, email, phone, address | cptId | faq-005 |
| 17 | 17 | When will I Receive my Settlement Payment? | firstName, lastName, email, phone, address | cptId | faq-006 |

## Field Configuration

Each field has the following structure:

```typescript
interface FieldConfig {
  id: string;                     // Field ID (e.g., 'firstName', 'email', 'address')
  label: string;                  // Display label (e.g., 'First Name', 'Email Address')
  type: FieldType;                // Field type: 'text' | 'email' | 'phone' | 'textarea' | 'file' | 'ssn' | 'address'
  required: boolean;              // Base required status (overridden by request type)
  validation?: FieldValidation;    // Validation rules
  placeholder?: string;            // Placeholder text
  helpText?: string;              // Help text shown below field
  order?: number;                 // Display order within section
  section?: string;               // Section: 'identity' | 'request-specific' | 'beneficiary' | 'optional'
}
```

### Available Fields

**Identity Section:**
- `firstName` - First Name (text)
- `lastName` - Last Name (text)
- `email` - Email Address (email)
- `cptId` - CPT ID (text, optional)
- `phone` - Phone (phone)
- `address` - Address (address)

**Request-Specific Section:**
- `previousAddress` - Previous Address (address)
- `newAddress` - New Address (address)
- `previousName` - Previous Name (text)
- `newName` - New Name (text)
- `ssnTaxId` - SSN/Tax ID (ssn)
- `supportingDocumentation` - Supporting Documentation (file)
- `additionalDescription` - Additional Description (textarea)

**Beneficiary Section:**
- `beneficiaryName` - Beneficiary Name (text)
- `beneficiaryAddress` - Beneficiary Address (address)
- `beneficiaryEmail` - Beneficiary Email (email)

## FAQ Configuration

```typescript
interface FAQItem {
  id: string;        // UUID (e.g., 'faq-001', 'faq-002')
  question: string;  // FAQ question
  answer: string;    // FAQ answer/description
}
```

## FAQ Dialog Behavior

When a user selects a request type with a `faqLink` and clicks "Next" on step 0:

1. **Dialog appears** with:
   - Header: "Did you know?"
   - Title: FAQ question
   - Description: FAQ answer
   - Centered layout

2. **Buttons:**
   - **Go Back** (left) - Closes dialog, does nothing
   - **Continue** (right) - Closes dialog and proceeds to next step

3. **If no FAQ link** - Proceeds directly to next step

## Data Flow

1. **Form Data** uses field IDs directly (e.g., `firstName`, `email`, `address`)
2. **JSON Output** converts `firstName` + `lastName` → `fullName` for submission
3. **Field Requirements** are determined by consolidating all selected request types
4. **No Normalization** - Field IDs are used consistently throughout the codebase

