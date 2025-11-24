# Support Form UI Design Proposal

## Overview
Clean, professional form using PrimeReact components with minimal custom styling. Focus on positioning, layout, and user experience.

---

## Step 1: Support Request Selection

### Components
- **Card** - Container
- **ListBox** (multiple) - Request type selection (17 options)
- **Dialog** - FAQ popup when request type with FAQ reference is selected
- **Message** - Error display

### Layout
```
┌─────────────────────────────────┐
│  Card                           │
│  ┌───────────────────────────┐  │
│  │ Select Request Types *    │  │
│  │ ┌───────────────────────┐ │  │
│  │ │ ☑ Address Update      │ │  │
│  │ │ ☑ Name Change         │ │  │
│  │ │ ☐ Notice Packet       │ │  │
│  │ │ ☐ Passcode Request    │ │  │
│  │ │ ...                   │ │  │
│  │ └───────────────────────┘ │  │
│  └───────────────────────────┘  │
│                                 │
│  [Error message if none selected]│
└─────────────────────────────────┘
```

**Rationale:** 
- ListBox with multiple selection provides clean vertical layout
- Better for mobile - no chip overflow issues
- Clear checkboxes show selections
- Dialog for FAQ is non-intrusive, dismissible
- Can trigger when user selects a request type with FAQ reference

---

## Step 2: Select Case

### Components
- **Card** - Container for the step
- **Dropdown** - Case selection (existing pattern)
- **Message** - Error display if needed

### Layout
```
┌─────────────────────────────────┐
│  Card                           │
│  ┌───────────────────────────┐  │
│  │ Select Case *             │  │
│  │ [Dropdown ▼]              │  │
│  └───────────────────────────┘  │
│                                 │
│  [Error message if invalid]    │
└─────────────────────────────────┘
```

**Rationale:** Simple, clean. Card provides visual grouping. Dropdown is standard for single selection.

**FAQ Popup (Dialog):**
```
┌─────────────────────────────────┐
│  Did you know?              [X] │
│  ─────────────────────────────── │
│  [FAQ Question]                  │
│  [FAQ Answer]                    │
│                                 │
│  [Read more →]                   │
└─────────────────────────────────┘
```

**Rationale:** 
- MultiSelect with chips shows selections clearly
- Dialog for FAQ is non-intrusive, dismissible
- Can trigger when user selects a request type with FAQ reference

---

## Step 3: Support Request Data

### Components
- **Card** - Main container
- **Fieldset** - Group identity verification fields
- **Fieldset** - Group request-specific fields  
- **Divider** - Separate required vs optional sections
- **Panel** - Collapsible section for optional fields
- **InputText** - Text inputs (Name, CPT ID, Address, etc.)
- **InputTextarea** - Longer text (Reason, Detailed Response)
- **InputMask** - Phone number (if needed for formatting)
- **Message** - Field-level validation errors
- **SupportFileUpload** - Optional supporting docs (reusable component)

