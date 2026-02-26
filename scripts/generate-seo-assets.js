#!/usr/bin/env node
/**
 * Generate favicon, app icons, and OG images from the CPT star logo.
 * Uses sharp (already a project dependency) to render SVG → PNG at various sizes.
 *
 * Usage: node scripts/generate-seo-assets.js
 * Output: public/favicon.ico, public/icon.png, public/apple-icon.png
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC = path.resolve(__dirname, '..', 'public');

// CPT star on a dark-blue rounded-rect background — used for favicon + app icons.
// The star polygon is taken directly from CPTGroupLogo.svg, translated so it's
// centered in a 512×512 canvas with padding.
function iconSvg(size) {
  // Original star bounding box: roughly x 426..572, y 3.8..153 → ~146 wide, ~150 tall
  // Center it in a square with padding
  const pad = size * 0.12;
  const inner = size - pad * 2;
  // Scale star to fit inner area
  const starW = 145.04;
  const starH = 149.32;
  const scale = Math.min(inner / starW, inner / starH);
  const tx = (size - starW * scale) / 2 - 426.59 * scale;
  const ty = (size - starH * scale) / 2 - 3.8 * scale;
  const r = size * 0.18; // corner radius

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="rg" cx="499.11" cy="78.46" fx="478.77" fy="153.81" r="78.05" gradientUnits="userSpaceOnUse" gradientTransform="translate(${tx},${ty}) scale(${scale})">
      <stop offset="0" stop-color="#7edcfa"/>
      <stop offset=".4" stop-color="#4db8e0"/>
      <stop offset=".75" stop-color="#37a2d1"/>
      <stop offset="1" stop-color="#2b8bb8"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#0c1f3a"/>
  <polygon points="512.43 108.93 475.94 153.12 479.89 95.95 426.59 74.9 482.19 60.99 485.73 3.8 516.14 52.37 571.63 38.07 534.83 82 512.43 108.93"
    fill="url(#rg)" transform="translate(${tx},${ty}) scale(${scale})"/>
</svg>`);
}

async function generateIcons() {
  // icon.png – 192×192 (general purpose / PWA)
  await sharp(iconSvg(512)).resize(192).png().toFile(path.join(PUBLIC, 'icon.png'));
  console.log('  icon.png (192x192)');

  // apple-icon.png – 180×180
  await sharp(iconSvg(512)).resize(180).png().toFile(path.join(PUBLIC, 'apple-icon.png'));
  console.log('  apple-icon.png (180x180)');

  // favicon.ico – 32×32 PNG (modern browsers accept PNG favicons)
  await sharp(iconSvg(512)).resize(32).png().toFile(path.join(PUBLIC, 'favicon.ico'));
  console.log('  favicon.ico (32x32)');
}

// OG image: 1200×630, dark blue background, "CPT" letters + star + tagline
function ogSvg() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="rg" cx="499.11" cy="78.46" fx="478.77" fy="153.81" r="78.05" gradientUnits="userSpaceOnUse" gradientTransform="translate(-370, 155) scale(1.1)">
      <stop offset="0" stop-color="#37a2d1"/>
      <stop offset=".21" stop-color="#256b92"/>
      <stop offset=".4" stop-color="#184261"/>
      <stop offset=".55" stop-color="#102844"/>
      <stop offset=".63" stop-color="#0d1f39"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0a1420"/>
      <stop offset="1" stop-color="#1a2d44"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle border -->
  <rect x="24" y="24" width="1152" height="582" rx="16" ry="16" fill="none" stroke="#2d4a66" stroke-width="1"/>

  <!-- Star (scaled and positioned at left-center) -->
  <polygon points="512.43 108.93 475.94 153.12 479.89 95.95 426.59 74.9 482.19 60.99 485.73 3.8 516.14 52.37 571.63 38.07 534.83 82 512.43 108.93"
    fill="url(#rg)" transform="translate(-325, 195) scale(1.1)" opacity="0.6"/>

  <!-- CPT GROUP text -->
  <text x="600" y="260" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="800" font-size="96" fill="#ffffff" letter-spacing="6">CPT Group</text>

  <!-- Divider line -->
  <line x1="420" y1="300" x2="780" y2="300" stroke="#37a2d1" stroke-width="2" opacity="0.6"/>

  <!-- Tagline -->
  <text x="600" y="355" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="400" font-size="36" fill="#94a3b8">Support Portal</text>

  <!-- Subtitle -->
  <text x="600" y="415" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="300" font-size="24" fill="#64748b">Class Member Support Center</text>

  <!-- Bottom accent -->
  <rect x="480" y="580" width="240" height="3" rx="2" fill="#37a2d1" opacity="0.4"/>
</svg>`);
}

async function generateOgImages() {
  const ogBuffer = await sharp(ogSvg()).png().toBuffer();
  await fs.promises.writeFile(path.join(PUBLIC, 'opengraph-image.png'), ogBuffer);
  console.log('  opengraph-image.png (1200x630)');

  // Twitter uses the same image
  await fs.promises.writeFile(path.join(PUBLIC, 'twitter-image.png'), ogBuffer);
  console.log('  twitter-image.png (1200x630)');
}

async function main() {
  console.log('Generating SEO assets...');
  console.log('\nIcons:');
  await generateIcons();
  console.log('\nOG/Twitter images:');
  await generateOgImages();
  console.log('\nDone!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
