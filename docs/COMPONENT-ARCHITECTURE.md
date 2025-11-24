# Component Architecture & Patterns

**Generated:** 2025-01-27  
**Purpose:** Document how CPT components work and how to use them properly

---

## 🎯 Core Principles

### 1. CPT Components = PrimeReact Wrappers

CPT components are **thin wrappers** around PrimeReact components. They follow this exact pattern:

```typescript
'use client';

import { [ComponentName], [ComponentName]Props } from 'primereact/[component]';

export interface CPT[ComponentName]Props extends [ComponentName]Props {}

export const CPT[ComponentName] = (props: CPT[ComponentName]Props) => {
  return <[ComponentName] {...props} />;
};
```

**Example - CPTDropdown:**
```typescript
'use client';

import { Dropdown, DropdownProps } from 'primereact/dropdown';

export interface CPTDropdownProps extends DropdownProps {}

export const CPTDropdown = (props: CPTDropdownProps) => {
  return <Dropdown {...props} />;
};
```

**Key Points:**
- ✅ Extends PrimeReact props exactly (no modifications)
- ✅ Passes all props through to underlying PrimeReact component
- ✅ Uses `'use client'` directive (PrimeReact components require client-side)
- ✅ Simple pass-through wrapper pattern

---

## 🎨 Styling Philosophy

### PrimeReact Theme Handles ALL Styling

**CRITICAL:** We do NOT add custom colors or styling to components. PrimeReact's `soho-dark` theme handles everything.

### Theme Setup

The theme is configured in `src/providers/PrimeReactProvider.tsx`:

```typescript
// Import PrimeReact theme and styles
import 'primereact/resources/themes/soho-dark/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
```

**CSS Import Order (Important!):**
1. PrimeReact theme CSS (`soho-dark`)
2. PrimeReact core CSS
3. PrimeIcons CSS
4. PrimeFlex CSS (utility classes)

### What We DO Style

✅ **Layout Only** - Use PrimeFlex utility classes:
- `flex`, `flex-column`, `flex-wrap`
- `gap-2`, `gap-3`, `gap-4`
- `p-4`, `mt-4`, `mb-4`
- `w-full`, `col-12`, `md:col-6`
- `align-items-center`, `justify-content-between`

✅ **PrimeReact Utility Classes** - Use PrimeReact's built-in classes:
- `p-invalid` - For error states
- `p-error` - For error text
- `text-color-secondary` - For secondary text
- `p-button-primary`, `p-button-secondary` - For button variants

❌ **What We DON'T Style:**
- ❌ Custom colors (use PrimeReact severity props: `severity="success"`, `severity="danger"`, etc.)
- ❌ Custom component styling (PrimeReact theme handles this)
- ❌ Custom CSS for component internals
- ❌ Inline styles for colors/theming

### Example - Correct Styling Approach

```typescript
// ✅ CORRECT - Layout and PrimeReact classes only
<CPTCard className="mt-4">
  <div className="flex flex-column gap-3">
    <CPTInputText
      className={`w-full ${errors.email ? 'p-invalid' : ''}`}
      value={email}
      onChange={handleChange}
    />
    {errors.email && (
      <CPTMessage
        severity="error"
        text={errors.email}
        className="mt-2"
      />
    )}
  </div>
</CPTCard>

// ❌ WRONG - Custom colors/styling
<CPTCard style={{ backgroundColor: '#ff0000' }}>
  <CPTInputText style={{ color: 'blue' }} />
</CPTCard>
```

---

## 📦 Component Import Patterns

### Two Import Sources

1. **Local Wrappers** (Production Code) - `@/components/input`
2. **Package Components** (Showcase) - `@cpt-group/cpt-prime-react`

### Production Code Pattern

**Use local wrappers from `@/components/input`:**

```typescript
import { CPTCard, CPTInputText, CPTMessage } from '@/components/input';
```

