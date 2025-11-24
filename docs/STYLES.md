# Styles & Styling Guide

**Generated:** 2025-01-27  
**Purpose:** Document styling approach and global styles

---

## 🎨 Styling Philosophy

### Core Principle: PrimeReact Theme Handles Component Styling

**CRITICAL:** We do NOT add custom colors or styling to PrimeReact components. The `soho-dark` theme handles all component styling automatically.

### What We Style

✅ **Layout Only** - Use PrimeFlex utility classes for basic layout (centering, spacing, flexbox)  
✅ **Basic Utilities** - Tailwind for minimal layout utilities

### What We DON'T Style

❌ Component colors (use PrimeReact `severity` props)  
❌ Component internals (PrimeReact theme handles this)  
❌ Custom CSS overrides for PrimeReact components  
❌ Custom animations or backgrounds (PrimeReact theme controls all visual styling)  
❌ Custom keyframes or animation utilities

---

## 📁 Global Styles File

**Location:** `src/app/globals.css`

### Structure

```css
@import "tailwindcss";
```

**That's it!** The file is intentionally minimal. All styling comes from:
- PrimeReact theme (`soho-dark`) - Component colors, backgrounds, typography
- PrimeFlex utilities - Layout and spacing
- Tailwind utilities - Basic layout utilities (centering, etc.)

---

## 🎯 Tailwind CSS

### Import

```css
@import "tailwindcss";
```

**Purpose:** Provides minimal Tailwind utility classes for basic layout only.

**Usage:**
- Basic layout utilities: `flex`, `flex-column`, `gap-*`, `p-*`, `m-*`
- Responsive utilities: `md:col-6`, `lg:flex-row`
- Centering: `align-items-center`, `justify-content-center`

**Note:** Tailwind is used ONLY for basic layout utilities. All visual styling (colors, backgrounds, animations) comes from PrimeReact theme.

---

## 🎬 Custom Animations

**None.** We intentionally removed all custom animations to keep styling minimal and let PrimeReact theme control the visual appearance.

If animations are needed in the future, they should be:
1. Part of PrimeReact component behavior (built-in)
2. Or added via PrimeReact theme customization
3. Not custom CSS animations that override theme styling

---

## 🎨 PrimeReact Theme

### Theme Configuration

**Location:** `src/providers/PrimeReactProvider.tsx`

```typescript
import 'primereact/resources/themes/soho-dark/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
```

### CSS Import Order (Critical!)

1. **PrimeReact Theme** (`soho-dark/theme.css`)
   - All component colors, spacing, typography
   - Dark theme styling

2. **PrimeReact Core** (`primereact.min.css`)
   - Component structure and base styles

3. **PrimeIcons** (`primeicons.css`)
   - Icon font and styles

4. **PrimeFlex** (`primeflex.css`)
   - Utility classes for layout

**Why Order Matters:**
- Theme must load first to establish base styles
- Core styles build on theme
- Icons and utilities can override if needed

---

## 📦 PrimeFlex Utilities

### Layout Utilities

**Flexbox:**
- `flex` - Display flex
- `flex-column` - Flex direction column
- `flex-row` - Flex direction row
- `flex-wrap` - Flex wrap

**Alignment:**
- `align-items-center` - Align items center
- `justify-content-between` - Justify content space-between
- `justify-content-end` - Justify content flex-end

**Spacing:**
- `gap-2`, `gap-3`, `gap-4` - Gap spacing
- `p-2`, `p-3`, `p-4` - Padding
- `m-2`, `m-3`, `m-4` - Margin
- `mt-4`, `mb-4` - Margin top/bottom

**Width:**
- `w-full` - Width 100%
- `col-12` - Column 12 (full width)
- `md:col-6` - Column 6 on medium screens

**Responsive:**
- `md:*` - Medium breakpoint and up
- `lg:*` - Large breakpoint and up
- `xl:*` - Extra large breakpoint and up

### Text Utilities

- `text-center` - Text align center
- `text-color-secondary` - Secondary text color (PrimeReact)
- `font-bold` - Font weight bold
- `font-semibold` - Font weight semibold

### Component State Utilities

- `p-invalid` - Invalid input state (PrimeReact)
- `p-error` - Error text color (PrimeReact)
- `p-button-primary` - Primary button style (PrimeReact)
- `p-button-secondary` - Secondary button style (PrimeReact)

---

## 🎯 Usage Examples

### Layout Example

```typescript
<div className="flex flex-column align-items-center p-4">
  <div className="w-full max-w-screen-lg">
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-3">
        {/* Content */}
      </div>
    </CPTCard>
  </div>
</div>
```

### Form with Validation

```typescript
<div className="flex flex-column gap-2">
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
```

### Responsive Grid

```typescript
<div className="grid">
  <div className="col-12 md:col-6">
    {/* Half width on medium+ screens */}
  </div>
  <div className="col-12 md:col-6">
    {/* Half width on medium+ screens */}
  </div>
</div>
```

---

## 🚫 What NOT to Do

### ❌ Don't Add Custom Colors

```typescript
// ❌ WRONG
<CPTCard style={{ backgroundColor: '#ff0000' }}>
  <CPTButton style={{ color: 'blue' }} />
</CPTCard>

// ✅ CORRECT
<CPTCard>
  <CPTButton severity="danger" />
</CPTCard>
```

### ❌ Don't Override PrimeReact Styles

```css
/* ❌ WRONG */
.p-button {
  background-color: red !important;
}

/* ✅ CORRECT - Use severity prop */
<CPTButton severity="danger" />
```

### ❌ Don't Use Tailwind for Component Styling

```typescript
// ❌ WRONG
<CPTButton className="bg-blue-500 text-white" />

// ✅ CORRECT
<CPTButton severity="info" />
```

---

## 📝 Adding New Styles

### For Layout

Use PrimeFlex utilities. If you need something not available, add to `globals.css`:

```css
@layer utilities {
  .custom-layout-class {
    /* Layout only, no colors */
  }
}
```

### For Animations

**Avoid custom animations.** Use PrimeReact's built-in animations or theme customization instead. If absolutely necessary, add to PrimeReact theme CSS, not `globals.css`.

### For Custom Components

When creating custom components (not PrimeReact wrappers):

1. Use PrimeReact CSS variables:
   ```css
   .custom-component {
     color: var(--text-color);
     background: var(--surface-ground);
   }
   ```

2. Use PrimeFlex for layout
3. Follow PrimeReact patterns

---

## 🔍 Style Inspection

### How to Check What Styles Are Applied

1. **Browser DevTools:**
   - Inspect element
   - Check Computed styles
   - Look for PrimeReact classes (`p-*`)

2. **Component Props:**
   - Check `severity` prop for colors
   - Check `className` for layout utilities
   - Check PrimeReact documentation for available props

3. **Theme Variables:**
   - PrimeReact uses CSS variables
   - Check `:root` in DevTools
   - Variables like `--primary-color`, `--text-color`

---

## 📚 References

- [PrimeReact Themes](https://primereact.org/theming/)
- [PrimeFlex Documentation](https://primeflex.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Component Architecture](./COMPONENT-ARCHITECTURE.md)

---

**Status:** Styles documented  
**Last Updated:** 2025-01-27

