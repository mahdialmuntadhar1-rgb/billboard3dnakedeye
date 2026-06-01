# Generated D1 import for iraq_businesses_2026-05-26_122423.csv
$ErrorActionPreference = "Continue"
Write-Host "Importing 570 businesses into Cloudflare D1..." -ForegroundColor Cyan

Write-Host "Importing batch 1/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_001.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 1/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 1/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 2/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_002.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 2/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 2/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 3/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_003.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 3/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 3/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 4/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_004.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 4/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 4/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 5/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_005.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 5/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 5/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 6/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_006.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 6/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 6/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 7/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_007.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 7/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 7/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 8/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_008.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 8/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 8/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 9/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_009.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 9/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 9/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 10/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_010.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 10/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 10/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 11/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_011.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 11/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 11/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 12/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_012.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 12/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 12/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 13/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_013.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 13/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 13/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 14/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_014.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 14/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 14/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400
Write-Host "Importing batch 15/15..." -ForegroundColor Yellow
$result = npx wrangler d1 execute iraq-businesses --remote --file="database/import-122423/batch_015.sql" 2>&1
Write-Host $result
if ($LASTEXITCODE -ne 0) {
  Write-Host "Batch 15/15 failed. Stopping." -ForegroundColor Red
  exit 1
}
Write-Host "Batch 15/15 imported." -ForegroundColor Green
Start-Sleep -Milliseconds 400

Write-Host "Checking final count..." -ForegroundColor Cyan
npx wrangler d1 execute iraq-businesses --remote --command="SELECT COUNT(*) AS count FROM businesses;"

Write-Host "Import complete." -ForegroundColor Green
