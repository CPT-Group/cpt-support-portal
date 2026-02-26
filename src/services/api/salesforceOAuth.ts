/**
 * Salesforce auth: OAuth2 (PKCE + refresh) or JWT Bearer.
 * Support Portal: /oauth/start, /oauth/callback, token file .sf_tokens.json, POST support-request.
 *
 * Token priority: (1) JWT if SF_JWT_PRIVATE_KEY + SF_USERNAME set — no OAuth, same on local & Netlify.
 * (2) SF_REFRESH_TOKEN env. (3) .sf_tokens.json file.
 */

import { createHash, randomBytes, createSign } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SF_API_VERSION = process.env.SF_API_VERSION || 'v60.0';
const TOKEN_FILE = '.sf_tokens.json';

function getClientId(): string {
  const id =
    process.env.SF_CLIENT_ID?.trim() ||
    process.env.SALESFORCE_CONSUMER_KEY?.trim();
  if (!id) {
    throw new Error(
      'SF_CLIENT_ID (or SALESFORCE_CONSUMER_KEY) is required for Salesforce auth'
    );
  }
  return id;
}

function getClientCreds(): { clientId: string; clientSecret: string } {
  const clientId = getClientId();
  const clientSecret =
    process.env.SF_CLIENT_SECRET?.trim() ||
    process.env.SALESFORCE_CONSUMER_SECRET?.trim();
  if (!clientSecret) {
    throw new Error(
      'SF_CLIENT_SECRET (or SALESFORCE_CONSUMER_SECRET) is required for OAuth/refresh. For JWT-only, set SF_JWT_PRIVATE_KEY and SF_USERNAME instead.'
    );
  }
  return { clientId, clientSecret };
}

export function getLoginUrl(): string {
  return (process.env.SF_LOGIN_URL || 'https://login.salesforce.com').replace(
    /\/$/,
    ''
  );
}

/** Normalize base URL (no trailing slash). Use when building redirect_uri. */
function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, '');
}

export function getRedirectUri(origin: string): string {
  return `${normalizeBaseUrl(origin)}/oauth/callback`;
}

/**
 * Origin/base URL used for OAuth redirect_uri. When set (e.g. on Netlify), use this instead of
 * request.url so the callback URL matches Salesforce Connected App exactly.
 * Example: SF_OAUTH_BASE_URL=https://cpt-support-portal.netlify.app
 */
export function getOAuthOrigin(requestOrigin: string): string {
  const envOrigin = process.env.SF_OAUTH_BASE_URL?.trim();
  return envOrigin ? normalizeBaseUrl(envOrigin) : normalizeBaseUrl(requestOrigin);
}

export function generatePKCE(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  return { codeVerifier, codeChallenge };
}

export function generateState(): string {
  return randomBytes(16).toString('base64url');
}

export function buildAuthorizeUrl(
  origin: string,
  state: string,
  codeChallenge: string
): string {
  const { clientId } = getClientCreds();
  const loginUrl = getLoginUrl();
  const redirectUri = getRedirectUri(origin);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    scope: 'api refresh_token',
  });
  return `${loginUrl}/services/oauth2/authorize?${params.toString()}`;
}

export interface StoredTokens {
  access_token: string;
  instance_url: string;
  refresh_token?: string;
  issued_at?: number;
}

/** In-memory cache for tokens (JWT or refresh env) */
let cachedTokensFromEnv: StoredTokens | null = null;

/** In-memory cache for JWT-issued tokens (reused until near expiry) */
let cachedJwtTokens: StoredTokens | null = null;

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<StoredTokens> {
  const { clientId, clientSecret } = getClientCreds();
  const loginUrl = getLoginUrl();

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
    code_verifier: codeVerifier,
  });

  const res = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = `Salesforce token exchange error ${res.status}: ${res.statusText}`;
    try {
      const err = JSON.parse(text);
      if (err.error_description) msg = err.error_description;
    } catch {
      if (text) msg += ` - ${text.slice(0, 200)}`;
    }
    throw new Error(msg);
  }

  const data = (await res.json()) as {
    access_token: string;
    instance_url: string;
    refresh_token?: string;
    issued_at?: string;
  };

  const tokens: StoredTokens = {
    access_token: data.access_token,
    instance_url: data.instance_url.replace(/\/$/, ''),
    refresh_token: data.refresh_token,
    issued_at: data.issued_at ? parseInt(data.issued_at, 10) : undefined,
  };

  try {
    const projectRoot = process.cwd();
    const tokenPath = join(projectRoot, TOKEN_FILE);
    writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log('[SF OAuth] Tokens saved to', tokenPath, 'instance_url:', tokens.instance_url);
  } catch (err) {
    // Serverless (e.g. Netlify) often has read-only fs; tokens still returned so callback can show refresh_token for env
    console.warn('[SF OAuth] Could not write token file (e.g. serverless):', err);
  }

  return tokens;
}

