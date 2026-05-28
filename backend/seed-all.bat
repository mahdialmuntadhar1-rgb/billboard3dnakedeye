@echo off
for /L %%i in (1,1,80) do (
  if %%i lss 10 (
    set "num=0%%i"
  ) else (
    set "num=%%i"
  )
  echo Importing batch %%num%%...
  echo Y | call npx wrangler d1 execute billboard3d-db --file=seed-sql/batch-%%num%%.sql --remote --yes
  echo Batch %%num%% done.
)
echo All batches imported!
