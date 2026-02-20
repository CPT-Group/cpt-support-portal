#!/usr/bin/env bash
# Create the Support project (Project__c) in Salesforce via CLI and print its Id.
# Requires: Salesforce CLI (sf) installed and an org set (e.g. sf org login web).
# Add the printed Id to .env.local as SUPPORT_CHANNEL_DEFAULT_PROJECT_ID.

set -e
NAME="${1:-Support}"

echo "Creating Project__c with Name=\"$NAME\"..."
OUTPUT=$(sf data create record --sobject Project__c --values "Name=$NAME" --json 2>/dev/null || true)

if echo "$OUTPUT" | grep -q '"id"'; then
  ID=$(echo "$OUTPUT" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo ""
  echo "Created. Add to .env.local:"
  echo "SUPPORT_CHANNEL_DEFAULT_PROJECT_ID=$ID"
  echo ""
else
  echo "Create failed or sf CLI not available. Run manually:"
  echo "  sf data create record --sobject Project__c --values \"Name=$NAME\""
  echo "Then set SUPPORT_CHANNEL_DEFAULT_PROJECT_ID to the new record Id."
  exit 1
fi