export function readStoredTokens(): StoredTokens {
  const projectRoot = process.cwd();
  const tokenPath = join(projectRoot, TOKEN_FILE);
  if (!existsSync(tokenPath)) {
    throw new Error(
      'No Salesforce tokens found. Complete OAuth flow: GET /oauth/start then /oauth/callback'
    );
  }
  const raw = readFileSync(tokenPath, 'utf8');
  const data = JSON.parse(raw) as StoredTokens;
  if (!data.access_token || !data.instance_url) {
    throw new Error('Invalid .sf_tokens.json: missing access_token or instance_url');
  }
  return data;
}

/**
 * Use a refresh_token to obtain a new access_token from Salesforce.
 * Works for both local dev (.sf_tokens.json) and serverless (SF_REFRESH_TOKEN env).
 */
async function refreshAccessToken(refreshToken: string): Promise<StoredTokens> {
  const { clientId, clientSecret } = getClientCreds();
  const loginUrl = getLoginUrl();
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });
  const res = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = `Salesforce refresh_token error ${res.status}: ${res.statusText}`;
    try {
      const err = JSON.parse(text);
      if (err.error_description) msg = err.error_description;
    } catch {
      if (text) msg += ` - ${text.slice(0, 200)}`;
    }
    throw new Error(msg);
  }
  const data = (await res.json()) as {
    access_token: string;
    instance_url: string;
    issued_at?: string;
  };
  const tokens: StoredTokens = {
    access_token: data.access_token,
    instance_url: data.instance_url.replace(/\/$/, ''),
    refresh_token: refreshToken,
    issued_at: data.issued_at ? parseInt(data.issued_at, 10) : Date.now(),
  };
  return tokens;
}

/** Persist refreshed tokens to disk (best-effort; serverless may be read-only). */
function saveTokensToFile(tokens: StoredTokens): void {
  try {
    const tokenPath = join(process.cwd(), TOKEN_FILE);
    writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf8');
    console.log('[SF OAuth] Refreshed tokens saved to', tokenPath);
  } catch {
    // Serverless (e.g. Netlify) often has read-only fs
  }
}

/**
 * Refresh access token using SF_REFRESH_TOKEN env (for serverless where .sf_tokens.json is not persistent).
 * Result is cached in memory for the current process to avoid refreshing on every API call.
 *
 * Important: Salesforce issues a different refresh_token per redirect_uri. The token from
 * localhost OAuth cannot be used on Netlify, and vice versa. For production, do OAuth once
 * on the production URL (e.g. https://your-site.netlify.app/oauth/start) and set
 * SF_REFRESH_TOKEN to that token.
 */
async function refreshTokensFromEnv(): Promise<StoredTokens> {
  if (cachedTokensFromEnv) return cachedTokensFromEnv;
  const refreshToken = process.env.SF_REFRESH_TOKEN?.trim();
  if (!refreshToken) {
    throw new Error(
      'SF_REFRESH_TOKEN is not set. For production (Netlify): open your production URL/oauth/start, complete OAuth, copy the refresh_token from the success page into Netlify env. For local: use .sf_tokens.json or set SF_REFRESH_TOKEN from a localhost OAuth.'
    );
  }
  try {
    const tokens = await refreshAccessToken(refreshToken);
    cachedTokensFromEnv = tokens;
    return tokens;
  } catch (err) {
    const sfMsg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `${sfMsg} For production (Netlify), SF_REFRESH_TOKEN must be the refresh_token from OAuth completed on your production URL (e.g. https://cpt-support-portal.netlify.app/oauth/start), not from localhost — Salesforce issues different refresh tokens per callback URL.`
    );
  }
}

