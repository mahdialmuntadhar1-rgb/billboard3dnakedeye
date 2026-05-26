const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const CSV_FILE = path.join(__dirname, '../iraq_businesses_2026-05-26_122423.csv');
const OUTPUT_FILE = path.join(__dirname, '../data/businesses.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const businesses = [];

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on('data', (row) => {
    // Transform CSV row to business object
    const business = {
      id: generateId(),
      name: row.name || '',
      language: row.language || '',
      category: row.category || '',
      governorate: row.governorate || '',
      address: row.address || '',
      phone: row.phone || '',
      mobile: row.mobile || '',
      whatsapp: row.whatsapp || '',
      email: row.email || '',
      website: row.website || '',
      facebook: row.facebook || '',
      instagram: row.instagram || '',
      bio: row.bio || '',
      latitude: parseFloat(row.latitude) || null,
      longitude: parseFloat(row.longitude) || null
    };
    
    businesses.push(business);
  })
  .on('end', () => {
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(businesses, null, 2));
    console.log(`✅ Successfully imported ${businesses.length} businesses`);
    console.log(`📁 Data saved to: ${OUTPUT_FILE}`);
    
    // Print statistics
    const governorates = [...new Set(businesses.map(b => b.governorate).filter(Boolean))];
    const categories = [...new Set(businesses.map(b => b.category).filter(Boolean))];
    
    console.log(`\n📊 Statistics:`);
    console.log(`   Total businesses: ${businesses.length}`);
    console.log(`   Governorates: ${governorates.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Businesses with coordinates: ${businesses.filter(b => b.latitude && b.longitude).length}`);
  })
  .on('error', (error) => {
    console.error('❌ Error importing CSV:', error);
  });

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
