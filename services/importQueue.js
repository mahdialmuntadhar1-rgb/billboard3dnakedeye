/**
 * Import Queue Service
 * Manages import jobs with status tracking and background processing
 */

import { FileParser } from './fileParser.js';
import { ColumnMapper } from './columnMapper.js';
import { Validator } from './validator.js';
import { DuplicateDetector } from './duplicateDetector.js';
import { PostGenerator } from './postGenerator.js';

export class ImportQueue {
  /**
   * Create a new import job
   */
  static async createJob(file, options = {}, env) {
    const jobId = this.generateId();
    const fileType = FileParser.getFileType(file.name);
    
    // Validate file
    FileParser.validateFileSize(file, options.maxSizeMB || 50);
    FileParser.validateFileType(file.name);

    // Create import job record
    await env.DB.prepare(`
      INSERT INTO import_jobs (id, file_name, file_size, file_type, status, column_mapping, settings, created_by)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)
    `).bind(
      jobId,
      file.name,
      file.size,
      fileType,
      JSON.stringify(options.columnMapping || {}),
      JSON.stringify(options),
      options.createdBy || 'system'
    ).run();

    return jobId;
  }

  /**
   * Process import job (background task)
   */
  static async processJob(jobId, file, env) {
    try {
      // Update status to processing
      await this.updateJobStatus(jobId, 'processing', null, env);

      // Get job details
      const job = await env.DB.prepare('SELECT * FROM import_jobs WHERE id = ?').bind(jobId).first();
      if (!job) throw new Error('Job not found');

      const settings = JSON.parse(job.settings || '{}');
      const columnMapping = JSON.parse(job.column_mapping || '{}');

      // Parse file
      const { headers, rows } = await FileParser.parseFile(file);
      
      // Update total rows
      await env.DB.prepare('UPDATE import_jobs SET total_rows = ? WHERE id = ?')
        .bind(rows.length, jobId)
        .run();

      // Apply column mapping if provided
      let mappedRows = rows;
      if (Object.keys(columnMapping).length > 0) {
        mappedRows = rows.map(row => ColumnMapper.applyMapping(row, columnMapping));
      } else {
        // Auto-detect mapping
        const autoMapping = ColumnMapper.mapColumns(headers);
        mappedRows = rows.map(row => ColumnMapper.applyMapping(row, autoMapping));
      }

      // Process rows in batches
      const batchSize = settings.batchSize || 100;
      const results = {
        imported: 0,
        skipped: 0,
        duplicates: 0,
        failed: 0
      };

      for (let i = 0; i < mappedRows.length; i += batchSize) {
        const batch = mappedRows.slice(i, i + batchSize);
        const batchResults = await this.processBatch(batch, jobId, settings, env);
        
        results.imported += batchResults.imported;
        results.skipped += batchResults.skipped;
        results.duplicates += batchResults.duplicates;
        results.failed += batchResults.failed;

        // Update progress
        await env.DB.prepare(`
          UPDATE import_jobs 
          SET imported_rows = ?, skipped_rows = ?, duplicate_rows = ?, failed_rows = ?
          WHERE id = ?
        `).bind(
          results.imported,
          results.skipped,
          results.duplicates,
          results.failed,
          jobId
        ).run();
      }

      // Mark as completed
      await this.updateJobStatus(jobId, 'completed', null, env);

      return { success: true, results };

    } catch (error) {
      await this.updateJobStatus(jobId, 'failed', error.message, env);
      throw error;
    }
  }

  /**
   * Process a batch of rows
   */
  static async processBatch(rows, jobId, settings, env) {
    const results = { imported: 0, skipped: 0, duplicates: 0, failed: 0 };
    const duplicateHandling = settings.duplicateHandling || 'skip';
    const autoGeneratePosts = settings.autoGeneratePosts !== false;

    for (const row of rows) {
      try {
        // Validate row
        const validation = Validator.validateBusiness(row);
        if (!validation.valid) {
          await this.logError(jobId, rows.indexOf(row) + 1, 'validation', validation.errors.join(', '), row, env);
          results.failed++;
          continue;
        }

        // Normalize data
        const normalized = this.normalizeBusiness(row);

        // Check for duplicates
        const duplicateCheck = await DuplicateDetector.checkDuplicate(normalized, env);
        if (duplicateCheck.isDuplicate) {
          if (duplicateHandling === 'skip') {
            await this.logError(jobId, rows.indexOf(row) + 1, 'duplicate', 
              `Duplicate found: ${duplicateCheck.matchType}`, row, env);
            results.duplicates++;
            continue;
          } else if (duplicateHandling === 'update') {
            // Update existing business
            await this.updateBusiness(duplicateCheck.existingId, normalized, env);
            results.skipped++;
            continue;
          }
        }

        // Insert new business
        const businessId = await this.insertBusiness(normalized, jobId, env);
        results.imported++;

        // Auto-generate post if enabled
        if (autoGeneratePosts) {
          await PostGenerator.generateBusinessCard(businessId, normalized, env);
        }

      } catch (error) {
        await this.logError(jobId, rows.indexOf(row) + 1, 'database', error.message, row, env);
        results.failed++;
      }
    }

    return results;
  }

