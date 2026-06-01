# Import remaining batches (skip batch_001 which is already imported)
$batchFiles = Get-ChildItem -Path "$PSScriptRoot" -Filter "batch_*.sql" | 
    Where-Object { $_.Name -ne "batch_001.sql" } |
    Sort-Object Name

$total = $batchFiles.Count
$count = 0

Write-Host "Importing $total remaining batches..." -ForegroundColor Cyan

foreach ($file in $batchFiles) {
    $count++
    $fullPath = $file.FullName
    
    Write-Host "[$count/$total] $($file.Name) ... " -NoNewline
    
    # Run wrangler and capture output
    $output = Write-Output "yes" | wrangler d1 execute iraq-businesses --file="$fullPath" --remote 2>&1
    
    # Check for actual errors (not warnings)
    if ($output -match "SQLITE_ERROR|SQLITE_CONSTRAINT|failed|ERROR.*at offset") {
        Write-Host "FAILED" -ForegroundColor Red
        Write-Host "  $output" -ForegroundColor DarkRed
    } else {
        # Extract rows written from output
        $rowsWritten = [regex]::Match($output, '(\d+)\s+rows written').Groups[1].Value
        if ($rowsWritten) {
            Write-Host "OK ($rowsWritten rows)" -ForegroundColor Green
        } else {
            Write-Host "OK" -ForegroundColor Green
        }
    }
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "Import complete!" -ForegroundColor Green
