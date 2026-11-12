param(
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"

Write-Host "`n[1/4] Checking TypeScript types (npm run lint)..." -ForegroundColor Cyan
npm run lint
if ($LASTEXITCODE -ne 0) {
  Write-Host "Typecheck failed. Fix errors before publishing." -ForegroundColor Red
  exit 1
}

Write-Host "`n[2/4] Building production bundle (npm run build)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Fix errors before publishing." -ForegroundColor Red
  exit 1
}

Write-Host "`n[3/4] Checking for local changes..." -ForegroundColor Cyan
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  if ([string]::IsNullOrWhiteSpace($Message)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $Message = "Update MK Digital Craft ($timestamp)"
  }
  git commit -m $Message
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Git commit failed." -ForegroundColor Red
    exit 1
  }
} else {
  Write-Host "No new file edits to commit. Pushing any unpushed commits..." -ForegroundColor Gray
}

Write-Host "`n[4/4] Pushing to GitHub (triggers live Vercel deploy)..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nPush failed (likely cached GitHub credentials)." -ForegroundColor Red
  Write-Host "Run these two commands once in PowerShell to re-authenticate via browser:" -ForegroundColor Yellow
  Write-Host "  cmdkey /delete:git:https://github.com" -ForegroundColor White
  Write-Host "  git push -u origin main" -ForegroundColor White
  exit 1
}

Write-Host "`nDone! All changes are saved on GitHub and Vercel is deploying your live site." -ForegroundColor Green

