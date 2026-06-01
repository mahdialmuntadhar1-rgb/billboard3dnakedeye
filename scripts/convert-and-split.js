/**
 * Convert CSV to SQL and split into D1-compatible batches
 * Handles quoted fields with commas properly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE = 'C:\\Users\\HB LAPTOP STORE\\.windsurf\\iraq_businesses_2026-05-26_120333.csv';
const OUTPUT_DIR = path.join(__dirname, '../database/batches');
const BATCH_SIZE = 50; // D1 limit: keep under 500 rows per batch

// Proper CSV parsing that respects quotes
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function escapeSQL(str) {
  if (str === null || str === undefined || str === '' || str === 'NULL') return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function normalizePhone(phone) {
  if (!phone || phone === 'NULL') return 'NULL';
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return 'NULL';
  if (digits.startsWith('964')) {
    return escapeSQL('+' + digits);
  }
  if (digits.startsWith('0')) {
    return escapeSQL('+964' + digits.substring(1));
  }
  return escapeSQL('+964' + digits);
}

function normalizeURL(url) {
  if (!url || url === 'NULL') return 'NULL';
  const str = String(url);
  if (str.startsWith('http')) return escapeSQL(str);
  if (str.includes('.')) return escapeSQL('https://' + str);
  return escapeSQL(str);
}

function detectLanguage(name, nameAr, nameKu) {
  if (nameKu && nameKu.trim()) return 'ku';
  if (nameAr && nameAr.trim()) return 'ar';
  return 'en';
}

function getPrimaryName(name, nameAr, nameKu) {
  const lang = detectLanguage(name, nameAr, nameKu);
  if (lang === 'ku' && nameKu) return nameKu;
  if (lang === 'ar' && nameAr) return nameAr;
  return name || nameAr || nameKu;
}

function main() {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  const headers = parseCSVLine(lines[0]);
  console.log('Headers:', headers);
  
  const dataLines = lines.slice(1);
  console.log(`Total records: ${dataLines.length}`);
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Clean old batches
  const oldFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('batch_'));
  oldFiles.forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));
  
  const sqlStatements = [];
  let idCounter = 1;
  
  for (let i = 0; i < dataLines.length; i++) {
    const values = parseCSVLine(dataLines[i]);
    
    if (values.length < headers.length) continue;
    
    const record = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index] || '';
    });
    
    // Skip if no name
    if (!record.name && !record.name_ar && !record.name_ku) continue;
    
    const id = `biz_${String(idCounter).padStart(6, '0')}`;
    idCounter++;
    
    const primaryName = getPrimaryName(record.name, record.name_ar, record.name_ku);
    const nameNormalized = primaryName.toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\u0600-\u06FF\u0750-\u077F\s]/g, '').trim();
    const language = detectLanguage(record.name, record.name_ar, record.name_ku);
    
    // Clean up address - remove extra quotes
    let address = record.address || '';
    address = address.replace(/^"|"$/g, '').trim();
    
    // Build single-line INSERT
    const sql = `INSERT INTO businesses (id, name, name_normalized, language, category, governorate, city, address, phone, mobile, whatsapp, email, website, facebook, instagram, latitude, longitude, status, created_at) VALUES ('${id}', ${escapeSQL(primaryName)}, '${nameNormalized}', '${language}', ${escapeSQL(record.category)}, ${escapeSQL(record.governorate)}, ${escapeSQL(record.city)}, ${escapeSQL(address)}, ${normalizePhone(record.phone)}, ${normalizePhone(record.mobile)}, ${normalizePhone(record.whatsapp)}, ${escapeSQL(record.email)}, ${normalizeURL(record.website)}, ${normalizeURL(record.facebook)}, ${normalizeURL(record.instagram)}, ${record.latitude || 'NULL'}, ${record.longitude || 'NULL'}, 'active', datetime('now'));`;
    
    sqlStatements.push(sql);
    
    if ((i + 1) % 1000 === 0) {
      console.log(`Processed ${i + 1}/${dataLines.length} records...`);
    }
  }
  
  console.log(`\nGenerated ${sqlStatements.length} valid SQL statements`);
  
  // Split into batches
  const batches = [];
  for (let i = 0; i < sqlStatements.length; i += BATCH_SIZE) {
    const batch = sqlStatements.slice(i, i + BATCH_SIZE);
    const batchContent = batch.join('\n');
    const batchFile = path.join(OUTPUT_DIR, `batch_${String(batches.length + 1).padStart(3, '0')}.sql`);
    
    fs.writeFileSync(batchFile, batchContent, 'utf8');
    batches.push(batchFile);
  }
  
  console.log(`\n✅ Created ${batches.length} batch files`);
  console.log(`Each batch: ${BATCH_SIZE} statements`);
  
  // Create PowerShell import script
  const psScript = batches.map((file, i) => {
    const basename = path.basename(file);
    return `  Write-Host "Importing batch ${i + 1}/${batches.length}..." -ForegroundColor Yellow
  $result = wrangler d1 execute iraq-businesses --file="database/batches/${basename}" --remote 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR on batch ${i + 1}! Stopping." -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Batch ${i + 1} complete" -ForegroundColor Green
  Start-Sleep -Milliseconds 500`;
  }).join('\n\n');
  
  const scriptContent = `# Bulk Import Script for Iraq Businesses
# Run from project root directory
# Usage: .\\database\\batches\\import-all.ps1

Write-Host "Starting import of ${sqlStatements.length} businesses in ${batches.length} batches..." -ForegroundColor Cyan

${psScript}

Write-Host ""
Write-Host "🎉 Import complete! ${sqlStatements.length} businesses imported." -ForegroundColor Green
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'import-all.ps1'), scriptContent, 'utf8');
  console.log(`\n📄 Import script: database/batches/import-all.ps1`);
  console.log(`\nTo import, run in PowerShell:`);
  console.log(`  .\\database\\batches\\import-all.ps1`);
}

main();
