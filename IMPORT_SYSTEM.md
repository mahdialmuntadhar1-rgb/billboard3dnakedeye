# Iraq Business Directory - Import System Documentation

Complete production-ready business import pipeline for bulk onboarding from Excel/CSV files.

## Features

- **File Upload Support**: .xlsx, .xls, .csv files
- **UTF-8 Encoding**: Full support for Arabic, Kurdish, and English text
- **Flexible Column Mapping**: Auto-detects column names or custom mapping
- **Duplicate Detection**: Checks by phone, whatsapp, website, name, coordinates
- **Validation Layer**: Validates phone formats, URLs, coordinates, required fields
- **Import Queue**: Background processing with status tracking
- **Auto Post Generation**: Automatically creates business postcards/feed cards
- **Filtering & Search**: Full-text search with governorate/category/city filters
- **Pagination**: Efficient pagination for infinite scroll
- **Import History**: Track all imports with error logs

## Architecture

### Database Schema

- **businesses**: Main business table with FTS5 full-text search
- **posts**: Feed cards/postcards for each business
- **import_jobs**: Import job tracking with status
- **import_errors**: Detailed error logging
- **comments, likes, saved_businesses**: Social features

### Services

- `fileParser.js`: Excel/CSV parsing with UTF-8 support
- `columnMapper.js`: Flexible column name mapping
- `validator.js`: Data validation and normalization
- `duplicateDetector.js`: Duplicate detection logic
- `importQueue.js`: Import job management
- `postGenerator.js`: Automatic postcard generation

### API Endpoints

#### Import API

- `POST /api/business/import` - Upload file and start import
- `POST /api/business/import/preview` - Preview file before import
- `GET /api/business/import/status/:id` - Get import job status
- `GET /api/business/import/errors/:id` - Get import errors
- `GET /api/business/import/history` - Get recent imports
- `POST /api/business/import/retry/:id` - Retry failed import

#### Business API

- `GET /api/businesses` - Get businesses with filtering/pagination
- `GET /api/businesses/:id` - Get single business
- `GET /api/feed/business-posts` - Get feed posts
- `GET /api/governorates` - Get unique governorates
- `GET /api/categories` - Get unique categories
- `GET /api/cities` - Get unique cities
- `GET /api/health` - Health check

## Setup Instructions

### 1. Install Dependencies

```bash
cd iraq-businesses-dashboard
npm install
```

### 2. Create D1 Database

```bash
wrangler d1 create iraq-businesses
```

Copy the database ID and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "iraq-businesses"
database_id = "YOUR_DATABASE_ID"
```

### 3. Run Database Migration

```bash
npm run migrate
```

This will create all tables, indexes, and FTS virtual tables.

### 4. Start Development Server

```bash
npm run dev
```

The worker will be available at `http://localhost:8787`

### 5. Deploy to Cloudflare

```bash
npm run deploy
```

## Import File Format

### Required Columns

- `name` - Business name (Arabic/Kurdish/English)
- `category` - Business category
- `governorate` - Governorate name

### Optional Columns

- `subcategory` - Subcategory
- `city` - City name
- `district` - District
- `address` - Full address
- `phone` - Phone number
- `mobile` - Mobile number
- `whatsapp` - WhatsApp number
- `email` - Email address
- `website` - Website URL
- `facebook` - Facebook URL
- `instagram` - Instagram URL
- `bio` - Short description (2-line postcard)
- `description` - Full description
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `logo_url` - Logo image URL
- `cover_image_url` - Cover image URL
- `tags` - Comma-separated tags

### Column Name Variations

The system supports multiple column name variations:

- **name**: name, business_name, company_name, title, اسم, نام
- **category**: category, cat, type, business_type, تصنيف, دسته‌بندی
- **governorate**: governorate, gov, province, المحافظة, استان
- **city**: city, town, location, المدينة, شهر
- **phone**: phone, telephone, tel, الهاتف, تلفن
- **whatsapp**: whatsapp, wa, واتساب
- **website**: website, site, url, الموقع, وبسایت

## Usage Examples

### Upload Import File

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('options', JSON.stringify({
  duplicateHandling: 'skip', // or 'update'
  autoGeneratePosts: true,
  batchSize: 100
}));

