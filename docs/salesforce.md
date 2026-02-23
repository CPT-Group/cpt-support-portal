# Salesforce integration (Support Portal)

Support requests are created in Salesforce as **Support_Channel__c** records. This app uses OAuth2 (Authorization Code + PKCE) and stores tokens in `.sf_tokens.json` (dev). Secrets stay server-side.

## Setup

1. In `.env.local` set:
   - `SALESFORCE_CONSUMER_KEY` / `SALESFORCE_CONSUMER_SECRET` (from your Connected App)
   - **`SUPPORT_CHANNEL_DEFAULT_PROJECT_ID`** – required. Salesforce **Support** project record Id (18 chars) for Support_Channel__c.Project__c. All support requests are created under this one project; create it once (see below).
   - Optionally `SF_LOGIN_URL` (default `https://login.salesforce.com`), `SF_API_VERSION` (default `v60.0`).

### Creating the Support project (one-time)

You need a single **Project__c** record to act as the Support bucket (call center / unified list). Create it to match the support portal’s expectations instead of reusing a case project.

**Option A – Salesforce CLI (recommended)**  
Requires [Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli) and an **authenticated org**. If interactive login is already done (you saw `Successfully authorized ... with org ID ...` in the terminal), the default org is set—go straight to step 2 below to create the Support project.

1. **Log in to an org first (required).** If you see “no default org” or “No auth information found”, use one of the following.

   **Interactive (browser):**
   ```bash
   sf org login web
   ```
   On Windows, if `sf` is not on PATH:
   ```powershell
   & "C:\Program Files\sf\bin\sf.cmd" org login web
   ```
   A browser opens; sign in to Salesforce and allow the CLI. After that, the create command will use this org.

   **When login succeeded:** The terminal shows green text like `Successfully authorized you@example.com with org ID 00DA0000000XxbfMAC`. The default org is now set for all `sf` commands (any terminal). You can proceed to step 2 (create the Support project); no need to log in again in another terminal.

   **Programmatic (no browser):** You can log in headlessly with the JWT flow so scripts or CI can run without a user. You need a Connected App with a certificate (upload the cert in the app, use the private key locally).

   ```bash
   sf org login jwt --client-id YOUR_CONSUMER_KEY --jwt-key-file path/to/server.key --username your-sf-username@example.com
   ```
   Use `--instance-url https://test.salesforce.com` for sandbox. See [Authorize an org using the JWT flow](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_jwt_flow.htm) for creating the cert and configuring the Connected App (certificate, OAuth scopes, and pre-authorized profile).

2. **Create the Support project** (use `-o` or `--target-org` if you have no default org):
   ```bash
   # Create a Project__c named "Support" and get its Id
   sf data create record --sobject Project__c --values "Name=Support" --json
   ```
   Or with a specific org:  
   `sf data create record --sobject Project__c --values "Name=Support" -o YourOrgAlias --json`

   The command prints JSON; the `result.id` is the new record Id. Copy it into `.env.local` as `SUPPORT_CHANNEL_DEFAULT_PROJECT_ID`.

3. **Windows (PATH not refreshed):** Call the CLI directly:  
   `& "C:\Program Files\sf\bin\sf.cmd" data create record --sobject Project__c --values "Name=Support" --json`

Scripts in this repo (optional; same idea):

- **Bash:** `./scripts/create-support-project.sh` or `./scripts/create-support-project.sh "My Support Project"`
- **PowerShell:** `./scripts/create-support-project.ps1` or `./scripts/create-support-project.ps1 -Name "My Support Project"`  
  The PowerShell script uses the full path `C:\Program Files\sf\bin\sf.cmd` when `sf` is not available, so it works before PATH is refreshed.

If your org has more required fields on Project__c, add them, e.g.  
`--values "Name=Support" "RecordTypeId=012..."` (check Setup → Object Manager → Project for required fields).

**Option B – Manual**  
Create a Project in Salesforce (e.g. Name = “Support”), then open **GET /api/sf/projects** in the browser and copy the Id of that record into `.env.local`.

**Troubleshooting**
- **“No default org” / “No auth information found”** – Run `sf org login web` (or the full-path version above). You must be logged in to an org before creating the record.
- **“sf is not recognized” (Windows)** – Use the full path: `& "C:\Program Files\sf\bin\sf.cmd"` for every command, or add `C:\Program Files\sf` to your user PATH and restart the terminal.

2. In the Connected App, add callback URLs:
   - `http://localhost:3777/oauth/callback` (dev)
   - `https://cpt-support-portal.netlify.app/oauth/callback` (production)

