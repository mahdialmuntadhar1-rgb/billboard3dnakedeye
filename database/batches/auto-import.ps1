# Auto-import all batches with automatic yes confirmation
# Uses echo to pipe "yes" to wrangler's interactive prompt

$ErrorActionPreference = "Stop"
$batchFiles = Get-ChildItem -Path "$PSScriptRoot" -Filter "batch_*.sql" | Sort-Object Name
$total = $batchFiles.Count
$count = 0
$success = 0
$failed = 0

Write-Host "Starting bulk import of $total batches..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $batchFiles) {
    $count++
    $fullPath = $file.FullName
    
    Write-Host "[$count/$total] Importing $($file.Name)..." -NoNewline
    
    try {
        # Pipe "yes" to handle wrangler's confirmation prompt
        $result = Write-Output "yes" | wrangler d1 execute iraq-businesses --file="$fullPath" --remote 2>&1
        
        # Check for errors in output
        if ($result -match "ERROR" -or $result -match "failed" -or $LASTEXITCODE -ne 0) {
            Write-Host " FAILED" -ForegroundColor Red
            Write-Host "  Error: $result" -ForegroundColor DarkRed
            $failed++
        } else {
            Write-Host " OK" -ForegroundColor Green
            $success++
        }
        
        # Small delay to avoid rate limiting
        Start-Sleep -Milliseconds 200
        
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
        Write-Host "  $_" -ForegroundColor DarkRed
        $failed++
    }
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Import Complete!" -ForegroundColor Green
Write-Host "Total batches: $total" -ForegroundColor White
Write-Host "Successful:    $success" -ForegroundColor Green
Write-Host "Failed:        $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "===========================================" -ForegroundColor Cyan
