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
- **Components:** PrimeReact (Button, Card, Dialog, Steps, InputText, InputTextarea, etc.)
- **Styling:** PrimeFlex, Custom Themes
- **Language:** TypeScript
- **React:** 19.2.3

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

Open [http://localhost:3777](http://localhost:3777) in your browser.

### Build

```bash
npm run build
npm start
```

## Themes

The application uses a SCSS-based theme system (aligned with internal-dashboard and cpt-internal-tools). One PrimeReact base theme is loaded; theme is applied via the `data-theme` attribute on `<html>` and variable overrides in `src/styles/themes/`.

**Available themes:** CPT Legacy Light, CPT Legacy Dark, Dark, Light, Dark Synth, MS Access 2010. The header theme button cycles through all six. Default is CPT Legacy Light. Theme choice is persisted in `localStorage` under `cpt-theme`.

Theme files live in `src/styles/themes/`; fonts are still served from `public/themes/cpt-legacy-dark/fonts/`. See `docs/theme-rework-reference.md` for the full architecture.

## Environment Variables

- `NEXT_PUBLIC_SITE_URL` - Base URL for metadata and OG images (optional, defaults to Netlify URL)
- `NEXT_PUBLIC_GEOAPIFY_API_KEY` - Geoapify API key for address autocomplete functionality (required for address fields)
- `SUPPORT_CHANNEL_RECORD_TYPE_ID` - Optional. Salesforce Record Type Id (18 chars) for the "Support Portal" record type on Support_Channel__c. When set, portal submissions use this record type and its page layout instead of the org default.
- `SUPPORT_SUBMISSION_WEBHOOK_URL` - Optional. Microsoft Teams incoming webhook URL; when set, a fire-and-forget notification (case + request type) is sent on each successful support submission. Failures never affect the user or the API response.

### Setting Up Environment Variables

1. **Local Development:**
   - Create a `.env.local` file in the project root
   - Add your environment variables:
     ```
     NEXT_PUBLIC_SITE_URL=https://your-site-url.com
     NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key
     ```

2. **Netlify Deployment:**
   - Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
   - Add `NEXT_PUBLIC_GEOAPIFY_API_KEY` with your Geoapify API key value
   - Add `NEXT_PUBLIC_SITE_URL` if you want to override the default Netlify URL
   - **Important:** Environment variables are automatically available to client-side code when prefixed with `NEXT_PUBLIC_`

### API Configuration Notes

- **Geoapify API:** The address autocomplete makes client-side API calls to `https://api.geoapify.com`
- **CORS:** No special configuration needed - Geoapify API supports CORS from any origin
- **Caching:** API responses are cached for 5 minutes to reduce API usage
- **Rate Limiting:** Minimum 4 characters required before API calls are made

## Deployment

Configured for Netlify deployment. See `netlify.toml` for build settings.

## Version

Current version: **1.18.1**

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.
