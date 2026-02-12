without changes please index and understand this codebase and read all md docs

my react codeing style:

for me i have one main principal..KISS which means keep it stupid simple. in a sense of how things are organized, coded, named, and desgined in general.

for example if I made a new route that was something like /About

so there would be a main parent component for the page route About.tsx that has something like this:

```
HeroProps<heroProps>= { title="Meet our Team" description="Welcome to clean code!"}
export const About = () => {
//parent level state only 
teamData = useState<TeamDataInterface>([]);
//parent hooks only 
{loadTeamData} = useAPICalls()
//on page load functions in use effect
useEffect = () => {
loadTeamData()
},[] //dep array empty for page load single trigger example 

return{
<div className='pageStyle'>
<HeroSection {...HeroProps}/>
<CompanyMotto/>
<TeamTable data={teamData}/>
</div>


}
}
```

notice how within there i only use what i need i dont have a bunch of state prop drilled down to my components becuase its not needed and hardly ever needed. and then each component is its own reusable functuional component that doesnt care about where it is or who its parent is - it jkust works exactly like its meant to as long as its given the right props or some dont need it at all. for example compant motto likely loads from a static text file but it shouldnt be raw html i would have the tsx clean and then i would import a const such as const MOTTO = "fyugewqgfbo8wyegfygq8 blah blah clean code" which would be in its own ts file under constants directoryt called MOTTO.ts that way everyhtign is clean and sepeareted becuase what if down the line we have 500 of these things fore different buisness areas etc i would rather them be int heir own file vs having giant files with 1000s of lines of code

that bring me to my pet peeve - i hate when i see files with excessive lines of code - if we are doign things correctly every function should be visible in a regualr sized screen - if oyu have to sroll 100s of lines in a function then its no good and shoudl be reworked smarter - same thing with components notrice how my actual component size is tiny - the tsx part is tiny and each of my functinal component will be small as well - this makes things very strait forward and easy to wrok with becuase if youre also naming things porperly and smartly then its easy to find what you need to work weith and if theres ever issues things are isolates to their owen files and are easy to work on which is why giant files are my pet peeve they are so hard to weork with and often cause many issues. i do know however there are some exceptions to this that cant be avoided and im fine with that but things like our main page routes parent componetns and reusuable ciomponents, types consts etc those should be organized properly - note this doesnt mean go overboard and sepretrate everything if things are clearly linked together then best practice is to keep them together and name the file so it makes sense

for naming conventiuons i use react best poractices so things lke components are alweays PascalCase and constants, true constants like a statis list are all caps like MY_LIST etc - hooks are usualy camelCase and so on - so r eact standard best practices

also for react/typescript make sure oyu use most revent 2025 and 2026 docs youll notice class components are basically depreciated and never used anymore for ui because we have functional and higherorder components that use arrow functions and no longer need to use classes with thier big overhead of extra code

state management is mixed right now - we have access to react built in of course and zustand so  we can use a mixture of both when needed for example some thnings might be state within the component for its own very specific things or changing with callbacks from context - things like user info once logged in and basic session info etc is going to be in context and for buisness areas and specific tools we might have them in both context but mostly stores - so we adapt as needed to use the best tool for the job for state

and we are using typescriupt so we need to actually USE typescript.. im talknig generics, extending interfaces all it that it has to offer because thats the whole purpose so shit yeah i like to have amazing type and interface defintioions and i like to keep them specific to what thjey should be requiring - i NEVER allow the use of any or unknown style typings

for tersting i havnt traditionally tested in the past but it weould be cool to make a transiton into having unit tests and potentialy test driven development but i am new to this and cant provide cursor insight so i havnt done it yet

for code review i like to make sure vital things are not updated and things should be specific for exmaple if doing a new feature the code pull requestr should only have updates specific to that feature.

if im approaching a new feature i get the latest and then i start from the ground up - i get the foundation such as parent components set up and then i get the bnuisness logic ironed out and tested so once thats all working i go and start the ui and each time i come accross something i have to duplicate a lot i ususally make a hook or component to replace it so i can just call that instead of duplicating all the time - sometimes i might need to add arguments to take to slightly customize the different scenarios but it will saves a lot of time and helps us organiuze

