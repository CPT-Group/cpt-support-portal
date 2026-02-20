# Create the Support project (Project__c) in Salesforce via CLI and print its Id.
# Requires: Salesforce CLI (sf) installed and an org set (e.g. sf org login web).
# Add the printed Id to .env.local as SUPPORT_CHANNEL_DEFAULT_PROJECT_ID.

param([string]$Name = "Support")

Write-Host "Creating Project__c with Name=`"$Name`"..."
try {
    $output = sf data create record --sobject Project__c --values "Name=$Name" --json 2>&1 | Out-String
    $json = $output | ConvertFrom-Json
    $id = $json.result.id
    if ($id) {
        Write-Host ""
        Write-Host "Created. Add to .env.local:"
        Write-Host "SUPPORT_CHANNEL_DEFAULT_PROJECT_ID=$id"
        Write-Host ""
    } else {
        throw "No id in output"
    }
} catch {
    Write-Host "Create failed or sf CLI not available. Run manually:"
    Write-Host "  sf data create record --sobject Project__c --values `"Name=$Name`""
    Write-Host "Then set SUPPORT_CHANNEL_DEFAULT_PROJECT_ID to the new record Id."
    exit 1
}
