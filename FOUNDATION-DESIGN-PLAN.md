# CPT Support Portal - Foundation Design Plan & Code Review

**Generated:** 2025-01-27  
**Reference Codebase:** `C:\local_dev\Github-CPT-Group\case-form-generator`  
**Experts Consulted:** next-framework-expert, react-expert, typescript-expert, code-writing-rules-expert

---

## 📋 Executive Summary

This document outlines the complete foundation setup for the CPT Support Portal, matching the architectural patterns, folder structure, and component organization from the reference codebase. The foundation emphasizes:

- **Functional, Pure React Components** with clear separation of concerns
- **PrimeReact Component Wrappers** (CPT* prefix) for consistent UI
- **PrimeReact Dark Theme** (`soho-dark`) for styling (minimal custom CSS)
- **TypeScript** with strict typing throughout
- **Modular Folder Structure** matching reference codebase exactly

---

## 🏗️ Architecture Overview

### Core Principles (From Experts)

**React Expert Guidance:**
- Use functional components exclusively (no class components)
- Extract reusable logic to custom hooks
- Keep components small and focused (single responsibility)
- Use TypeScript for type safety
- Destructure props for clarity

**Code Writing Rules Expert:**
- Prefer functional programming over OOP
- Single responsibility principle for all functions/components
- Pure functions where possible (easier to test)
- Clear separation between UI components, business logic, and utilities

**Next.js Framework Expert:**
- Use App Router (default in Next.js 13+)
- Server Components by default, Client Components with `'use client'` directive
- Proper TypeScript configuration with path aliases (`@/*`)
- Minimal layout structure

---

## 📁 Folder Structure (Matching Reference)

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Providers
│   ├── page.tsx                # Home page
│   └── globals.css             # Tailwind + PrimeReact imports only
├── components/
│   ├── input/                  # PrimeReact component wrappers
│   │   ├── CPTButton.tsx
│   │   ├── CPTCheckbox.tsx
│   │   ├── CPTDialog.tsx
│   │   ├── CPTDropdown.tsx
│   │   ├── CPTFileUpload.tsx
│   │   ├── CPTInputNumber.tsx
│   │   ├── CPTInputText.tsx
│   │   ├── CPTInputTextarea.tsx
│   │   ├── CPTMultiSelect.tsx
│   │   ├── CPTProgressSpinner.tsx
│   │   ├── CPTRadioButton.tsx
│   │   ├── CPTToast.tsx
│   │   ├── CPTToggleButton.tsx
│   │   └── index.ts            # Barrel export
│   ├── common/                 # Shared/common components
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   └── index.ts
│   ├── pages/                  # Page-specific components
│   │   ├── Home/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts                # Main barrel export
├── constants/                  # App constants
│   └── index.ts
├── hooks/                      # Custom React hooks
│   └── index.ts
├── providers/                  # React context providers
│   ├── PrimeReactProvider.tsx
│   ├── Providers.tsx
│   └── index.ts quartz
├── types/                      # TypeScript type definitions
│   └── index.ts
└── util/                       # Utility functions
    └── index.ts
```

---

## 🎨 Component Pattern (CPT Wrappers)

### Pattern Template (From Reference)

All PrimeReact components follow this exact pattern:

```typescript
'use client';

import { [ComponentName], [ComponentName]Props } from 'primereact/[component]';

export interface CPT[ComponentName]Props extends [ComponentName]Props {
}

export const CPT[ComponentName] = (props: CPT[ComponentName]Props) => {
  return <[ComponentName] {...props} />;
};
```

**Special Cases:**
- **CPTToast**: Uses `forwardRef` pattern (reference example)
- All components: Must be `'use client'` (PrimeReact components require client-side)

### Components to Create (13 total)

1. ✅ **CPTButton** - Basic button component
2. ✅ **CPTCheckbox** - Checkbox input
3. ✅ **CPTDialog** - Modal dialogs
4. ✅ **CPTDropdown** - Select dropdown
5. ✅ **CPTFileUpload** - File upload component
6. ✅ **CPTInputNumber** - Number input
7. ✅ **CPTInputText** - Text input
8. ✅ **CPTInputTextarea** - Multi-line text input
9. ✅ **CPTMultiSelect** - Multi-select dropdown
10. ✅ **CPTProgressSpinner** - Loading spinner
11. ✅ **CPTRadioButton** - Radio button
12. ✅ **CPTToast** - Toast notifications (uses forwardRef)
13. ✅ **CPTToggleButton** - Toggle switch

---

## 🎯 PrimeReact Setup

### Provider Structure

```typescript
// src/providers/PrimeReactProvider.tsx
'use client';
import { PrimeReactProvider as PRProvider } from 'primereact/api';
import 'primereact/resources/themes/soho-dark/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
```

**Theme:** `soho-dark` (dark theme, mobile-friendly, comprehensive styling)

**CSS Imports Order:**
1. PrimeReact theme CSS (`soho-dark`)
2. PrimeReact core CSS
3. PrimeIcons CSS
4. PrimeFlex CSS (utility classes)

**Key Principle:** Let PrimeReact theming do all the work. Minimal to no custom CSS.

### Layout Integration

```typescript
// src/app/layout.tsx
import { Providers } from '@/providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Note:** Reference codebase uses Geist fonts, but user preference is to let PrimeReact handle styling. We'll keep layout minimal.

---

## 📦 Dependencies

### Production Dependencies (From Reference)

```json
{
  "next": "16.0.1",           // ✅ Already installed
  "react": "19.2.0",          // ✅ Already installed
  "react-dom": "19.2.0",      // ✅ Already installed
  "primereact": "^10.9.7",    // ⚠️ NEEDS INSTALL
  "primeicons": "^7.0.0",     // ⚠️ NEEDS INSTALL
  "primeflex": "^4.0.0"       // ⚠️ NEEDS INSTALL
}
```

### Dev Dependencies (Already Installed)

- TypeScript, @types/* packages
- Tailwind CSS v4
- ESLint + Next.js config

---

## 🔧 Configuration Files

### TypeScript (tsconfig.json)

**Already configured by npx**, but verify:
- ✅ `"strict": true`
- ✅ `"jsx": "react-jsx"`
- ✅ Path aliases: `"@/*": ["./src/*"]`
- ✅ `moduleResolution: "bundler"`

### Next.js (next.config.ts)

**Already configured**, minimal config needed.

### Global CSS (src/app/globals.css)

**Current:** Only `@import "tailwindcss";`

**Required:** Add PrimeReact CSS imports in `PrimeReactProvider.tsx` (as per reference pattern) and keep `globals.css` minimal.

---

## ✅ Implementation Checklist

### Phase 1: Foundation Setup

- [ ] Install PrimeReact dependencies
- [ ] Create folder structure
- [ ] Set up PrimeReactProvider with dark theme
- [ ] Create Providers wrapper
- [ ] Update layout.tsx to use Providers
- [ ] Create all 13 CPT component wrappers
- [ ] Set up barrel exports (index.ts files)
- [ ] Test foundation

สินสุด

---

**Status:** Ready for Implementation  
**Next Action:** Begin Phase 1 - Foundation Setup