my refactoring style is a 'rip it out' ideology in a sense of i like to look at things we dont need and start ripping them out and testing to make sure everythting still works then i organize and clean up where the remaining code should be and then do the refactor when they are cleaned up and in their new locations

performance considerations this is very important to me.....we often have issues because devs or agents wont pay attention to react and how things render and when - we need to make usre we never cause unessisary rerenders and our state flow is smooth and always updates as needed and trhis application will be handling extremely large data dats and multiple users using this on diff machines so se really need to make sure our data and data flow is super smooth but more than that also our UI look and feel

tech stack required:

- react latest stable version
- nextjs latest stable version !!!!!!!! remove this part for zion !!!!!!!!!!!
- !!!!!!!!!!! remove for zion !!!! for creating new apps only or example the main tech we will be using is nextjs and rweact typescript so the very first aprt will be using npx xreate next app latest but using the period at the end . or for the name so it puts the contents into this folder instewad of creating a nested one
- typescript latest
- prime react
- prime flex
- prime icons
- date fns
- react hook form
- zustand (case by case basis)

my typical bad smell indicators:

- if files or methods are larger than 300 lines (there are exceptions to this when it makes sense such as css files and so on but tsx should be precise)
- a lot of html without use of functional components
- repeated code that is not turned into components or modularized
- calling apis or large data sets on rerender everytime instead of caching (this is important as espensive api calls or constant server calls causes perforamnce and high costs)
- if its hard to pinpoint the root cause, when tere are issues things should be easy to find and poinpoint, if we have giuant files with bad naming conventions and not organized it will be hard to locate what we need this is why following best practice structure is important

## Recommended Folder Structure

```
src/
├── components/           # Shared/reusable UI components
│   ├── common/          # Generic components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Header, Sidebar, Footer, etc.)
│   └── ui/              # UI-specific components (Modals, Dialogs, etc.)
│
├── features/            # Feature-based modules (optional, for large apps)
│   ├── auth/
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/       # Auth-specific hooks
│   │   ├── services/    # Auth services
│   │   └── types/       # Auth types
│   ├── dashboard/
│   └── settings/
│
├── pages/               # Page-level components (route components)
│   ├── Home/
│   │   ├── Home.tsx
│   │   ├── Home.test.tsx
│   │   └── Home.module.scss
│   ├── About/
│   └── Dashboard/
│
├── hooks/               # Shared custom hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── useLocalStorage.ts
│
├── services/            # Business logic and API services
│   ├── api/             # API clients and endpoints
│   │   ├── apiClient.ts
│   │   ├── endpoints/
│   │   └── types/
│   ├── auth/            # Authentication services
│   └── storage/         # Storage services
│
├── stores/              # State management (Zustand, Redux, etc.)
│   ├── authStore.ts
│   ├── userStore.ts
│   └── appStore.ts
│
├── types/               # TypeScript type definitions
│   ├── api/             # API-related types
│   ├── common/          # Shared types
│   └── index.ts         # Re-export all types
│
├── utils/               # Utility functions and helpers
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── helpers.ts
│
├── config/             # Configuration files
│   ├── environment.ts
│   └── routes.ts
│
├── assets/             # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/             # Global styles
│   ├── variables.scss
│   ├── mixins.scss
│   └── global.scss
│
├── middleware/         # Request/response middleware
│
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── vite.config.ts      # Build configuration
```

---

## Detailed Guidelines

### Components Organization

**Structure:**

```
components/
├── common/              # Truly reusable, domain-agnostic components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.module.scss
│   │   └── index.ts
│   ├── Input/
│   └── Card/
│
├── layout/              # Layout-specific components
│   ├── Header/
│   ├── Sidebar/
│   └── Footer/
│
└── ui/                  # Complex UI components
    ├── Modal/
    ├── Dialog/
    └── DataTable/
```

**Best Practices:**

- One component per folder
- Co-locate related files (component, test, styles)
- Use `index.ts` for clean imports
- Keep components small and focused (250-300 lines max)

---

### Features Organization (Optional)

**When to use:**

- Large applications with distinct feature domains
- Features that are self-contained with their own components, hooks, services

