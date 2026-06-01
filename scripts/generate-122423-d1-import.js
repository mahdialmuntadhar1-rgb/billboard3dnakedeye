import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const csvFile = path.join(rootDir, 'iraq_businesses_2026-05-26_122423.csv');
const outputDir = path.join(rootDir, 'database', 'import-122423');
const batchSize = 40;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(field);
      if (row.some((value) => value.trim() !== '')) {
        rows.push(row);
      }
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.trim() !== '')) {
      rows.push(row);
    }
  }

  return rows;
}

function clean(value) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/^\uFEFF/, '').trim();
}

function sqlString(value) {
  const cleaned = clean(value);
  if (!cleaned) return 'NULL';
  return `'${cleaned.replace(/'/g, "''")}'`;
}

function normalizePhone(value) {
  const digits = clean(value).replace(/\D/g, '');
  if (!digits) return 'NULL';
  if (digits.startsWith('964')) return sqlString(`+${digits}`);
  if (digits.startsWith('0')) return sqlString(`+964${digits.slice(1)}`);
  return sqlString(`+964${digits}`);
}

function normalizeUrl(value) {
  const cleaned = clean(value);
  if (!cleaned) return 'NULL';
  if (/^https?:\/\//i.test(cleaned)) return sqlString(cleaned);
  if (/^(fb\.com|facebook\.com|instagram\.com|www\.)/i.test(cleaned) || cleaned.includes('.')) {
    return sqlString(`https://${cleaned}`);
  }
  return sqlString(cleaned);
}

function numberOrNull(value) {
  const cleaned = clean(value);
  if (!cleaned) return 'NULL';
  const number = Number(cleaned);
  return Number.isFinite(number) ? String(number) : 'NULL';
}

function normalizeName(value) {
  return clean(value)
    .toLocaleLowerCase('en-US')
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim();
}

function objectFromRow(headers, values) {
  const record = {};

  headers.forEach((header, index) => {
    const key = header || (index === 7 ? 'whatsapp' : `extra_${index}`);
    record[key] = values[index] ?? '';
  });

  return record;
}

function writeImportScript(batchFiles, totalRows) {
  const commands = batchFiles.map((file, index) => {
    const rel = path.relative(rootDir, file).replace(/\\/g, '/');
    const display = `${index + 1}/${batchFiles.length}`;
    return [
      `Write-Host "Importing batch ${display}..." -ForegroundColor Yellow`,
      `$result = npx wrangler d1 execute iraq-businesses --remote --file="${rel}" 2>&1`,
      'Write-Host $result',
      'if ($LASTEXITCODE -ne 0) {',
      `  Write-Host "Batch ${display} failed. Stopping." -ForegroundColor Red`,
      '  exit 1',
      '}',
      `Write-Host "Batch ${display} imported." -ForegroundColor Green`,
      'Start-Sleep -Milliseconds 400',
    ].join('\n');
  });

  const script = [
    '# Generated D1 import for iraq_businesses_2026-05-26_122423.csv',
    '$ErrorActionPreference = "Continue"',
    `Write-Host "Importing ${totalRows} businesses into Cloudflare D1..." -ForegroundColor Cyan`,
    '',
    ...commands,
    '',
    'Write-Host "Checking final count..." -ForegroundColor Cyan',
    'npx wrangler d1 execute iraq-businesses --remote --command="SELECT COUNT(*) AS count FROM businesses;"',
    '',
    'Write-Host "Import complete." -ForegroundColor Green',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outputDir, 'import-all.ps1'), script, 'utf8');
}

function main() {
  if (!fs.existsSync(csvFile)) {
    throw new Error(`CSV file not found: ${csvFile}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  for (const entry of fs.readdirSync(outputDir)) {
    if (/^batch_\d+\.sql$/i.test(entry) || entry === 'import-all.ps1' || entry === 'summary.json') {
      fs.rmSync(path.join(outputDir, entry), { force: true });
    }
  }

  const rows = parseCsv(fs.readFileSync(csvFile, 'utf8'));
  const headers = rows.shift().map((header) => clean(header));
  const statements = [];
  const stats = {
    totalRows: rows.length,
    importedRows: 0,
    skippedRows: 0,
    byLanguage: {},
    byCategory: {},
    byGovernorate: {},
  };

  rows.forEach((values, index) => {
    const record = objectFromRow(headers, values);
    const name = clean(record.name);
    if (!name) {
      stats.skippedRows += 1;
      return;
    }

    const language = clean(record.language) || 'ar';
    const category = clean(record.category);
    const governorate = clean(record.governorate);
    const id = `csv122423_${String(index + 1).padStart(6, '0')}`;

    stats.importedRows += 1;
    stats.byLanguage[language] = (stats.byLanguage[language] || 0) + 1;
    if (category) stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    if (governorate) stats.byGovernorate[governorate] = (stats.byGovernorate[governorate] || 0) + 1;

    statements.push(
      [
        'INSERT OR IGNORE INTO businesses',
        '(id, name, name_normalized, language, category, governorate, address, phone, mobile, whatsapp, email, website, facebook, instagram, bio, description, latitude, longitude, status, imported_from, created_at, updated_at)',
        'VALUES',
        `(${sqlString(id)}, ${sqlString(name)}, ${sqlString(normalizeName(name))}, ${sqlString(language)}, ${sqlString(category)}, ${sqlString(governorate)}, ${sqlString(record.address)}, ${normalizePhone(record.phone)}, ${normalizePhone(record.mobile)}, ${normalizePhone(record.whatsapp)}, ${sqlString(record.email)}, ${normalizeUrl(record.website)}, ${normalizeUrl(record.facebook)}, ${normalizeUrl(record.instagram)}, ${sqlString(record.bio)}, ${sqlString(record.bio)}, ${numberOrNull(record.latitude)}, ${numberOrNull(record.longitude)}, 'active', 'iraq_businesses_2026-05-26_122423.csv', datetime('now'), datetime('now'));`,
      ].join(' ')
    );
  });

  const batchFiles = [];
  for (let i = 0; i < statements.length; i += batchSize) {
    const batchNumber = String(batchFiles.length + 1).padStart(3, '0');
    const batchFile = path.join(outputDir, `batch_${batchNumber}.sql`);
    const content = [
      `-- Batch ${batchNumber} for iraq_businesses_2026-05-26_122423.csv`,
      ...statements.slice(i, i + batchSize),
      '',
    ].join('\n');
    fs.writeFileSync(batchFile, content, 'utf8');
    batchFiles.push(batchFile);
  }

  writeImportScript(batchFiles, stats.importedRows);
  fs.writeFileSync(path.join(outputDir, 'summary.json'), JSON.stringify(stats, null, 2), 'utf8');

  console.log(`Read ${stats.totalRows} CSV rows`);
  console.log(`Generated ${stats.importedRows} INSERT statements`);
  console.log(`Skipped ${stats.skippedRows} rows without a name`);
  console.log(`Wrote ${batchFiles.length} batches to ${path.relative(rootDir, outputDir)}`);
}

main();
