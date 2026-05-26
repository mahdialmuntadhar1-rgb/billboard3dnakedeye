// Script to upload business data to Cloudflare KV
// Run this after deploying the worker

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/businesses.json');

// Read the JSON data
const businessesData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

console.log(`Loading ${businessesData.length} businesses to KV...`);

// Instructions for manual upload via Wrangler CLI
console.log('\n=== Manual Upload Instructions ===');
console.log('1. Install Wrangler CLI: npm install -g wrangler');
console.log('2. Login: wrangler login');
console.log('3. Create KV namespace: wrangler kv:namespace create "BUSINESS_DATA"');
console.log('4. Update wrangler.toml with the namespace ID');
console.log('5. Upload data: wrangler kv:key put "businesses" --path=data/businesses.json --namespace-id=YOUR_NAMESPACE_ID');
console.log('\n=== Or use this command ===');
console.log('wrangler kv:key put "businesses" --path=data/businesses.json --binding=BUSINESS_DATA');

// For automated upload (requires wrangler to be installed and logged in)
const { exec } = require('child_process');

const command = `wrangler kv:key put "businesses" --path=${DATA_FILE} --binding=BUSINESS_DATA`;

console.log(`\nExecuting: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    console.error('Please follow the manual instructions above');
    return;
  }
  console.log('✅ Data uploaded to KV successfully');
  console.log(stdout);
});
