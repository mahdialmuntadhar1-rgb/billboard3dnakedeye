/**
 * File Parser Service
 * Handles Excel (.xlsx, .xls) and CSV file parsing with UTF-8 support
 * Supports Arabic, Kurdish, and English text
 */

import * as XLSX from 'xlsx';

export class FileParser {
  /**
   * Parse Excel or CSV file
   * @param {File} file - File object from upload
   * @returns {Promise<{headers: string[], rows: object[]}>}
   */
  static async parseFile(file) {
    const fileType = this.getFileType(file.name);
    
    if (fileType === 'csv') {
      return this.parseCSV(file);
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      return this.parseExcel(file);
    }
    
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  /**
   * Get file type from filename
   */
  static getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return ext;
  }

  /**
   * Parse CSV file with UTF-8 support
   */
  static async parseCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const rows = this.parseCSVText(text);
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read CSV file'));
      reader.readAsText(file, 'UTF-8');
    });
  }

  /**
   * Parse CSV text with proper handling of quotes and UTF-8
   */
  static parseCSVText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    // Parse headers
    const headers = this.parseCSVLine(lines[0]);
    
    // Parse data rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        rows.push(row);
      }
    }

    return { headers, rows };
  }

  /**
   * Parse a single CSV line handling quoted fields
   */
  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  /**
   * Parse Excel file with UTF-8 support
   */
  static async parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            raw: false,
            dateNF: 'yyyy-mm-dd'
          });
          
          if (jsonData.length === 0) {
            return resolve({ headers: [], rows: [] });
          }

          const headers = jsonData[0].map(h => String(h).trim());
          const rows = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const values = jsonData[i];
            if (values && values.length > 0) {
              const row = {};
              headers.forEach((header, index) => {
                row[header] = values[index] ? String(values[index]).trim() : '';
              });
              rows.push(row);
            }
          }
          
          resolve({ headers, rows });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Validate file size
   */
  static validateFileSize(file, maxSizeMB = 50) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }
    return true;
  }

  /**
   * Validate file type
   */
  static validateFileType(filename) {
    const allowedTypes = ['csv', 'xlsx', 'xls'];
    const ext = this.getFileType(filename);
    
    if (!allowedTypes.includes(ext)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
    }
    return true;
  }
}
