$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $root 'manifest.json'
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$version = $manifest.version
$dist = Join-Path $root 'dist'
$zip = Join-Path $dist "translate-selection-$version.zip"
$stableZip = Join-Path $dist 'translate-selection.zip'

New-Item -ItemType Directory -Force -Path $dist | Out-Null

if (Test-Path $zip) { Remove-Item $zip -Force }
if (Test-Path $stableZip) { Remove-Item $stableZip -Force }

$items = @(
    'manifest.json',
    'background.js',
    'content.js',
    'languages.js',
    'options.html',
    'options.css',
    'options.js',
    'icons'
)

Compress-Archive -Path ($items | ForEach-Object { Join-Path $root $_ }) -DestinationPath $zip -CompressionLevel Optimal
Copy-Item $zip $stableZip -Force

Write-Output "Release package: $zip"
Write-Output "Stable asset:    $stableZip"