**Structure:**

```
features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── authService.ts
│   ├── types/
│   │   └── auth.types.ts
│   └── utils/
│       └── authHelpers.ts
│
└── dashboard/
    ├── components/
    ├── hooks/
    └── services/
```

**Alternative:** For smaller apps, keep features in `pages/` or `components/` with clear naming

---

### Hooks Organization

**Structure:**

```
hooks/
├── useAuth.ts           # Authentication hook
├── useApi.ts            # API data fetching hook
├── useLocalStorage.ts   # Local storage hook
├── useDebounce.ts       # Debounce utility hook
└── index.ts             # Re-export all hooks
```

**Best Practices:**

- One hook per file
- Use `use` prefix for custom hooks
- Keep hooks focused on single responsibility
- Co-locate hook with feature if feature-specific

---

### Services Organization

**Structure:**

```
services/
├── api/
│   ├── apiClient.ts     # Base API client
│   ├── apiRegistry.ts   # API endpoint registry
│   ├── endpoints/       # Endpoint-specific clients
│   │   ├── userApi.ts
│   │   └── productApi.ts
│   └── types/           # API-related types
│       └── responses.ts
│
├── auth/
│   ├── authService.ts
│   └── tokenService.ts
│
└── storage/
    ├── localStorage.ts
    └── sessionStorage.ts
```

**Best Practices:**

- Group by domain/functionality
- Keep services focused and testable
- Use interfaces for service contracts
- Separate API clients from business logic

---

### Types Organization

**Structure:**

```
types/
├── api/                 # API-related types
│   ├── requests.ts
│   ├── responses.ts
│   └── endpoints.ts
│
├── common/              # Shared types
│   ├── user.ts
│   └── common.ts
│
├── components/          # Component prop types
│   └── index.ts
│
└── index.ts             # Re-export all types
```

**Best Practices:**

- Group by domain/concern
- Use descriptive names
- Re-export from index files for clean imports
- Keep types close to where they're used when feature-specific

---

### Utils Organization

**Structure:**

```
utils/
├── formatters.ts        # Data formatting functions
├── validators.ts        # Validation functions
├── constants.ts         # Application constants
├── helpers.ts           # General helper functions
└── dateUtils.ts         # Date-specific utilities
```

**Best Practices:**

- Group by functionality
- Keep functions pure and testable
- Use descriptive function names
- Avoid business logic in utils (use services)

---

### Stores Organization

**Structure:**

```
stores/
├── authStore.ts         # Authentication state
├── userStore.ts         # User data state
├── appStore.ts          # Application-wide state
└── featureStore.ts      # Feature-specific state
```

**Best Practices:**

- One store per domain/feature
- Keep stores focused (250-300 lines max)
- Use TypeScript for type safety
- Separate concerns (auth, user, UI state)

---

## File Naming Conventions

### Components

- **PascalCase** for component files: `Button.tsx`, `UserProfile.tsx`
- **PascalCase** for component names: `export const Button = () => {}`
- Co-locate related files: `Button.tsx`, `Button.test.tsx`, `Button.module.scss`

### Hooks

- **camelCase** with `use` prefix: `useAuth.ts`, `useLocalStorage.ts`
- Hook name matches file name: `export const useAuth = () => {}`

### Services

- **camelCase** with descriptive suffix: `authService.ts`, `apiClient.ts`
- Class or function name matches file: `export class AuthService {}`

### Types

- **camelCase** with `.types.ts` suffix (optional): `user.types.ts`, `api.types.ts`
- Or just descriptive name: `User.ts`, `ApiResponse.ts`

### Utils

- **camelCase** with descriptive name: `formatters.ts`, `validators.ts`
- Group related functions in same file

### Constants

- **UPPER_SNAKE_CASE** for constant values: `export const MAX_RETRIES = 3`
- **camelCase** for constant objects: `export const apiEndpoints = {}`

---

## Import Organization

### Import Order

1. External dependencies (React, libraries)
2. Internal absolute imports (@/components, @/hooks)
3. Relative imports (./Component, ../utils)
4. Types (type imports)

### Example

```typescript
// External
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

// Internal absolute
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';

// Relative
import { formatDate } from './utils/formatters';
import type { User } from './types';
```