**Example from `StepPersonalInfo.tsx`:**
```typescript
'use client';

import { CPTCard, CPTInputText, CPTMessage } from '@/components/input';

export const StepPersonalInfo = ({ ... }) => {
  return (
    <CPTCard className="mt-4">
      <CPTInputText
        className={`w-full ${errors.email ? 'p-invalid' : ''}`}
        value={email}
        onChange={handleChange}
      />
      {errors.email && (
        <CPTMessage severity="error" text={errors.email} />
      )}
    </CPTCard>
  );
};
```

### Showcase Code Pattern

**Uses package directly from `@cpt-group/cpt-prime-react`:**

```typescript
import {
  CPTButton,
  CPTCard,
  CPTDropdown,
} from '@cpt-group/cpt-prime-react';
```

**Note:** Showcase code bypasses local wrappers for demonstration purposes. Production code should use local wrappers.

---

## 🏗️ Component Showcase Structure

### Route Structure

```
src/app/component-showcase/page.tsx
```

### Section Components

Each section is a separate component in `src/components/pages/ComponentShowcase/`:

- `ButtonsSection.tsx` - All button variants
- `FormInputsSection.tsx` - All form input components
- `DataSection.tsx` - DataTable, DataView, TreeTable, etc.
- `PanelSection.tsx` - Panel, Fieldset, Accordion, Tabs
- `OverlaysSection.tsx` - Dialog, Sidebar, Tooltip
- `FileSection.tsx` - FileUpload component
- `MenuSection.tsx` - Menu, Steps
- `MessagesSection.tsx` - Toast, Messages
- `MediaSection.tsx` - Image, Avatar
- `ChartSection.tsx` - Chart components
- `MiscellaneousSection.tsx` - Progress, Skeleton, etc.

### Showcase Page Pattern

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatedBackground, FormInputsSection, ButtonsSection, ... } from '@/components';
import { CPTToast } from '@cpt-group/cpt-prime-react';

export default function ComponentShowcasePage() {
  const [isMounted, setIsMounted] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatches
  if (!isMounted) {
    return <LoadingState />;
  }

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-column align-items-center p-4" suppressHydrationWarning>
        <div className="w-full max-w-screen-xl">
          <h1 className="text-5xl font-bold mb-2">Component Showcase</h1>
          <CPTToast ref={toast} />
          <FormInputsSection />
          <ButtonsSection />
          {/* ... other sections */}
        </div>
      </div>
    </>
  );
}
```

**Key Patterns:**
- ✅ Uses `suppressHydrationWarning` for PrimeReact components
- ✅ Handles hydration with `isMounted` state
- ✅ Uses PrimeFlex classes for layout (`flex`, `flex-column`, `align-items-center`, `p-4`)
- ✅ Uses `max-w-screen-xl` for container width
- ✅ Includes `AnimatedBackground` for visual consistency

---

## 📋 Component Usage Examples

### Buttons

```typescript
// Basic button
<CPTButton label="Submit" />

// With severity (uses PrimeReact theme colors)
<CPTButton label="Success" severity="success" />
<CPTButton label="Danger" severity="danger" />

// With icon
<CPTButton label="Save" icon="pi pi-check" iconPos="right" />

// Variants (no custom styling needed)
<CPTButton label="Outlined" outlined />
<CPTButton label="Text" text />
<CPTButton label="Raised" raised />
<CPTButton label="Rounded" rounded />
```

### Form Inputs

```typescript
// Text input with validation
<CPTInputText
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className={`w-full ${error ? 'p-invalid' : ''}`}
  placeholder="Enter text"
/>

// Dropdown
<CPTDropdown
  value={selected}
  onChange={(e) => setSelected(e.value)}
  options={options}
  placeholder="Select an option"
  className="w-full"
/>

// Multi-select
<CPTMultiSelect
  value={selected}
  onChange={(e) => setSelected(e.value)}
  options={options}
  placeholder="Select multiple"
  className="w-full"
/>
```

### Cards & Layout

```typescript
// Card with title
<CPTCard title="Card Title">
  <p>Card content</p>
</CPTCard>

// Card with custom header
<CPTCard
  header={<div className="p-3">Custom Header</div>}
>
  <p>Card content</p>
</CPTCard>

// Layout with PrimeFlex
<div className="flex flex-column gap-3">
  <CPTCard>...</CPTCard>
  <CPTCard>...</CPTCard>
