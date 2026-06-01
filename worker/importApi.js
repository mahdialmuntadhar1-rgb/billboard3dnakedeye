/**
 * Import API Endpoints
 * Handles file upload, import job management, and status tracking
 */

import { FileParser } from '../services/fileParser.js';
import { ColumnMapper } from '../services/columnMapper.js';
import { ImportQueue } from '../services/importQueue.js';

export const ImportAPI = {
  /**
   * POST /api/business/import
   * Upload file and create import job
   */
  async handleImportUpload(request, env) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const options = JSON.parse(formData.get('options') || '{}');

      if (!file) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No file provided'
        }), { status: 400, headers: this.corsHeaders() });
      }

      // Create import job
      const jobId = await ImportQueue.createJob(file, options, env);

      // Process import in background (for large files)
      // For now, process synchronously (can be made async with queues)
      await ImportQueue.processJob(jobId, file, env);

      return new Response(JSON.stringify({
        success: true,
        jobId,
        message: 'Import job created and processed'
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * GET /api/business/import/status/:id
   * Get import job status
   */
  async handleImportStatus(request, env) {
    const url = new URL(request.url);
    const jobId = url.pathname.split('/').pop();

    try {
      const status = await ImportQueue.getJobStatus(jobId, env);

      if (!status) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Job not found'
        }), { status: 404, headers: this.corsHeaders() });
      }

      return new Response(JSON.stringify({
        success: true,
        data: status
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * GET /api/business/import/errors/:id
   * Get import job errors
   */
  async handleImportErrors(request, env) {
    const url = new URL(request.url);
    const jobId = url.pathname.split('/').pop();
    const limit = parseInt(url.searchParams.get('limit') || '100');

    try {
      const errors = await ImportQueue.getJobErrors(jobId, env, limit);

      return new Response(JSON.stringify({
        success: true,
        data: errors
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * GET /api/business/import/history
   * Get recent import jobs
   */
  async handleImportHistory(request, env) {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    try {
      const jobs = await ImportQueue.getRecentJobs(env, limit);

      return new Response(JSON.stringify({
        success: true,
        data: jobs
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * POST /api/business/import/preview
   * Preview file before import (column mapping)
   */
  async handleImportPreview(request, env) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No file provided'
        }), { status: 400, headers: this.corsHeaders() });
      }

      // Parse file
      const { headers, rows } = await FileParser.parseFile(file);

      // Generate mapping preview
      const preview = ColumnMapper.generateMappingPreview(headers);

      // Get sample rows (first 5)
      const sampleRows = rows.slice(0, 5);

      return new Response(JSON.stringify({
        success: true,
        data: {
          headers,
          totalRows: rows.length,
          sampleRows,
          mapping: preview
        }
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * POST /api/business/import/retry/:id
   * Retry a failed import job
   */
  async handleImportRetry(request, env) {
    const url = new URL(request.url);
    const jobId = url.pathname.split('/').pop();

    try {
      await ImportQueue.retryJob(jobId, env);

      return new Response(JSON.stringify({
        success: true,
        message: 'Job queued for retry'
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  corsHeaders() {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
  }
};
