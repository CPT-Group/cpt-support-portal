import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://cpt-support-portal.netlify.app';
const OUT_DIR = join(process.cwd(), 'screenshots');
mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // 1. Home page
  console.log('1. Home page...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUT_DIR, '01-home.png') });
  console.log('   done');

  // 2. Step 1 — Request type selection (empty state)
  console.log('2. Step 1 — Request type selection...');
  await page.goto(`${BASE_URL}/support-request`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT_DIR, '02-step1-request-types.png') });

  // Select only "Request Notice Packet" (no FAQ dialog, has address)
  await page.getByRole('option', { name: 'Request Notice Packet' }).click({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT_DIR, '02b-step1-types-selected.png') });
  console.log('   done');

  // 3. Step 2 — Case selection
  console.log('3. Step 2 — Case selection...');
  await page.locator('button').filter({ hasText: /Next/i }).first().click({ force: true });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: join(OUT_DIR, '03-step2-case-selection.png') });

  // Open dropdown
  try {
    await page.locator('.p-dropdown-trigger, .p-select-dropdown').first().click({ force: true, timeout: 5000 });
  } catch {
    await page.evaluate(() => {
      const el = document.querySelector('.p-dropdown, [data-pc-name="dropdown"], [class*="p-select"]');
      if (el) el.click();
    });
  }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUT_DIR, '03b-step2-case-dropdown.png') });

  // Select a named case (skip first couple which may be IDs)
  const items = page.locator('.p-dropdown-item, li[data-pc-section="item"], [role="option"]');
  const itemCount = await items.count();
  console.log(`   found ${itemCount} dropdown items`);
  if (itemCount > 2) {
    await items.nth(2).click({ force: true });
  } else if (itemCount > 0) {
    await items.nth(0).click({ force: true });
  }
  await page.waitForTimeout(1500);
  console.log('   done');

  // 4. Step 3 — Form fields
  console.log('4. Step 3 — Form fields...');
  await page.locator('button').filter({ hasText: /Next/i }).first().click({ force: true });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT_DIR, '04-step3-form-empty.png') });

  // Click "Enter address manually" to expand the manual address fields
  try {
    const manualLink = page.locator('text=Enter address manually').first();
    if (await manualLink.count() > 0) {
      await manualLink.click({ force: true });
      console.log('   clicked "Enter address manually"');
      await page.waitForTimeout(1000);
    }
  } catch {
    console.log('   no "Enter address manually" link found');
  }

  // Fill all visible fields
  await page.evaluate(() => {
    const nativeInputSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    const setVal = (input, val) => {
      nativeInputSetter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    document.querySelectorAll('input').forEach(input => {
      const id = (input.id || input.name || '').toLowerCase();
      const ph = (input.placeholder || '').toLowerCase();
      const type = input.type || '';
      if (input.type === 'hidden' || input.offsetParent === null) return;

      if (id.includes('firstname') || ph.includes('first')) setVal(input, 'Jane');
      else if (id.includes('lastname') || ph.includes('last')) setVal(input, 'Smith');
      else if (type === 'email' || id.includes('email') || ph.includes('email')) setVal(input, 'jane.smith@example.com');
      else if (type === 'tel' || id.includes('phone') || ph.includes('phone')) setVal(input, '(555) 123-4567');
      else if (id.includes('cptid') || id.includes('cpt') || ph.includes('cpt')) setVal(input, 'CPT-98765');
      else if (ph.includes('street')) setVal(input, '123 Main Street');
      else if (ph.includes('apartment') || ph.includes('suite')) setVal(input, 'Suite 200');
      else if (ph.includes('city')) setVal(input, 'Los Angeles');
      else if (ph.includes('zip') || ph.includes('postal')) setVal(input, '90001');
    });

    const nativeTASetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    ).set;
    document.querySelectorAll('textarea').forEach(ta => {
      if (ta.offsetParent === null) return;
      nativeTASetter.call(ta, 'Additional details for the support request.');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Select a state if the state dropdown is visible
  try {
    const stateDropdown = page.locator('[placeholder="Select State"]').first();
    if (await stateDropdown.count() > 0) {
      await stateDropdown.click({ force: true });
      await page.waitForTimeout(500);
      const caOption = page.locator('.p-dropdown-item, [role="option"]').filter({ hasText: 'California' }).first();
      if (await caOption.count() > 0) {
        await caOption.click({ force: true });
        console.log('   selected California');
      }
      await page.waitForTimeout(500);
    }
  } catch {
    console.log('   state dropdown not found');
  }

  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT_DIR, '04b-step3-form-filled.png') });

  // Scroll down for lower part of form
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT_DIR, '04c-step3-form-scrolled.png') });
  console.log('   done');

  // 5. FAQ page
  console.log('5. FAQ page...');
  await page.goto(`${BASE_URL}/faq`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUT_DIR, '05-faq.png') });
  console.log('   done');

  // 6. FAQ dialog (go back to step 1, select a type with FAQ)
  console.log('6. FAQ dialog...');
  await page.goto(`${BASE_URL}/support-request`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.getByRole('option', { name: 'Request Passcode' }).click({ force: true });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUT_DIR, '06-faq-dialog.png') });
  console.log('   done');

  await browser.close();
  console.log('\nAll screenshots saved to:', OUT_DIR);
})();
