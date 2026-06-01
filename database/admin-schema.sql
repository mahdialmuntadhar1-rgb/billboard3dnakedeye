-- Admin & Content Management Schema Updates
-- Adds admin roles, hero slides, banners, and post management

-- ============================================
-- USERS TABLE (for admin authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user',          -- admin, moderator, user
  avatar_url TEXT,
  status TEXT DEFAULT 'active',     -- active, suspended, banned
  last_login TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert default admin user (password: admin123)
-- In production, use proper bcrypt hashing
INSERT OR IGNORE INTO users (id, email, password_hash, display_name, role) VALUES
('admin_001', 'mahdialmuntadhar1@gmail.com', '$2b$10$admin.hash.placeholder', 'Platform Admin', 'admin');

-- ============================================
-- HERO SLIDES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  governorate TEXT,                   -- Target governorate (optional)
  category TEXT,                    -- Target category (optional)
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(active);
CREATE INDEX IF NOT EXISTS idx_hero_slides_sort ON hero_slides(sort_order);

-- ============================================
-- USER SESSIONS TABLE (token-based auth)
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- ============================================
-- PASSWORD RESETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS password_resets (
  email TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets(expires_at);

-- Default hero slides
INSERT OR IGNORE INTO hero_slides (id, title, subtitle, image_url, cta_text, sort_order) VALUES
('hero_001', 'Discover Iraq', 'Find the best businesses across all governorates', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200', 'Explore Now', 1),
('hero_002', 'Baghdad Best', 'Top-rated restaurants and cafes in the capital', 'https://images.unsplash.com/photo-1549201447-58b460c45604?w=1200', 'View Baghdad', 2),
('hero_003', 'Kurdistan Region', 'Explore businesses in Erbil, Sulaymaniyah & Duhok', 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200', 'Explore KRI', 3);

-- ============================================
-- BANNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  position TEXT DEFAULT 'top',       -- top, sidebar, bottom, inline
  governorate TEXT,                   -- Target governorate (optional)
  category TEXT,                    -- Target category (optional)
  start_date TEXT,
  end_date TEXT,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);

-- ============================================
-- FEATURED SECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS featured_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  section_type TEXT DEFAULT 'category', -- category, governorate, custom
  target_value TEXT,                  -- category ID or governorate name
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_featured_active ON featured_sections(active);

-- ============================================
-- POST LIKES TABLE (separate from business likes)
-- ============================================
CREATE TABLE IF NOT EXISTS post_likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- ============================================
-- POST SHARES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS post_shares (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT,
  platform TEXT,                     -- whatsapp, facebook, twitter, copy
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_post_shares_post_id ON post_shares(post_id);

-- ============================================
-- MEDIA ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  post_id TEXT,
  business_id TEXT,
  type TEXT NOT NULL,                -- image, video, document
  url TEXT NOT NULL,
  filename TEXT,
  size INTEGER,
  mime_type TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_media_post_id ON media(post_id);
CREATE INDEX IF NOT EXISTS idx_media_business_id ON media(business_id);

-- ============================================
-- AUDIT LOG TABLE (for admin actions)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,              -- create, update, delete, login, etc.
  target_type TEXT,                  -- business, post, user, setting
  target_id TEXT,
  old_value TEXT,
  new_value TEXT,
  ip_address TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log(created_at DESC);
