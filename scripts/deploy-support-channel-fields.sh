#!/usr/bin/env bash
# Deploy Support_Channel__c custom fields (portal form fields) to Salesforce via CLI.
# Run from repo root. Requires: sf CLI, org already logged in (e.g. sf org login web).
# Usage: ./scripts/deploy-support-channel-fields.sh
#        ./scripts/deploy-support-channel-fields.sh -o myalias

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FORCE_APP="$REPO_ROOT/salesforce-metadata/force-app"

if [ ! -d "$FORCE_APP" ]; then
  echo "salesforce-metadata/force-app not found. Run from repo root." >&2
  exit 1
fi

if ! command -v sf &>/dev/null; then
  echo "Salesforce CLI (sf) not found. Install from https://developer.salesforce.com/tools/sfdxcli" >&2
  exit 1
fi

echo "Deploying Support_Channel__c fields from salesforce-metadata/force-app..."
sf project deploy start --source-dir "$FORCE_APP" "$@"

echo ""
echo "Done. Portal fields (First Name, Last Name, CPT ID, etc.) are now on Support_Channel__c."
echo "Add them to your list view via gear -> Select Fields to Display."
