$ErrorActionPreference = "Stop"

# Where the zip will be served from (Next public/)
$OutDir = Join-Path $PSScriptRoot "..\public\brand-kit"
$AssetsDir = Join-Path $OutDir "assets"
$ZipPath = Join-Path $OutDir "shortypro-brand-kit.zip"

New-Item -ItemType Directory -Force -Path $AssetsDir | Out-Null

$files = @(
  @{ name = "deadappcorp-logo.png";      url = "https://shortypro.com/shortypro/deadappcorp-logo.png" },
  @{ name = "shortypro-logo.png";        url = "https://shortypro.com/shortypro/aichatupgrade2.png" },
  @{ name = "magnahive-logo.png";        url = "https://shortypro.com/shortypro/magnahive-logo.png" },
  @{ name = "chatterly-logo.png";        url = "https://shortypro.com/shortypro/chatterly-logo.png" },
  @{ name = "viraldeadengine-logo.png";  url = "https://shortypro.com/shortypro/viraldeadengine-logo.png" }
)

Write-Host "Downloading logos..."
foreach ($f in $files) {
  $dest = Join-Path $AssetsDir $f.name
  Write-Host " - $($f.name)"
  Invoke-WebRequest -Uri $f.url -OutFile $dest
}

# Add a simple README into the kit
$readme = @"
ShortyPro Brand Kit
===================

Included:
- DEAD APP CORP logo
- ShortyPro, Magna Hive, Chatterly, ViralDead Engine logos

Rules:
- Do not stretch or distort logos
- Keep padding around marks
- Prefer white background behind transparent logos

Built: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

$readmePath = Join-Path $OutDir "README.txt"
$readme | Out-File -Encoding utf8 $readmePath

# Build ZIP
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
Write-Host "Creating zip: $ZipPath"

Compress-Archive -Path (Join-Path $OutDir "*") -DestinationPath $ZipPath

Write-Host "Done. Zip is available at: /brand-kit/shortypro-brand-kit.zip"
