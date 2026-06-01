/**
 * Database Migration Script
 * Run this to initialize the D1 database with the schema
 */

const schema = require('./schema.sql');

export async function migrateDatabase(env) {
  try {
    console.log('Starting database migration...');
    
    // Execute schema
    await env.DB.exec(schema);
    
    console.log('✅ Database migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, error: error.message };
  }
}
