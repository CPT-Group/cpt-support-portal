# CPT Support Portal

A modern support ticket submission portal built with Next.js 16, React 19, and PrimeReact.

## Features

- **Support Request Form** - Multi-step form with dynamic field rendering based on request types
- **FAQ Page** - Accordion-based frequently asked questions
- **Theme Toggle** - Switch between light and dark American flag-themed themes (red, white, blue)
- **URL Prefilling** - Support for URL parameters to prefill form data
- **JSON Output** - Normalized JSON submission format for easy API integration
- **SEO Optimized** - Comprehensive metadata and Open Graph tags

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** PrimeReact 10.9.7
- **Components:** @cpt-group/cpt-prime-react
- **Styling:** PrimeFlex, Custom Themes
- **Language:** TypeScript
- **React:** 19.2.0

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── faq/               # FAQ page
│   └── support-request/   # Support form pages
├── components/            # React components
│   ├── common/           # Shared components (ThemeToggle, SupportFileUpload)
│   └── pages/            # Page-specific components
├── constants/            # App constants (form fields, request types, case list)
├── hooks/                # Custom React hooks
├── providers/            # Context providers (Theme, PrimeReact)
├── types/                # TypeScript type definitions
└── utils/                # Utility functions (field consolidation, JSON generation, URL params)
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Themes

The application uses custom American flag-themed color schemes:

- **Light Theme:** Soft blue primary (`#5B8FC7`) with white backgrounds and red accents
- **Dark Theme:** Red primary (`#E85D75`) with dark navy backgrounds (`#1a2332`)

Themes are located in `public/themes/` and can be toggled using the button in the top-left corner.

## Environment Variables

- `NEXT_PUBLIC_SITE_URL` - Base URL for metadata and OG images (optional, defaults to Netlify URL)

## Deployment

Configured for Netlify deployment. See `netlify.toml` for build settings.

## Version

Current version: **1.0.3**

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.
