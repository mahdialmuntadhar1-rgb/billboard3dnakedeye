for ($i=1; $i -le 16; $i++) {
  $num = $i.ToString().PadLeft(2,'0')
  Write-Host "Importing batch $num..."
  $proc = Start-Process -FilePath "npx" -ArgumentList "wrangler","d1","execute","billboard3d-db","--file=seed-sql/batch-$num.sql","--remote","--yes" -RedirectStandardInput "NUL" -Wait -PassThru
  Write-Host "Batch $num exit code: $($proc.ExitCode)"
}
Write-Host "Done!"
