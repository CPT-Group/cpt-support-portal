# CPT Prime React Theme Diagnostic

## Current Issue
The CSS theme file `@cpt-group/cpt-prime-react/cpt/light-theme.css` cannot be resolved.

## Package Configuration Analysis

### ✅ What's Working
1. **Package version**: 1.9.1 is installed
2. **Exports configured**: `package.json` has the correct export mapping:
   ```json
   "./cpt/*": {
     "default": "./dist/cpt/*.css"
   }
   ```
3. **Build script exists**: `build:copy-css` should copy CSS files from `src/cpt` to `dist/cpt`

### ❌ What's Missing
1. **CSS files don't exist** in `node_modules/@cpt-group/cpt-prime-react/dist/cpt/`
2. **Source files may not exist** in `src/cpt/` in the CPT package repository

## How PrimeReact Does It

Based on [PrimeReact theming documentation](https://primereact.org/theming/), PrimeReact:
1. Stores themes in `resources/themes/[theme-name]/theme.css`
2. These files are included in the npm package
3. Imported via: `import 'primereact/resources/themes/soho-dark/theme.css'`

## Steps to Fix in CPT Package

### 1. Create the CSS File
In the `cpt-prime-react` repository, create:
```
src/cpt/light-theme.css
src/cpt/dark-theme.css  (if needed)
```

### 2. Verify Build Script
The `build:copy-css` script should:
- Copy all `.css` files from `src/cpt/` to `dist/cpt/`
- Copy all `.css` files from `src/themes/` to `dist/themes/`

Current script:
```javascript
"build:copy-css": "node -e \"const fs=require('fs');const path=require('path');[['src/cpt','dist/cpt'],['src/themes','dist/themes']].forEach(([src,dist])=>{fs.mkdirSync(dist,{recursive:true});fs.readdirSync(src).filter(f=>f.endsWith('.css')).forEach(f=>fs.copyFileSync(path.join(src,f),path.join(dist,f)))})\""
```

### 3. Verify Package Files
The `package.json` `files` array should include the dist folder (which it does):
```json
"files": [
  "dist",
  "docs",
  "README.md",
  "CHANGELOG.md"
]
```

### 4. Rebuild and Publish
1. Run `npm run build` in the CPT package (this should run `build:copy-css`)
2. Verify `dist/cpt/light-theme.css` exists
3. Run `npm publish` (or `npm publish --dry-run` to test)

### 5. Test Import
After republishing, in this project:
1. Run `npm install @cpt-group/cpt-prime-react@latest`
2. Verify file exists: `node_modules/@cpt-group/cpt-prime-react/dist/cpt/light-theme.css`
3. The import should work: `import '@cpt-group/cpt-prime-react/cpt/light-theme.css'`

## Alternative: Check if Files Exist in Different Location

If the CSS files exist but in a different location, we may need to adjust the export path. Check:
- `node_modules/@cpt-group/cpt-prime-react/src/cpt/` (source)
- `node_modules/@cpt-group/cpt-prime-react/dist/cpt/` (built)
- `node_modules/@cpt-group/cpt-prime-react/themes/` (if using themes path)

## Current Import (Ready to Use)

Once the CSS file is available in the package, this import will work:
```typescript
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
```

The import is already uncommented in `src/providers/PrimeReactProvider.tsx` and will work once the file exists in the published package.

