for ($i = 35; $i -le 80; $i++) {
    $num = $i.ToString().PadLeft(2,'0')
    Write-Host "Importing batch $num..."
    $proc = Start-Process -FilePath "npx" -ArgumentList "wrangler","d1","execute","billboard3d-db","--file=seed-sql/batch-$num.sql","--remote","--yes" -Wait -PassThru -NoNewWindow
    Write-Host "Batch $num exit: $($proc.ExitCode)"
}
Write-Host "All done!"