/** Base64url encode (no +/, no padding) for JWT. */
function base64urlEncode(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Get access token via JWT Bearer flow. No OAuth, no refresh token, no callback URL.
 * Requires: Connected App with "Use digital signatures" and certificate uploaded;
 * SF_CLIENT_ID, SF_JWT_PRIVATE_KEY (PEM), SF_USERNAME, SF_LOGIN_URL.
 */
async function getTokensViaJwt(): Promise<StoredTokens> {
  if (cachedJwtTokens) {
    const nowSec = Date.now() / 1000;
    const age =
      cachedJwtTokens.issued_at != null
        ? nowSec - cachedJwtTokens.issued_at
        : Infinity;
    if (age < ACCESS_TOKEN_MAX_AGE_SEC) return cachedJwtTokens;
  }

  const clientId = getClientId();
  const username = process.env.SF_USERNAME?.trim();
  const privateKeyPem = process.env.SF_JWT_PRIVATE_KEY?.trim();
  const loginUrl = getLoginUrl();

  if (!username || !privateKeyPem) {
    throw new Error(
      'JWT auth requires SF_USERNAME and SF_JWT_PRIVATE_KEY (PEM). In Salesforce: enable "Use digital signatures" on the Connected App and upload the certificate.'
    );
  }

  // Normalize PEM: env often has literal \n
  const privateKey = privateKeyPem.replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 180; // 3 min
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientId,
    sub: username,
    aud: loginUrl.replace(/\/$/, ''),
    exp,
  };
  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  sign.end();
  const signature = sign.sign(privateKey);
  const signatureB64 = base64urlEncode(signature);
  const assertion = `${signingInput}.${signatureB64}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const res = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = `Salesforce JWT error ${res.status}: ${res.statusText}`;
    try {
      const err = JSON.parse(text);
      if (err.error_description) msg = err.error_description;
    } catch {
      if (text) msg += ` - ${text.slice(0, 200)}`;
    }
    throw new Error(msg);
  }

  const data = (await res.json()) as {
    access_token: string;
    instance_url: string;
    issued_at?: string;
  };

  const tokens: StoredTokens = {
    access_token: data.access_token,
    instance_url: data.instance_url.replace(/\/$/, ''),
    issued_at: data.issued_at ? parseInt(data.issued_at, 10) : Date.now(),
  };
  cachedJwtTokens = tokens;
  return tokens;
}

/** Salesforce access tokens typically expire in 2 hours; refresh when older than this (seconds). */
const ACCESS_TOKEN_MAX_AGE_SEC = 90 * 60; // 90 minutes

/**
 * Get tokens: (1) JWT if SF_JWT_PRIVATE_KEY + SF_USERNAME set; (2) SF_REFRESH_TOKEN env;
 * (3) .sf_tokens.json with proactive refresh when old. JWT = same config local & Netlify, no OAuth.
 */
async function getStoredTokensAsync(): Promise<StoredTokens> {
  if (process.env.SF_JWT_PRIVATE_KEY?.trim() && process.env.SF_USERNAME?.trim()) {
    return getTokensViaJwt();
  }
  if (process.env.SF_REFRESH_TOKEN?.trim()) {
    return refreshTokensFromEnv();
  }
  try {
    let tokens = readStoredTokens();
    const nowSec = Date.now() / 1000;
    const ageSec =
      tokens.issued_at != null ? nowSec - tokens.issued_at : Infinity;
    if (
      tokens.refresh_token &&
      ageSec > ACCESS_TOKEN_MAX_AGE_SEC
    ) {
      tokens = await refreshAccessToken(tokens.refresh_token);
      saveTokensToFile(tokens);
    }
    return tokens;
  } catch {
    throw new Error(
      'No Salesforce tokens. Complete OAuth once on localhost (GET /oauth/start), then set SF_REFRESH_TOKEN in env for production (or keep .sf_tokens.json locally).'
    );
  }
}

function buildSfUrl(path: string, instanceUrl: string): string {
  if (path.startsWith('http')) return path;
  if (path.startsWith('/services/oauth2')) return `${instanceUrl}${path}`;
  return `${instanceUrl}/services/data/${SF_API_VERSION}${path}`;
}

function parseSfError(status: number, statusText: string, text: string): string {
  let msg = `Salesforce API error ${status}: ${statusText}`;
  try {
    const err = JSON.parse(text);
    if (Array.isArray(err)) msg = err.map((e: { message?: string }) => e.message).join('; ');
    else if (err.error_description) msg = err.error_description;
    else if (err.message) msg = err.message;
  } catch {
    if (text) msg += ` - ${text.slice(0, 200)}`;
  }
  return msg;
}

/**
 * Make an authenticated Salesforce API request. On 401 (expired access_token),
 * automatically refreshes using the stored refresh_token and retries once.
 */
export async function sfFetchWithStoredToken<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let tokens = await getStoredTokensAsync();
  const url = buildSfUrl(path, tokens.instance_url);

  const doFetch = (accessToken: string) =>
    fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers as Record<string, string>),
      },
    });

  let res = await doFetch(tokens.access_token);

  if (res.status === 401) {
    if (tokens.refresh_token) {
      console.log('[SF OAuth] Access token expired, refreshing...');
      try {
        tokens = await refreshAccessToken(tokens.refresh_token);
        saveTokensToFile(tokens);
        cachedTokensFromEnv = null;
        res = await doFetch(tokens.access_token);
      } catch (refreshErr) {
        console.error('[SF OAuth] Auto-refresh failed:', refreshErr);
        throw new Error(
          'Salesforce access token expired and auto-refresh failed. Re-authenticate via GET /oauth/start'
        );
      }
    } else {
      // JWT or no refresh token: clear cache and retry once with fresh token
      cachedJwtTokens = null;
      cachedTokensFromEnv = null;
      tokens = await getStoredTokensAsync();
      res = await doFetch(tokens.access_token);
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseSfError(res.status, res.statusText, text));
  }

  return res.json() as Promise<T>;
}
