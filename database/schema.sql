-- Iraq Business Directory - Complete Database Schema
-- Supports Arabic, Kurdish, English with UTF-8
-- Optimized for filtering, search, and scalability

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,                    -- Business name (original language)
  name_normalized TEXT,                  -- Normalized for search/dedup
  language TEXT DEFAULT 'ar',           -- ar, ku, en
  category TEXT NOT NULL,               -- Main category
  subcategory TEXT,                     -- Subcategory
  governorate TEXT NOT NULL,            -- Governorate
  city TEXT,                            -- City
  district TEXT,                        -- District
  address TEXT,                         -- Full address
  phone TEXT,                           -- Phone number
  mobile TEXT,                          -- Mobile number
  whatsapp TEXT,                        -- WhatsApp number
  email TEXT,                           -- Email address
  website TEXT,                         -- Website URL
  facebook TEXT,                        -- Facebook URL
  instagram TEXT,                       -- Instagram URL
  bio TEXT,                             -- Short description (2-line postcard)
  description TEXT,                     -- Full description
  latitude REAL,                        -- GPS latitude
  longitude REAL,                       -- GPS longitude
  logo_url TEXT,                        -- Logo image URL
  cover_image_url TEXT,                 -- Cover image URL
  tags TEXT,                            -- Comma-separated tags
  verified INTEGER DEFAULT 0,           -- 0=unverified, 1=verified
  status TEXT DEFAULT 'active',         -- active, inactive, pending
  views INTEGER DEFAULT 0,              -- View count
  likes INTEGER DEFAULT 0,              -- Like count
  saves INTEGER DEFAULT 0,              -- Save count
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  imported_from TEXT,                   -- Import job ID
  duplicate_of TEXT                     -- If duplicate, reference original ID
);

-- Indexes for businesses
CREATE INDEX IF NOT EXISTS idx_businesses_governorate ON businesses(governorate);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_language ON businesses(language);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_name_normalized ON businesses(name_normalized);
CREATE INDEX IF NOT EXISTS idx_businesses_phone ON businesses(phone);
CREATE INDEX IF NOT EXISTS idx_businesses_whatsapp ON businesses(whatsapp);
CREATE INDEX IF NOT EXISTS idx_businesses_website ON businesses(website);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_imported_from ON businesses(imported_from);

-- Composite index for filtering
CREATE INDEX IF NOT EXISTS idx_businesses_gov_cat ON businesses(governorate, category);
CREATE INDEX IF NOT EXISTS idx_businesses_gov_city ON businesses(governorate, city);

-- Full-text search for businesses
CREATE VIRTUAL TABLE IF NOT EXISTS businesses_fts USING fts5(
  name, category, subcategory, governorate, city, address, bio, description, tags,
  content='businesses',
  content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS businesses_ai AFTER INSERT ON businesses BEGIN
  INSERT INTO businesses_fts(rowid, name, category, subcategory, governorate, city, address, bio, description, tags)
  VALUES (new.rowid, new.name, new.category, new.subcategory, new.governorate, new.city, new.address, new.bio, new.description, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS businesses_ad AFTER DELETE ON businesses BEGIN
  DELETE FROM businesses_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER IF NOT EXISTS businesses_au AFTER UPDATE ON businesses BEGIN
  UPDATE businesses_fts
  SET name = new.name, category = new.category, subcategory = new.subcategory,
      governorate = new.governorate, city = new.city, address = new.address,
      bio = new.bio, description = new.description, tags = new.tags
  WHERE rowid = new.rowid;
END;

-- ============================================
-- POSTS / FEED CARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,           -- Reference to business
  type TEXT DEFAULT 'business_card',    -- business_card, promotion, announcement
  title TEXT,                          -- Post title
  content TEXT,                        -- Post content
  image_url TEXT,                      -- Post image
  category TEXT,                       -- Category badge
  governorate TEXT,                    -- Governorate badge
  tags TEXT,                           -- Comma-separated tags
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  pinned INTEGER DEFAULT 0,            -- 0=normal, 1=pinned
  status TEXT DEFAULT 'active',        -- active, hidden, deleted
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_business_id ON posts(business_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_governorate ON posts(governorate);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON posts(pinned DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Full-text search for posts
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  title, content, tags,
  content='posts',
  content_rowid='rowid'
);

-- ============================================
-- IMPORT QUEUE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS import_jobs (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,                      -- csv, xlsx, xls
  status TEXT DEFAULT 'pending',       -- pending, processing, completed, failed
  total_rows INTEGER DEFAULT 0,
  imported_rows INTEGER DEFAULT 0,
  skipped_rows INTEGER DEFAULT 0,
  duplicate_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  error_message TEXT,
  column_mapping TEXT,                  -- JSON mapping of columns
  settings TEXT,                       -- JSON import settings
  started_at TEXT,
  completed_at TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for import jobs
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_by ON import_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_at ON import_jobs(created_at DESC);

-- ============================================
-- IMPORT ERRORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS import_errors (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  row_number INTEGER,
  error_type TEXT,                      -- validation, duplicate, database, other
  error_message TEXT,
  row_data TEXT,                       -- JSON of the problematic row
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (import_job_id) REFERENCES import_jobs(id) ON DELETE CASCADE
);

-- Indexes for import errors
CREATE INDEX IF NOT EXISTS idx_import_errors_job_id ON import_errors(import_job_id);
CREATE INDEX IF NOT EXISTS idx_import_errors_type ON import_errors(error_type);

-- ============================================
-- COMMENTS TABLE (for posts)
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT,
  username TEXT,
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- ============================================
-- SAVED BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saved_businesses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE(user_id, business_id)
);

-- Indexes for saved businesses
CREATE INDEX IF NOT EXISTS idx_saved_user_id ON saved_businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_business_id ON saved_businesses(business_id);

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,          -- business, post
  target_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, target_type, target_id)
);

-- Indexes for likes
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Default settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('duplicate_handling', 'skip'),      -- skip, update
  ('auto_generate_posts', '1'),        -- 0=off, 1=on
  ('max_file_size_mb', '50'),
  ('batch_size', '100');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for active businesses with stats
CREATE VIEW IF NOT EXISTS v_active_businesses AS
SELECT 
  b.*,
  (SELECT COUNT(*) FROM posts WHERE business_id = b.id AND status = 'active') as post_count
FROM businesses b
WHERE b.status = 'active';

-- View for feed posts
CREATE VIEW IF NOT EXISTS v_feed_posts AS
SELECT 
  p.*,
  b.name as business_name,
  b.category as business_category,
  b.governorate as business_governorate,
  b.city as business_city,
  b.logo_url as business_logo,
  b.phone as business_phone,
  b.whatsapp as business_whatsapp
FROM posts p
JOIN businesses b ON p.business_id = b.id
WHERE p.status = 'active' AND b.status = 'active'
ORDER BY p.pinned DESC, p.created_at DESC;

-- View for import summary
CREATE VIEW IF NOT EXISTS v_import_summary AS
SELECT 
  id,
  file_name,
  status,
  total_rows,
  imported_rows,
  skipped_rows,
  duplicate_rows,
  failed_rows,
  started_at,
  completed_at,
  CASE 
    WHEN completed_at IS NOT NULL THEN 
      ROUND((julianday(completed_at) - julianday(started_at)) * 86400)
    ELSE NULL
  END as duration_seconds
FROM import_jobs;
