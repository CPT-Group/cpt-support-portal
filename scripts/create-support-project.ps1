# Create the Support project (Project__c) in Salesforce via CLI and print its Id.
# Requires: Salesforce CLI (sf) installed and an org set (e.g. sf org login web).
# Add the printed Id to .env.local as SUPPORT_CHANNEL_DEFAULT_PROJECT_ID.
# Use -TargetOrg if you have no default org (e.g. -TargetOrg myalias).

param(
    [string]$Name = "Support",
    [string]$TargetOrg = ""
)

$sfExe = "sf"
if (-not (Get-Command sf -ErrorAction SilentlyContinue)) {
    $sfExe = "C:\Program Files\sf\bin\sf.cmd"
    if (-not (Test-Path $sfExe)) { $sfExe = "sf" }
}

Write-Host "Creating Project__c with Name=`"$Name`"..."
$cmd = @("data", "create", "record", "--sobject", "Project__c", "--values", "Name=$Name", "--json")
if ($TargetOrg) { $cmd += "-o", $TargetOrg }

try {
    $output = & $sfExe @cmd 2>&1 | Out-String
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
    Write-Host "Create failed or sf CLI not available."
    if ($output -match "default org|auth information|no org|login") {
        Write-Host ""
        Write-Host "No Salesforce org is logged in. Log in first:"
        Write-Host "  $sfExe org login web"
        Write-Host ""
    }
    Write-Host "Run manually: $sfExe data create record --sobject Project__c --values `"Name=$Name`" --json"
    if ($TargetOrg) { Write-Host "  Or add: -o $TargetOrg" }
    Write-Host "Then set SUPPORT_CHANNEL_DEFAULT_PROJECT_ID to the new record Id."
    exit 1
}
