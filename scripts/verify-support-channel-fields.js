/**
 * Verifies that Support_Channel__c has all portal fields createable so submissions save correctly.
 * Run from repo root. Requires: sf CLI, org logged in (or pass -o org).
 * Usage: node scripts/verify-support-channel-fields.js
 *        node scripts/verify-support-channel-fields.js --org kyle@cptgroup.com
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Must match PORTAL_TO_SF_FIELD in src/app/api/support-request/route.ts
const PORTAL_TO_SF_FIELD = {
  reason: 'Website_Detail_Summary__c',
  description: 'Website_Detail_Summary__c',
  email: 'Email__c',
  contact_email: 'Email__c',
  phone: 'Phone__c',
  caseEmail: 'Case_Email__c',
  casePhone: 'Case_Phone__c',
  address: 'Address__c',
  caseCaseID: 'Case_No__c',
  caseId: 'Case_No__c',
  requestTypeLabels: 'Request_Type__c',
  requestTypes: 'Request_Type__c',
  firstName: 'First_Name__c',
  lastName: 'Last_Name__c',
  cptId: 'CPT_ID__c',
  previousAddress: 'Previous_Address__c',
  newAddress: 'New_Address__c',
  previousName: 'Previous_Name__c',
  newName: 'New_Name__c',
  ssnTaxId: 'SSN_Tax_ID__c',
  beneficiaryName: 'Beneficiary_Name__c',
  beneficiaryAddress: 'Beneficiary_Address__c',
  beneficiaryEmail: 'Beneficiary_Email__c',
  additionalDescription: 'Additional_Description__c',
};

const requiredSfFields = [...new Set(Object.values(PORTAL_TO_SF_FIELD))];
// OwnerId and Project__c are set by the API, not from body
const requiredFromBody = requiredSfFields.filter(
  (f) => f !== 'OwnerId' && f !== 'Project__c'
);

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const args = process.argv.slice(2);
  const orgIndex = args.indexOf('--org');
  const org = orgIndex >= 0 && args[orgIndex + 1] ? args[orgIndex + 1] : null;

  let cmd;
  if (process.platform === 'win32') {
    const sfPath = 'C:\\Program Files\\sf\\bin\\sf.cmd';
    if (fs.existsSync(sfPath)) {
      cmd = `"${sfPath}" sobject describe --sobject Support_Channel__c --json${org ? ` -o ${org}` : ''}`;
    } else {
      cmd = `sf sobject describe --sobject Support_Channel__c --json${org ? ` -o ${org}` : ''}`;
    }
  } else {
    cmd = `sf sobject describe --sobject Support_Channel__c --json${org ? ` -o ${org}` : ''}`;
  }

  let raw;
  try {
    raw = execSync(cmd, {
      encoding: 'utf8',
      cwd: repoRoot,
      shell: true,
    });
  } catch (e) {
    console.error('Failed to run Salesforce describe. Is sf CLI installed and org logged in?');
    console.error('  Try: sf org login web   or add --org your@email.com');
    process.exit(1);
  }

  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    console.error('Invalid JSON from sf sobject describe');
    process.exit(1);
  }

  const fields = (result.result && result.result.fields) || result.fields || [];
  const allFieldNames = new Set(fields.map((f) => f.name));
  const createableNames = new Set(
    fields.filter((f) => f.createable !== false).map((f) => f.name)
  );

  const missing = requiredFromBody.filter((name) => !createableNames.has(name));
  if (missing.length > 0) {
    console.error('Support_Channel__c is missing these createable fields:');
    missing.forEach((m) => console.error('  -', m));
    const existButNotCreateable = missing.filter((n) => allFieldNames.has(n));
    const doNotExist = missing.filter((n) => !allFieldNames.has(n));
    if (existButNotCreateable.length > 0) {
      console.error('');
      console.error('These fields EXIST in the org but are not createable (check Field-Level Security or formula):');
      existButNotCreateable.forEach((m) => console.error('  -', m));
    }
    if (doNotExist.length > 0) {
      console.error('');
      console.error('These fields do NOT exist yet (deploy salesforce-metadata first):');
      doNotExist.forEach((m) => console.error('  -', m));
    }
    process.exit(1);
  }

  console.log('OK: All', requiredFromBody.length, 'portal fields are createable on Support_Channel__c.');
  console.log('Submissions will save: Case Name, Case No, Email, Phone, Address, First/Last Name, CPT ID,');
  console.log('Previous/New Address & Name, SSN/Tax ID, Beneficiary*, Additional Description, Type, Reason.');
  process.exit(0);
}

main();
