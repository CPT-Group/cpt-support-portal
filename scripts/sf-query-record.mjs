import { createSign } from 'crypto';

const SF_LOGIN_URL = 'https://login.salesforce.com';
const CLIENT_ID = '3MVG9yZ.WNe6byQANCUhhu1c8yAmza6jdVCrQ0bWEfElWOYW7TTLw8iAE60KHy1Uqw_9cMB7WU7ifBZFcjA.I';
const USERNAME = 'kyle@cptgroup.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCTmr5xvNMELsem
0Czc2uxcW/eykeyfLWtiHd2NhQ46/RRvt7xtcRtSfvz2w24za1xw9fD3nRVWr6/Y
k8u9hxdqZoe0AfhttOUYOGDlmjHSXelxcW3AoD8FzMHbVoSW0z5u3wbQ/mBNsxKC
+jZ3VtaNirXOjsT0WyT9KnLJr9dKQJUuXjg548lxInoIgFhVwKSQmNbgCb0ds+Ig
+R0+WRBQ46GRXZitzfxW3TNAoA88h1pdN+jB+fHkX5gPBxAqa2vB4NRBvrvJ0BQ0
1oe4yeDMZBU5xDG5dwxdcBu6U8/a6CdPO/JiupSU3bIeX/QThnpzfvQD3AFjsI9L
GnLDOGWPAgMBAAECggEABxwBJ9zh1D+LxQ1QpXaZ9qNE9yhJW5IsrByNV+XcijTR
L8Xx+nRKZ5sCnidKZVZt4APIjnSip+E6BaMT9Ik1zh2QIOumk2PCIRXq40Q3bOiy
RMRWdlyBjJfD9ceUbU6EoRx26WJ6ZJbg2y3BqW/Yt7D1q5quzw8D/uAOu7r13xEF
Vp+apXlhg90xY58GfZLELZniIn21gQbeJUBQGd0u/CyIi4HyOa+iNX9F9knEp8o8
GsnzUGva8pT+MheA7TghRSGJywsDQV6L8n+Vksjw9xlOdRFx1d5kE5PzUbnRxOM7
DZb9xScBFlqeCc+1eC1kQwgEkqeJ5NXgwYHCHxj74QKBgQDG2gukrzy9A3rLRc8C
ZD+N0SmlZaHLf55GxqrVT/ytxr1HDcdzuy82Gc9y7y6KIKEzNplGX6IJajU+H0kQ
zPPOwIlRXEQiI1PnD+DqXJ0JJcP644ZYTZtmd9XeUVXz4bJXZ9tBwQOJVmw3B+9V
7anIYNZCB15h6rbIu2jTP4e/MQKBgQC+BlNIyyg92NPxU4Do9h9RmLZW3gaPN1Ee
xgzm7/4DWRdKsjpP7ZZVD6GPJGwjthx/mLThOQBKUCkWhPU9xQb5eG2kOuBr2Lfb
PvtZykRhsibpJMt5SuFxaVrxDnToAAGjIo+Rp/Y3sKfqa1bvWrfTC9cRXsIwYk1s
O8Mru0zAvwKBgCDI0ESdk6ECEtuyrbeSOZwzEO+w+uTnLHw0wvOaVWl9K7WsQucE
xHrh9H7Zik3BpXIhHVIp8DgnJ5IPbGd1sviya7FbSexq8KlWx9k73bQlYtNZccvb
N7TEKyGVPVuRKWsZt1926BNbiUnlaAM9xNFBjfGi71+rZ+leZKD3h3TxAoGAevZM
3kXX/G1aeEa4nAbnrT1MgFmblQEOlQNDRgz2KeR0lflOknoDVXeP67h94X3uYwLF
yRfBgFTuwYu3xgjAwp2TFTqkDiVmk5DlxOyF41IMq8ELialSyLiMCIB6VcXrSU0L
6gzt3ouJnL9ouenSGdcHjE3tCrIRt3/Ug2/n8rECgYEAo2U69rGQH3l3aciVCV4K
ozmhwPxYzAnKQMvHHysr7nHTpt4qNSkG+8KUCP1Wn97eaBveeGEQR5npN2A8d6UW
s2GB9TUIwYImOMTBOPlY0haEnUm4crI1owaD4R86QmFwQv/dseMqFYOa2Kj2Wc7v
/Aby8+6twSqwDJN21CI221A=
-----END PRIVATE KEY-----`;

const recordId = process.argv[2];
if (!recordId) {
  console.error('Usage: node scripts/sf-query-record.mjs <recordId>');
  process.exit(1);
}

async function getJwtAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: CLIENT_ID,
    sub: USERNAME,
    aud: SF_LOGIN_URL,
    exp: now + 300,
  };
  const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signable = `${header}.${body}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signable);
  const signature = sign.sign(PRIVATE_KEY, 'base64url');
  const assertion = `${signable}.${signature}`;

  const res = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`JWT token request failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return { accessToken: data.access_token, instanceUrl: data.instance_url };
}

async function main() {
  const { accessToken, instanceUrl } = await getJwtAccessToken();
  const url = `${instanceUrl}/services/data/v60.0/sobjects/Support_Channel__c/${recordId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Salesforce query failed (${res.status}): ${text}`);
    process.exit(1);
  }
  const record = await res.json();
  console.log(JSON.stringify(record, null, 2));
}

main();