3. Complete OAuth once (dev or first deploy): open **GET /oauth/start** in a browser, sign in to Salesforce, and land on the callback page. Tokens are saved to `.sf_tokens.json`.

### Deploying to Netlify (or other serverless)

On serverless, the filesystem is ephemeral: `.sf_tokens.json` written during `/oauth/callback` is not available to later requests (or other instances), so `/api/sf/projects` and support submission would fail with “No Salesforce tokens found”.

**redirect_uri must match configuration:** If Salesforce returns this even though the URL is in the Connected App, set **`SF_OAUTH_BASE_URL`** in Netlify to your exact production URL (no trailing slash), e.g. `https://cpt-support-portal.netlify.app`. In the Connected App, Callback URL(s) must be exactly that plus `/oauth/callback` (no trailing slash).

**Fix (refresh token):** Complete OAuth once **locally** (or on deploy after setting SF_OAUTH_BASE_URL). Open `.sf_tokens.json` or the OAuth success page and copy the **`refresh_token`** value. In Netlify (or your host), add an **environment variable**:

- **`SF_REFRESH_TOKEN`** = the `refresh_token` value from `.sf_tokens.json`

Keep your existing env vars (`SALESFORCE_CONSUMER_KEY`, `SALESFORCE_CONSUMER_SECRET`, `SF_LOGIN_URL`, `SF_API_VERSION`, `SUPPORT_CHANNEL_DEFAULT_PROJECT_ID`). The app will use `SF_REFRESH_TOKEN` to obtain access tokens when the token file is missing, so the case list and support submissions work on deploy.

**Optional – Teams notification on submission**  
Set `SUPPORT_SUBMISSION_WEBHOOK_URL` (e.g. to a Teams channel Incoming Webhook URL) to post a short message to Teams on each successful support submission (case name + request type). The call is fire-and-forget; if the webhook fails, the user and API response are unaffected.

## Where to view submitted data in Salesforce

Portal submissions create **Support_Channel__c** records (not Project__c). To see them:

1. In the left navigation, click **Support Channel** (not "Projects").
2. You’ll see the list of support requests. Use the **Support_Requests** list view (or "Recently Viewed") and use **Select Fields to Display** (gear next to "Search this list...") to add columns like First Name, Last Name, Case Name, Type, etc.
3. Your new submission’s record ID is in the success page URL as `sfId=...`; you can search or open that ID in Support Channel to open the record.

**Projects** shows the **Support** project (the bucket); **Support Channel** shows each submitted support request and its form data.

## Routes

- **GET /oauth/start** – Redirects to Salesforce authorize.
- **GET /oauth/callback** – Exchanges code for tokens, saves to `.sf_tokens.json`.
- **GET /api/sf/describe/support-channel** – Returns Support_Channel__c createable/required fields.
- **GET /api/sf/projects** – Returns Project__c records as the **case list** (CaseOption shape). Source of truth for the support portal case dropdown; cached 5 min server-side.
- **POST /api/support-request** – Creates a Support_Channel__c record in the **Support project** (SUPPORT_CHANNEL_DEFAULT_PROJECT_ID). Body includes full submission; case identity (caseId = selected case’s SF Project Id, caseName, caseCaseID, caseProjectName) is sent for relations/filtering.

## Support_Channel__c schema (canonical describe)

The full Salesforce describe response for **Support_Channel__c** (sobject, label, createable, all fields, requiredFieldApiNames) is stored for reference at:

- **`docs/salesforce-support-channel-schema.json`**

Use it when updating the form → Salesforce mapping or the support-request API.

## Type__c picklist (request type)

Support_Channel__c **Type__c** is a restricted picklist. The portal sends request type **labels** (e.g. "Request Passcode"); the API resolves them to the org’s picklist **API value** before create so all 17 portal options work.

**For resolution to work**, the Type__c picklist in your org should use one of these:

- **Labels** that match the portal labels below (case-insensitive), or  
- **API values** that match the portal label (case-insensitive), or  
- **API values** that are the label with spaces replaced by underscores (e.g. `Request_Passcode`).

**Portal request type labels (all 17):**  
Request Notice Packet, Request Passcode, Update Mailing Address, Request Name Change, Deceased Class Member, Request to Be Added to Case, Respond to Dispute Notice, Respond to Deficient Notice, Respond to SSN/W9 Request, Request Check Reissue, Request Cashed Check Copy, Request Tax Forms, Request Fraud Affidavit Packet, Did you Receive my Response?, Have you Received my Supporting Documents?, What is my Settlement Amount?, When will I Receive my Settlement Payment?

