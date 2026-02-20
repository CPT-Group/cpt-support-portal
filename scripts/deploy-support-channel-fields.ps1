# Deploy Support_Channel__c custom fields (portal form fields) to Salesforce via CLI.
# Run from repo root. Requires: sf CLI, org already logged in (e.g. sf org login web).
# Usage: .\scripts\deploy-support-channel-fields.ps1
#        .\scripts\deploy-support-channel-fields.ps1 -TargetOrg myalias

param(
    [string]$TargetOrg = ""
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$metadataDir = Join-Path $repoRoot "salesforce-metadata"
$forceApp = Join-Path $metadataDir "force-app"

if (-not (Test-Path $forceApp)) {
    Write-Error "salesforce-metadata/force-app not found. Run from repo root."
    exit 1
}

# sf project deploy requires running from a valid DX project dir (where sfdx-project.json lives)
$originalCwd = Get-Location
Set-Location $metadataDir
try {

$sfExe = "sf"
if (-not (Get-Command $sfExe -ErrorAction SilentlyContinue)) {
    $sfExe = "C:\Program Files\sf\bin\sf.cmd"
    if (-not (Test-Path $sfExe)) {
        Write-Error "Salesforce CLI (sf) not found. Install from https://developer.salesforce.com/tools/sfdxcli"
        exit 1
    }
}

Write-Host "Deploying Support_Channel__c fields from salesforce-metadata/force-app..."
$cmd = @("project", "deploy", "start", "--source-dir", "force-app")
if ($TargetOrg) { $cmd += "-o", $TargetOrg }

& $sfExe @cmd
$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
    Write-Host ""
    Write-Host "Deploy failed. Ensure you are logged in: $sfExe org login web"
    if ($TargetOrg) { Write-Host "  Or use: -TargetOrg $TargetOrg" }
    exit 1
}

Write-Host ""
Write-Host "Done. Portal fields (First Name, Last Name, CPT ID, etc.) are now on Support_Channel__c."
Write-Host "Add them to your list view via gear -> Select Fields to Display."
} finally {
    Set-Location $originalCwd
}