const response = await fetch('/api/business/import', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Job ID:', result.jobId);
```

### Check Import Status

```javascript
const response = await fetch(`/api/business/import/status/${jobId}`);
const status = await response.json();

console.log('Status:', status.data.status);
console.log('Progress:', {
  total: status.data.total_rows,
  imported: status.data.imported_rows,
  skipped: status.data.skipped_rows,
  duplicates: status.data.duplicate_rows,
  failed: status.data.failed_rows
});
```

### Get Import Errors

```javascript
const response = await fetch(`/api/business/import/errors/${jobId}?limit=50`);
const errors = await response.json();

errors.data.forEach(error => {
  console.log(`Row ${error.row_number}: ${error.error_message}`);
});
```

### Get Businesses with Filtering

```javascript
const response = await fetch('/api/businesses?' + new URLSearchParams({
  governorate: 'Baghdad',
  category: 'Restaurants & Cafes',
  page: 1,
  limit: 20
}));

const result = await response.json();
console.log('Businesses:', result.data);
console.log('Pagination:', result.pagination);
```

### Search Businesses

```javascript
const response = await fetch('/api/businesses?search=مطعم');
const result = await response.json();
```

### Get Feed Posts

```javascript
const response = await fetch('/api/feed/business-posts?page=1&limit=20');
const result = await response.json();
```

## Duplicate Detection

The system checks for duplicates using:

1. **Phone number** - Exact match on phone/mobile/whatsapp
2. **Website** - Exact match on website URL
3. **Name + Governorate** - Normalized name match in same governorate
4. **Coordinates** - Within 100 meters

### Duplicate Handling Options

- **skip** - Skip duplicate rows (default)
- **update** - Update existing business with new data

## Validation Rules

### Phone Numbers

- Must be Iraq format: +964XXXXXXXXXX or 07XXXXXXXXX
- Length: 10-15 digits
- Validates Iraq country code

### URLs

- Must be valid URL format
- Auto-adds https:// if missing
- Validates http/https protocols

### Coordinates

- Latitude: -90 to 90 (Iraq: 29-38)
- Longitude: -180 to 180 (Iraq: 38-49)

### Required Fields

- name (business name)
- category
- governorate

## Performance

- **Batch Processing**: Imports in batches of 100 rows
- **Indexed Queries**: Optimized indexes on governorate, category, city
- **Full-Text Search**: FTS5 for fast text search
- **Pagination**: Efficient LIMIT/OFFSET queries
- **Scalability**: Tested with 10k+ businesses

## Testing

### Using Sample File

1. Copy `samples/sample_import.txt`
2. Rename to `.csv` (remove .gitignore restriction)
3. Upload via API

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:8787/api/health

# Test businesses endpoint
curl http://localhost:8787/api/businesses

# Test import preview
curl -X POST http://localhost:8787/api/business/import/preview \
  -F "file=@sample_import.csv"
```

## Troubleshooting

### Import Fails

1. Check file format (.csv, .xlsx, .xls)
2. Verify UTF-8 encoding
3. Check required columns exist
4. Review error logs via `/api/business/import/errors/:id`

### Duplicate Detection Too Strict

Adjust duplicate handling in import options:
```javascript
{
  duplicateHandling: 'update' // Instead of 'skip'
}
```

### Column Names Not Recognized

Use preview endpoint to see mapping:
```javascript
POST /api/business/import/preview
```

Then provide custom column mapping:
```javascript
{
  columnMapping: {
    "Company Name": "name",
    "Type": "category",
    "Region": "governorate"
  }
}
```

## File Structure

```
iraq-businesses-dashboard/
├── database/
│   ├── schema.sql          # Database schema
│   └── migrate.js          # Migration script
├── services/
│   ├── fileParser.js       # Excel/CSV parser
│   ├── columnMapper.js     # Column mapping
│   ├── validator.js       # Data validation
│   ├── duplicateDetector.js # Duplicate detection
│   ├── importQueue.js      # Import queue
│   └── postGenerator.js    # Post generation
├── worker/
│   ├── index.js            # Main worker
│   ├── importApi.js        # Import API endpoints
│   └── businessApi.js      # Business API endpoints
├── samples/
│   └── sample_import.txt   # Sample data
├── package.json
├── wrangler.toml
└── IMPORT_SYSTEM.md
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## License

MIT