---

## Component Structure Template

```typescript
// Component.tsx
import React from 'react';
import type { ComponentProps } from './types';

interface ComponentProps {
  // Props definition
}

/**
 * Component description
 * 
 * @param props - Component props
 */
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

---

## Best Practices Summary

### ✅ Do

- Keep files small (250-300 lines max)
- Use feature-based organization for large apps
- Co-locate related files (component + test + styles)
- Use index files for clean imports
- Group by domain/concern
- Use TypeScript for type safety
- Follow consistent naming conventions
- Separate concerns (components, hooks, services, types)

### ❌ Don't

- Over-organize (don't create folders for 1-2 files)
- Mix concerns (don't put business logic in components)
- Create deep nesting (max 3-4 levels)
- Use `any` or `unknown` types
- Create giant files (we usually split when it starts to hit > 300 lines)
- Duplicate code (extract to shared utilities, components, hooks, api calls or their respective category) for exmaple if im using the same html code to make a card with specific conetent or layout then i should make a functional component so i can just reuse it and pass props for the stuff that needs to change so im not remaking code constantly and it makes it easier to change and debug in future
- Mix naming conventions stay specific to best practices shared between react and nextjs

---

## Scaling Considerations

### Small Projects (< 20 components)

- Keep everything in `components/`, `hooks/`, `services/`
- No need for feature folders

### Medium Projects (20-50 components)

- Start organizing by domain in `components/`
- Consider feature folders for distinct domains

### Large Projects (50+ components)

- Use feature-based organization
- Split stores by domain
- Consider micro-frontends for very large apps

---

## TypeScript-Specific Guidelines

### Type Organization

- Keep types close to usage when feature-specific
- Use shared types folder for common types
- Re-export from index files

### Type Safety

- Never use `any` or `unknown` (use proper types)
- Use generics for reusable types
- Extend interfaces when appropriate for exmaple prime react components all have types we can import like ButtonProps which we can use to extend when we have wrappers or functional components that are or use buttons and this is the same for all prime react component - every single one has a prop interface or type or can import and extend
- Use type guards for runtime checks
- organize types intheo their own respective files in their own library for exmaple just how we have /components we shgould have /types with similarly organized type files like DashboardModel and then we can start have files for specific categoriwes and put the related ones with in the smae file if it should be or in another file specicially named however we can still export thema ll from types with index.ts if this isnt seen as bad
- make sure to enforce our rules with linter

extra notes:

- notice how in libraries like components istead of exporting from its childen folders and components i use a heirarchal index.ts that exports all from the children below it - that way when we import anyhting form components we can only use @components for the import anstead of things like @components/input/button - this is considered our stard for all main libraries like components or hooks or utils etc
- versionand and change control andw documentation:
- always update changelog as you make code changes
- always update outdated documentation if it exists
- any cursor specific files and folders can go in a special foldert that the contents arte git ignroed for CorsorDev
- read me must be accurate to the appliction and dev facing
- when creating commits we should also have a changelog entry for it which uses version nmumber from our package json for example if we have @package.json with version 0.1.0 but as updates are amde and as changelog entries are masde each update/entry will increase the verisoning by 1 and maxes at 9 so if i had 0.9.9 and i incremented by .0.1 then it would be 1.0.0 and we increment minor versions 0.0.1 with small changes and medium chxanged 0.1.0 and then trry our best ott save major 1.0.0 for release opr prod ready but is not required

one thing when using a component more then once but forced to like looping through to make a card list this is my preferred approach:
in the parent or compoent that needs it we use something like `<CardListView data={CARD_LIST}/>`

which shoud just have something like

 map((dashboard)=> return <Card title={dashboard.title} .../>)

this imakes it faster to edit the content and preps it for future json and api to work perfectrly with all data that can send jsopn

the CARD_LIST would be something like a ts file in our constants folder:

type CardList = {id:UUID;title:string; descirption:string; route:'/onClickGoToThisRoute'}
export const CARD_LIST = [
{id:UUID;title:this is a title; descirption:my desc; route:'/onClickGoToThisRoute'},
]

again no changes just preapre to make some at my command