### Layout Structure
```
┌─────────────────────────────────────────────┐
│  Card                                       │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Fieldset: Identity Verification       │ │
│  │ ──────────────────────────────────── │ │
│  │ Name *              [InputText]        │ │
│  │ CPT ID *            [InputText]       │ │
│  │ Email Address *     [InputText]       │ │
│  │ Phone *              [InputText]      │ │
│  │ Mailing Address *   [InputText]       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ────────────────────────────────────────── │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Fieldset: Request-Specific Information│ │
│  │ ──────────────────────────────────── │ │
│  │ Previous Address *   [InputText]     │ │
│  │ New Address *        [InputText]     │ │
│  │ Reason *             [Textarea]      │ │
│  │ [Other dynamic fields...]            │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ────────────────────────────────────────── │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Panel: Optional Fields (Collapsed)    │ │
│  │ ──────────────────────────────────── │ │
│  │ [Expand to show optional fields]     │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ────────────────────────────────────────── │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Additional Documentation (Optional)    │ │
│  │ ──────────────────────────────────── │ │
│  │ Description                           │ │
│  │ [Textarea]                            │ │
│  │                                       │ │
│  │ Documents                             │ │
│  │ [SupportFileUpload]                   │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Field Organization Logic

1. **Identity Verification Fields** (Always shown first)
   - Name, CPT ID, Email, Phone, Mailing Address
   - Grouped in Fieldset with legend "Identity Verification"
   - All required fields marked with *

2. **Request-Specific Fields** (Based on selected request types)
   - De-duplicated: If multiple request types need same field, show once
   - Grouped in Fieldset with legend "Request-Specific Information"
   - Required fields first, then optional
   - Use appropriate input type (InputText, InputTextarea, etc.)

3. **Optional Fields** (Collapsible Panel)
   - Any optional fields that aren't in the main sections
   - Panel starts collapsed
   - User can expand if needed

4. **Additional Documentation** (Always at bottom)
   - Textarea for description
   - SupportFileUpload for documents
   - Clearly marked as optional

**Rationale:**
- **Fieldset** provides semantic grouping and visual separation
- **Divider** clearly separates sections
- **Panel** keeps optional fields accessible but not cluttering
- **Card** contains everything in a clean container
- Logical flow: Identity → Request Info → Optional → Additional Docs

---

## Step 4: Confirmation

### Components
- **Card** - Main container
- **Message** (severity: success) - Success message
- **Divider** - Separate main message from note
- **Text** - Italicized note about duplicate tickets
- **Button** - Link to FAQ page

### Layout
```
┌─────────────────────────────────────────────┐
│  Card                                       │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ [Success Icon]                        │ │
│  │ Your support request has been         │ │
│  │ received. A CPT representative will   │ │
│  │ get back to you as soon as possible.  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ────────────────────────────────────────── │
│                                             │
│  Please be advised, making more than one    │
│  ticket for the same request will slow     │
│  down response time for you and others.    │
│  (italicized, subtle)                      │
│                                             │
│  [View FAQ] [Submit Another Request]       │
└─────────────────────────────────────────────┘
```

**Rationale:**
- Clean, professional success message
- Clear but subtle note about duplicates
- Link to FAQ page for additional help
- Optional button to submit another (if needed)

---

## Component Recommendations Summary

### Primary Components
- **Steps** - Step indicator (existing pattern)
- **Card** - Main container for each step
- **Fieldset** - Group related fields
- **Divider** - Visual separation
- **Panel** - Collapsible optional sections
- **ListBox** (multiple) - Request type selection (better for mobile, vertical layout)
- **Dialog** - FAQ popup
- **Message** - Success/error messages

### Input Components
- **InputText** - Standard text inputs
- **InputTextarea** - Longer text fields
- **InputMask** - Phone formatting (if needed)
- **SupportFileUpload** - File uploads (reusable)

### Layout Utilities (PrimeFlex)
- `flex`, `flex-column` - Layout direction
- `gap-*` - Spacing between elements
- `w-full`, `max-w-*` - Width constraints
- `mt-*`, `mb-*`, `p-*` - Margins and padding
- `align-items-*`, `justify-content-*` - Alignment

---

## Key Design Principles

1. **No Custom Colors/Theming** - Use PrimeReact theme only
2. **Positioning & Layout Only** - PrimeFlex utilities for spacing/alignment
3. **Don't Style Children** - Let PrimeReact components handle their own styling
4. **Semantic Grouping** - Use Fieldset, Panel for logical organization
5. **Progressive Disclosure** - Optional fields in collapsible Panel
6. **Clear Visual Hierarchy** - Required fields first, optional clearly marked
7. **Consistent Spacing** - Use PrimeFlex gap/margin utilities consistently

---

## Alternative Considerations

### For Step 3, could also use:
- **Accordion** - Instead of Fieldset + Panel, but might be overkill
- **TabView** - If we want to separate identity vs request fields into tabs (probably not needed)
- **DataView** - If we want a more structured grid layout (probably too complex)

**Decision:** Fieldset + Panel approach is cleaner and more semantic for form data.

---

## Implementation Notes

1. **Field De-duplication Logic**
   - Collect all fields from selected request types
   - Create Set of unique field names
   - Map field names to field configs (type, required, label)
   - Render in logical order

2. **Dynamic Field Rendering**
   - Create field config objects with: name, label, type, required, validation
   - Map over field configs to render appropriate Input component
   - Use consistent field names for JSON normalization

3. **FAQ Dialog Trigger**
   - Watch for request type selection changes
   - Check if selected type has FAQ reference
   - Show Dialog with FAQ content
   - Link to /faq page

4. **Validation**
   - Field-level validation on blur
   - Step-level validation before Next
   - Clear error messages using Message component

---

## Questions to Consider

1. Should optional fields be in a Panel (collapsed) or just shown with "(Optional)" label?
2. Should we use InputMask for phone numbers for formatting?
3. Should we group address fields (street, city, state, zip) or use single "Address" field?
4. Should FAQ dialog auto-show or require user to click an info icon?

