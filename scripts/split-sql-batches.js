/**
 * Split large SQL file into smaller batches for D1 import
 * D1 has limits on file size and number of statements per execution
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../database/bulk-import.sql');
const OUTPUT_DIR = path.join(__dirname, '../database/batches');
const BATCH_SIZE = 100; // statements per batch (reduced to avoid D1 size limits)

function splitIntoBatches() {
  console.log('Reading SQL file...');
  const content = fs.readFileSync(INPUT_FILE, 'utf8');
  
  // Split by INSERT statements
  const lines = content.split('\n');
  const headerLines = [];
  const insertStatements = [];
  
  let inHeader = true;
  
  for (const line of lines) {
    if (line.startsWith('INSERT INTO')) {
      inHeader = false;
      insertStatements.push(line);
    } else if (inHeader) {
      headerLines.push(line);
    }
  }
  
  console.log(`Total INSERT statements: ${insertStatements.length}`);
  console.log(`Splitting into batches of ${BATCH_SIZE}...`);
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const batches = [];
  for (let i = 0; i < insertStatements.length; i += BATCH_SIZE) {
    const batch = insertStatements.slice(i, i + BATCH_SIZE);
    const batchContent = headerLines.join('\n') + '\n' + batch.join('\n');
    const batchFile = path.join(OUTPUT_DIR, `batch_${String(batches.length + 1).padStart(3, '0')}.sql`);
    
    fs.writeFileSync(batchFile, batchContent, 'utf8');
    batches.push(batchFile);
    
    console.log(`Created batch ${batches.length}: ${batch.length} statements -> ${path.basename(batchFile)}`);
  }
  
  console.log(`\n✅ Created ${batches.length} batch files in database/batches/`);
  console.log(`Import order:`);
  batches.forEach((file, i) => {
    console.log(`  ${i + 1}. ${path.basename(file)}`);
  });
  
  // Create import script
  const importScript = batches.map((file, i) => {
    const basename = path.basename(file);
    return `echo "Importing batch ${i + 1}/${batches.length}..." && wrangler d1 execute iraq-businesses --file=database/batches/${basename} --remote --yes`;
  }).join(' && \\n');
  
  const scriptFile = path.join(OUTPUT_DIR, 'import-all.bat');
  fs.writeFileSync(scriptFile, `@echo off\necho Starting bulk import of ${insertStatements.length} businesses...\n${importScript}\necho Import complete!`, 'utf8');
  
  console.log(`\n📄 Import script created: database/batches/import-all.bat`);
}

splitIntoBatches();
