# Bulk Import Script for Iraq Businesses
# Run from project root directory
# Usage: .\database\batches\import-all.ps1

Write-Host "Starting import of 8502 businesses in 171 batches..." -ForegroundColor Cyan

  Write-Host "Importing batch 1/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_001.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 1! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 1 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 2/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_002.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 2! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 2 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 3/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_003.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 3! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 3 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 4/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_004.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 4! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 4 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 5/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_005.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 5! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 5 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 6/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_006.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 6! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 6 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 7/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_007.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 7! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 7 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 8/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_008.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 8! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 8 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 9/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_009.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 9! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 9 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 10/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_010.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 10! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 10 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 11/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_011.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 11! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 11 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 12/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_012.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 12! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 12 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 13/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_013.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 13! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 13 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 14/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_014.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 14! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 14 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 15/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_015.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 15! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 15 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 16/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_016.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 16! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 16 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 17/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_017.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 17! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 17 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 18/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_018.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 18! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 18 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 19/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_019.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 19! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 19 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 20/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_020.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 20! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 20 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 21/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_021.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 21! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 21 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 22/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_022.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 22! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 22 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 23/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_023.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 23! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 23 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 24/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_024.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 24! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 24 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 25/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_025.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 25! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 25 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 26/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_026.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 26! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 26 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 27/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_027.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 27! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 27 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 28/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_028.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 28! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 28 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 29/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_029.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 29! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 29 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 30/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_030.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 30! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 30 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 31/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_031.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 31! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 31 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 32/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_032.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 32! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 32 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 33/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_033.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 33! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 33 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 34/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_034.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 34! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 34 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 35/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_035.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 35! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 35 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 36/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_036.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 36! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 36 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 37/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_037.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 37! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 37 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 38/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_038.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 38! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 38 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 39/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_039.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 39! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 39 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 40/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_040.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 40! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 40 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 41/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_041.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 41! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 41 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 42/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_042.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 42! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 42 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 43/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_043.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 43! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 43 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 44/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_044.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 44! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 44 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 45/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_045.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 45! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 45 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 46/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_046.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 46! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 46 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 47/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_047.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 47! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 47 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 48/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_048.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 48! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 48 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 49/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_049.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 49! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 49 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 50/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_050.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 50! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 50 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 51/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_051.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 51! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 51 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 52/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_052.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 52! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 52 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 53/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_053.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 53! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 53 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 54/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_054.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 54! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 54 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 55/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_055.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 55! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 55 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 56/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_056.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 56! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 56 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 57/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_057.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 57! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 57 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 58/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_058.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 58! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 58 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 59/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_059.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 59! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 59 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 60/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_060.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 60! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 60 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 61/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_061.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 61! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 61 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 62/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_062.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 62! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 62 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 63/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_063.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 63! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 63 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 64/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_064.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 64! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 64 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 65/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_065.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 65! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 65 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 66/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_066.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 66! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 66 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 67/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_067.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 67! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 67 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 68/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_068.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 68! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 68 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 69/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_069.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 69! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 69 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 70/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_070.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 70! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 70 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 71/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_071.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 71! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 71 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 72/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_072.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 72! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 72 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 73/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_073.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 73! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 73 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 74/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_074.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 74! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 74 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 75/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_075.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 75! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 75 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 76/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_076.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 76! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 76 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 77/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_077.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 77! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 77 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 78/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_078.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 78! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 78 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 79/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_079.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 79! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 79 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 80/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_080.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 80! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 80 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 81/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_081.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 81! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 81 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 82/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_082.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 82! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 82 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 83/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_083.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 83! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 83 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 84/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_084.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 84! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 84 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 85/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_085.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 85! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 85 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 86/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_086.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 86! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 86 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 87/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_087.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 87! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 87 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 88/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_088.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 88! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 88 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 89/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_089.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 89! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 89 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 90/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_090.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 90! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 90 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 91/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_091.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 91! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 91 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 92/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_092.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 92! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 92 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 93/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_093.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 93! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 93 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 94/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_094.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 94! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 94 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 95/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_095.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 95! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 95 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 96/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_096.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 96! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 96 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 97/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_097.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 97! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 97 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 98/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_098.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 98! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 98 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 99/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_099.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 99! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 99 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 100/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_100.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 100! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 100 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 101/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_101.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 101! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 101 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 102/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_102.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 102! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 102 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 103/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_103.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 103! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 103 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 104/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_104.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 104! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 104 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 105/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_105.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 105! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 105 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 106/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_106.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 106! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 106 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 107/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_107.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 107! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 107 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 108/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_108.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 108! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 108 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 109/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_109.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 109! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 109 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 110/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_110.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 110! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 110 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 111/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_111.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 111! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 111 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 112/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_112.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 112! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 112 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 113/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_113.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 113! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 113 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 114/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_114.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 114! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 114 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 115/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_115.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 115! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 115 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 116/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_116.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 116! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 116 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 117/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_117.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 117! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 117 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 118/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_118.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 118! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 118 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 119/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_119.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 119! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 119 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 120/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_120.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 120! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 120 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 121/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_121.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 121! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 121 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 122/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_122.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 122! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 122 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 123/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_123.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 123! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 123 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 124/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_124.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 124! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 124 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 125/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_125.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 125! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 125 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 126/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_126.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 126! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 126 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 127/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_127.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 127! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 127 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 128/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_128.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 128! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 128 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 129/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_129.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 129! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 129 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 130/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_130.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 130! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 130 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 131/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_131.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 131! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 131 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 132/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_132.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 132! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 132 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 133/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_133.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 133! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 133 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 134/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_134.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 134! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 134 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 135/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_135.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 135! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 135 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 136/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_136.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 136! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 136 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 137/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_137.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 137! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 137 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 138/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_138.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 138! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 138 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 139/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_139.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 139! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 139 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 140/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_140.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 140! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 140 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 141/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_141.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 141! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 141 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 142/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_142.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 142! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 142 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 143/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_143.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 143! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 143 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 144/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_144.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 144! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 144 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 145/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_145.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 145! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 145 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 146/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_146.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 146! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 146 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 147/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_147.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 147! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 147 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 148/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_148.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 148! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 148 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 149/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_149.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 149! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 149 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 150/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_150.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 150! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 150 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 151/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_151.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 151! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 151 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 152/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_152.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 152! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 152 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 153/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_153.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 153! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 153 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 154/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_154.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 154! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 154 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 155/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_155.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 155! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 155 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 156/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_156.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 156! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 156 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 157/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_157.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 157! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 157 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 158/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_158.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 158! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 158 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 159/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_159.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 159! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 159 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 160/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_160.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 160! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 160 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 161/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_161.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 161! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 161 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 162/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_162.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 162! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 162 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 163/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_163.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 163! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 163 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 164/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_164.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 164! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 164 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 165/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_165.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 165! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 165 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 166/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_166.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 166! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 166 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 167/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_167.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 167! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 167 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 168/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_168.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 168! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 168 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 169/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_169.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 169! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 169 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 170/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_170.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 170! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 170 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

  Write-Host "Importing batch 171/171..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/batch_171.sql" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch 171! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch 171 complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500

Write-Host ""
Write-Host "🎉 Import complete! 8502 businesses imported." -ForegroundColor Green