If no value matches, Type__c is left blank (nillable) and the record still creates.

## Form → Salesforce mapping

Payload is built in `src/utils/salesforcePayload.ts` from the normalized submission (reason → description, email → contact_email, case + request types → subject, etc.). The API route maps these to Support_Channel__c field API names; adjust `PORTAL_TO_SF_FIELD` in `src/app/api/support-request/route.ts` after running describe to match your org.

**Everything you enter in the portal is stored in its own Support_Channel__c field.** Portal-only fields (First Name, Last Name, CPT ID, etc.) are defined in this repo and deployed via the Salesforce CLI so we don’t reuse unrelated org fields.

### Deploying portal fields (one-time per org)

The repo defines custom fields for the portal form. Deploy them with the CLI so the API can write to them:

1. **Log in to your org** (if needed): `sf org login web`
2. **Deploy the fields:**
   - **PowerShell:** `.\scripts\deploy-support-channel-fields.ps1` (or add `-TargetOrg myalias`)
   - **Bash:** `./scripts/deploy-support-channel-fields.sh` (or add `-o myalias`)

This runs `sf project deploy start` on **`salesforce-metadata/force-app`**, which contains field metadata for **Support_Channel__c** under `objects/Support_Channel__c/fields/`. After deploy, each portal field has its own column; no mapping to “other” fields (e.g. Activation Request Notes) is used.

**Fields created by the deploy:** First_Name__c, Last_Name__c, CPT_ID__c, Previous_Address__c, New_Address__c, Previous_Name__c, New_Name__c, SSN_Tax_ID__c, Beneficiary_Name__c, Beneficiary_Address__c, Beneficiary_Email__c, Additional_Description__c.

### Verifying that submissions will save all data

Run the verification script to confirm Support_Channel__c has every portal field createable (so POST /api/support-request can save them):

- **Node:** `node scripts/verify-support-channel-fields.js` (or `node scripts/verify-support-channel-fields.js --org kyle@cptgroup.com` if no default org)

Requires Salesforce CLI and an authenticated org. The script runs `sf sobject describe` and checks that all fields in `PORTAL_TO_SF_FIELD` are createable. If any are missing, deploy the portal fields first (see above). The API only sends fields that are createable, so submissions still succeed even when some fields are missing; data for missing fields is just not stored until you deploy.

**Why are fields “not createable”?** The script now distinguishes:

- **Field exists but not createable** → Usually **Field-Level Security (FLS)** or a **formula/read-only** field. In Setup → Object Manager → Support Channel → Fields → [field], ensure the profile (or permission set) used by the user who authenticated the portal (OAuth) has **Edit** access. If the field is a formula, create a new text field for the portal and map to that instead.
- **Field does not exist** → The metadata deploy did not create it. Re-run `.\scripts\deploy-support-channel-fields.ps1 -TargetOrg your@email.com` and check for errors; or create the field manually in Setup. If Support_Channel__c is from a managed package, you may not be able to add custom fields via deploy—create them in Setup instead.

### Portal → Support_Channel__c mapping

| Portal field | Support_Channel__c (API name) |
|--------------|-------------------------------|
| Case (matter) name | Case_Name__c |
| Case/project Id | Case_No__c |
| Email | Case_Email__c |
| Phone | Case_Phone__c |
| Address | Address__c |
| Reason/description | Website_Detail_Summary__c |
| Request type(s) | Type__c |
| First name | First_Name__c *(portal fields, deploy above)* |
| Last name | Last_Name__c |
| CPT ID | CPT_ID__c |
| Previous address | Previous_Address__c |
| New address | New_Address__c |
| Previous name | Previous_Name__c |
| New name | New_Name__c |
| SSN/Tax ID | SSN_Tax_ID__c |
| Beneficiary name/address/email | Beneficiary_Name__c, Beneficiary_Address__c, Beneficiary_Email__c |
| Additional description | Additional_Description__c |

File uploads (supporting documentation) are not sent to Salesforce; only form text is.

## List view columns (Support Requests)

The list view has **API name `Support_Requests`** (URL: `filterName=Support_Requests`). After deploying the portal fields, click the **gear icon** next to "Search this list..." → **Select Fields to Display** and add any of the columns above. Each portal field is its own column (First Name, Last Name, Case Email, Case Phone, Address, Website Detail Summary, Type, CPT ID, Previous/New Address, etc.).
