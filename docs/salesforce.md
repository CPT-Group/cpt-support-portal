# Salesforce integration (Support Portal)

Support requests are created in Salesforce as **Support_Channel__c** records. This app uses OAuth2 (Authorization Code + PKCE) and stores tokens in `.sf_tokens.json` (dev). Secrets stay server-side.

## Setup

1. In `.env.local` set:
   - `SALESFORCE_CONSUMER_KEY` / `SALESFORCE_CONSUMER_SECRET` (from your Connected App)
   - **`SUPPORT_CHANNEL_DEFAULT_PROJECT_ID`** – required. Salesforce Project record Id (18 chars) for Support_Channel__c.Project__c. Get it from your org.
   - Optionally `SF_LOGIN_URL` (default `https://login.salesforce.com`), `SF_API_VERSION` (default `v60.0`).

2. In the Connected App, add callback URLs:
   - `http://localhost:3777/oauth/callback` (dev)
   - `https://cpt-support-portal.netlify.app/oauth/callback` (production)

3. Complete OAuth once (dev or first deploy): open **GET /oauth/start** in a browser, sign in to Salesforce, and land on the callback page. Tokens are saved to `.sf_tokens.json`.

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

## Form → Salesforce mapping

Payload is built in `src/utils/salesforcePayload.ts` from the normalized submission (reason → description, email → contact_email, case + request types → subject, etc.). The API route maps these to Support_Channel__c field API names; adjust `PORTAL_TO_SF_FIELD` in `src/app/api/support-request/route.ts` after running describe to match your org.