</div>
```

### Messages & Validation

```typescript
// Error message
{errors.email && (
  <CPTMessage
    severity="error"
    text={errors.email}
    className="mt-2"
  />
)}

// Success message
<CPTMessage
  severity="success"
  text="Operation successful"
/>
```

---

## 🔧 Component Props

### All PrimeReact Props Available

Since CPT components extend PrimeReact props exactly, **all PrimeReact props are available**:

```typescript
// CPTButton accepts all Button props
<CPTButton
  label="Submit"
  icon="pi pi-check"
  iconPos="right"
  severity="success"
  size="large"
  disabled={false}
  loading={isLoading}
  onClick={handleClick}
  className="custom-class"
  // ... any other Button props
/>

// CPTDropdown accepts all Dropdown props
<CPTDropdown
  value={value}
  onChange={handleChange}
  options={options}
  optionLabel="name"
  optionValue="id"
  filter
  showClear
  placeholder="Select..."
  className="w-full"
  // ... any other Dropdown props
/>
```

### Common Props Pattern

Most components follow these common patterns:

- `value` / `onChange` - Controlled components
- `options` - For select/dropdown components
- `placeholder` - Input placeholders
- `className` - Additional CSS classes (layout only)
- `disabled` - Disabled state
- `severity` - Color variant (`success`, `danger`, `warning`, `info`, `help`)
- `size` - Size variant (`small`, `normal`, `large`)

---

## 🎯 Best Practices

### ✅ DO

1. **Use PrimeReact components as much as possible**
   - They handle all styling automatically
   - Consistent with theme
   - Accessible by default

2. **Use PrimeFlex for layout**
   - `flex`, `flex-column`, `gap-*`, `p-*`, `m-*`
   - Responsive: `md:col-6`, `lg:flex-row`

3. **Use PrimeReact utility classes**
   - `p-invalid` for error states
   - `text-color-secondary` for secondary text
   - `p-button-*` for button variants

4. **Use severity props for colors**
   - `severity="success"` instead of custom green
   - `severity="danger"` instead of custom red
   - Theme handles all color variations

5. **Import from local wrappers in production**
   - `@/components/input` for production code
   - Keeps consistency and allows future customization

### ❌ DON'T

1. **Don't add custom colors**
   - No `style={{ color: 'blue' }}`
   - No custom CSS for component colors
   - Let PrimeReact theme handle it

2. **Don't override PrimeReact styles**
   - Don't use `!important` to override theme
   - Don't create custom component styles
   - Work with the theme, not against it

3. **Don't mix styling approaches**
   - Don't use Tailwind for component styling
   - Use PrimeFlex for layout, PrimeReact for components

4. **Don't bypass CPT wrappers in production**
   - Use `@/components/input` not `@cpt-group/cpt-prime-react`
   - Allows future customization if needed

---

## 📚 Reference

### PrimeReact Documentation
- [PrimeReact Components](https://primereact.org/)
- [PrimeFlex Utilities](https://primeflex.org/)
- [PrimeIcons](https://primereact.org/icons/)

### Theme
- Current theme: `soho-dark`
- Location: `primereact/resources/themes/soho-dark/theme.css`
- All component styling comes from this theme

### Component Wrappers
- Location: `src/components/input/`
- Pattern: Simple pass-through wrappers
- All extend PrimeReact props exactly

---

## 🔄 Future Considerations

### Custom Components

When creating custom components (not PrimeReact wrappers):

1. **Use PrimeReact CSS variables**
   - `var(--primary-color)`
   - `var(--text-color)`
   - `var(--surface-ground)`
   - Maintain theme consistency

2. **Use PrimeFlex for layout**
   - Same utility classes
   - Same responsive breakpoints

3. **Follow PrimeReact patterns**
   - Similar prop naming
   - Similar component structure
   - Similar accessibility patterns

**Note:** We're not creating custom components yet, but when we do, we'll follow these patterns to maintain consistency with PrimeReact theme.

---

**Status:** Architecture documented  
**Last Updated:** 2025-01-27

