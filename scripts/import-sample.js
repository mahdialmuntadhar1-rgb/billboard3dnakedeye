/**
 * Import Sample Data Script
 * Uploads sample_import.txt to the import API
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'https://iraq-businesses-dashboard.mahdialmuntadhar1.workers.dev';

async function importSampleData() {
  try {
    // Read sample file
    const samplePath = path.join(__dirname, '../samples/sample_import.txt');
    const fileContent = fs.readFileSync(samplePath, 'utf8');
    
    // Convert to CSV format (replace tabs with commas if needed)
    const csvContent = fileContent;
    
    // Create FormData
    const formData = new FormData();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    formData.append('file', blob, 'sample_import.csv');
    formData.append('options', JSON.stringify({
      duplicateHandling: 'skip',
      autoGeneratePosts: true,
      batchSize: 100
    }));

    console.log('Uploading sample data...');
    
    const response = await fetch(`${API_URL}/api/business/import`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Import started successfully!');
      console.log('Job ID:', result.jobId);
      
      // Poll for status
      await checkStatus(result.jobId);
    } else {
      console.error('❌ Import failed:', result.error);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function checkStatus(jobId) {
  console.log('\nChecking import status...');
  
  const response = await fetch(`${API_URL}/api/business/import/status/${jobId}`);
  const result = await response.json();
  
  if (result.success) {
    const status = result.data;
    console.log(`Status: ${status.status}`);
    console.log(`Progress: ${status.imported_rows}/${status.total_rows}`);
    console.log(`Skipped: ${status.skipped_rows}`);
    console.log(`Duplicates: ${status.duplicate_rows}`);
    console.log(`Failed: ${status.failed_rows}`);
    
    if (status.status === 'completed') {
      console.log('\n✅ Import completed successfully!');
    } else if (status.status === 'failed') {
      console.log('\n❌ Import failed:', status.error_message);
    } else {
      console.log('\n⏳ Import in progress...');
    }
  }
}

// Run import
importSampleData();
