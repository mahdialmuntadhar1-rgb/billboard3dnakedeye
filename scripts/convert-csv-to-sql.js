/**
 * Convert CSV to SQL for bulk import
 * Processes iraq_businesses CSV and generates SQL INSERT statements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE = 'C:\\Users\\HB LAPTOP STORE\\.windsurf\\iraq_businesses_2026-05-26_120333.csv';
const OUTPUT_FILE = path.join(__dirname, '../database/bulk-import.sql');

function escapeSQL(str) {
  if (str === null || str === undefined || str === '') return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function normalizePhone(phone) {
  if (!phone) return 'NULL';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('964')) {
    return escapeSQL('+' + digits);
  }
  if (digits.startsWith('0')) {
    return escapeSQL('+964' + digits.substring(1));
  }
  return escapeSQL('+964' + digits);
}

function normalizeURL(url) {
  if (!url) return 'NULL';
  if (url.startsWith('http')) return escapeSQL(url);
  return escapeSQL('https://' + url);
}

function detectLanguage(name, name_ar, name_ku) {
  if (name_ku && name_ku.trim()) return 'ku';
  if (name_ar && name_ar.trim()) return 'ar';
  if (name && /[a-zA-Z]/.test(name)) return 'en';
  return 'ar';
}

function getPrimaryName(name, name_ar, name_ku) {
  const lang = detectLanguage(name, name_ar, name_ku);
  if (lang === 'ku' && name_ku) return name_ku;
  if (lang === 'ar' && name_ar) return name_ar;
  return name || name_ar || name_ku;
}

function generateSQL() {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  const headers = lines[0].split(',');
  console.log('Headers:', headers);
  
  const dataLines = lines.slice(1);
  console.log(`Processing ${dataLines.length} records...`);
  
  const sqlStatements = [];
  let idCounter = 1;
  
  sqlStatements.push('-- Bulk Import from CSV');
  sqlStatements.push('-- Generated from iraq_businesses_2026-05-26_120333.csv');
  sqlStatements.push('');
  
  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const values = line.split(',');
    
    if (values.length < headers.length) continue;
    
    const record = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index] ? values[index].trim() : '';
    });
    
    // Skip if no name
    if (!record.name && !record.name_ar && !record.name_ku) continue;
    
    const id = `biz_${String(idCounter).padStart(6, '0')}`;
    idCounter++;
    
    const primaryName = getPrimaryName(record.name, record.name_ar, record.name_ku);
    const nameNormalized = primaryName.toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\u0600-\u06FF\u0750-\u077F\s]/g, '');
    const language = detectLanguage(record.name, record.name_ar, record.name_ku);
    
    const sql = `INSERT INTO businesses (id, name, name_normalized, language, category, governorate, city, address, phone, mobile, whatsapp, email, website, facebook, instagram, latitude, longitude, status, created_at) VALUES (
      '${id}',
      ${escapeSQL(primaryName)},
      '${nameNormalized}',
      '${language}',
      ${escapeSQL(record.category)},
      ${escapeSQL(record.governorate)},
      ${escapeSQL(record.city)},
      ${escapeSQL(record.address)},
      ${normalizePhone(record.phone)},
      ${normalizePhone(record.mobile)},
      ${normalizePhone(record.whatsapp)},
      ${escapeSQL(record.email)},
      ${normalizeURL(record.website)},
      ${normalizeURL(record.facebook)},
      ${normalizeURL(record.instagram)},
      ${record.latitude || 'NULL'},
      ${record.longitude || 'NULL'},
      'active',
      datetime('now')
    );`;
    
    sqlStatements.push(sql);
    
    if (i % 100 === 0) {
      console.log(`Processed ${i + 1}/${dataLines.length} records...`);
    }
  }
  
  console.log(`Writing ${sqlStatements.length} SQL statements to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, sqlStatements.join('\n'), 'utf8');
  console.log('✅ SQL file generated successfully!');
}

generateSQL();