  /**
   * Normalize business data
   */
  static normalizeBusiness(business) {
    const normalized = { ...business };

    // Normalize phone numbers
    if (normalized.phone) normalized.phone = Validator.normalizePhone(normalized.phone);
    if (normalized.mobile) normalized.mobile = Validator.normalizePhone(normalized.mobile);
    if (normalized.whatsapp) normalized.whatsapp = Validator.normalizePhone(normalized.whatsapp);

    // Normalize URLs
    if (normalized.website) normalized.website = Validator.normalizeURL(normalized.website);
    if (normalized.facebook) normalized.facebook = Validator.normalizeURL(normalized.facebook);
    if (normalized.instagram) normalized.instagram = Validator.normalizeURL(normalized.instagram);

    // Detect language if not provided
    if (!normalized.language) {
      normalized.language = Validator.detectLanguage(normalized.name);
    }

    // Generate normalized name for search/dedup
    normalized.name_normalized = DuplicateDetector.normalizeName(normalized.name);

    // Generate ID if not provided
    if (!normalized.id) {
      normalized.id = this.generateId();
    }

    return normalized;
  }

  /**
   * Insert business into database
   */
  static async insertBusiness(business, importJobId, env) {
    const columns = Object.keys(business);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(business);

    await env.DB.prepare(`
      INSERT INTO businesses (${columns.join(', ')}, imported_from)
      VALUES (${placeholders}, ?)
    `).bind(...values, importJobId).run();

    return business.id;
  }

  /**
   * Update existing business
   */
  static async updateBusiness(businessId, data, env) {
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return;

    values.push(businessId);
    await env.DB.prepare(`
      UPDATE businesses SET ${updates.join(', ')}, updated_at = datetime('now')
      WHERE id = ?
    `).bind(...values).run();
  }

  /**
   * Log import error
   */
  static async logError(jobId, rowNumber, errorType, errorMessage, rowData, env) {
    await env.DB.prepare(`
      INSERT INTO import_errors (import_job_id, row_number, error_type, error_message, row_data)
      VALUES (?, ?, ?, ?, ?)
    `).bind(jobId, rowNumber, errorType, errorMessage, JSON.stringify(rowData)).run();
  }

  /**
   * Update job status
   */
  static async updateJobStatus(jobId, status, errorMessage, env) {
    const updates = ['status = ?'];
    const values = [status];

    if (status === 'processing') {
      updates.push('started_at = datetime("now")');
    } else if (status === 'completed' || status === 'failed') {
      updates.push('completed_at = datetime("now")');
    }

    if (errorMessage) {
      updates.push('error_message = ?');
      values.push(errorMessage);
    }

    values.push(jobId);

    await env.DB.prepare(`
      UPDATE import_jobs SET ${updates.join(', ')} WHERE id = ?
    `).bind(...values).run();
  }

  /**
   * Get job status
   */
  static async getJobStatus(jobId, env) {
    const job = await env.DB.prepare('SELECT * FROM v_import_summary WHERE id = ?').bind(jobId).first();
    
    if (!job) return null;

    // Get error count
    const errorCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM import_errors WHERE import_job_id = ?'
    ).bind(jobId).first();

    return {
      ...job,
      errorCount: errorCount?.count || 0
    };
  }

  /**
   * Get job errors
   */
  static async getJobErrors(jobId, env, limit = 100) {
    const errors = await env.DB.prepare(`
      SELECT * FROM import_errors 
      WHERE import_job_id = ? 
      ORDER BY row_number ASC 
      LIMIT ?
    `).bind(jobId, limit).all();

    return errors.results || [];
  }

  /**
   * Get recent import jobs
   */
  static async getRecentJobs(env, limit = 20) {
    const jobs = await env.DB.prepare(`
      SELECT * FROM v_import_summary 
      ORDER BY created_at DESC 
      LIMIT ?
    `).bind(limit).all();

    return jobs.results || [];
  }

  /**
   * Cancel a job
   */
  static async cancelJob(jobId, env) {
    await this.updateJobStatus(jobId, 'failed', 'Cancelled by user', env);
  }

  /**
   * Retry a failed job
   */
  static async retryJob(jobId, env) {
    const job = await env.DB.prepare('SELECT * FROM import_jobs WHERE id = ?').bind(jobId).first();
    if (!job) throw new Error('Job not found');

    // Reset status
    await this.updateJobStatus(jobId, 'pending', null, env);
    
    // Reset counters
    await env.DB.prepare(`
      UPDATE import_jobs 
      SET imported_rows = 0, skipped_rows = 0, duplicate_rows = 0, failed_rows = 0,
          started_at = NULL, completed_at = NULL, error_message = NULL
      WHERE id = ?
    `).bind(jobId).run();

    // Clear errors
    await env.DB.prepare('DELETE FROM import_errors WHERE import_job_id = ?').bind(jobId).run();

    return jobId;
  }

  /**
   * Generate unique ID
   */
  static generateId() {
    return 'imp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
