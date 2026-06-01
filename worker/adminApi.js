/**
 * Admin API Endpoints
 * Full admin control: edit/delete any content, manage hero, banners, featured sections
 */

// Simple admin auth check - in production, use JWT tokens
function isAdmin(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;
  
  // Check for admin token - simple implementation
  // In production, verify JWT against users table
  const token = authHeader.replace('Bearer ', '');
  return token === 'admin-token-iraq-2026';
}

function requireAdmin(request) {
  if (!isAdmin(request)) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized. Admin access required.'
    }), { status: 403, headers: corsHeaders() });
  }
  return null;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}

export const AdminAPI = {
  // ============= AUTH =============
  
  async handleLogin(request, env) {
    try {
      const { email, password } = await request.json();
      
      // Check admin credentials against users table
      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ? AND role = "admin"'
      ).bind(email).first();
      
      if (!user) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        }), { status: 401, headers: corsHeaders() });
      }
      
      // Simple password check (in production use bcrypt)
      // For now, accept any password for the admin email
      if (email === 'mahdialmuntadhar1@gmail.com') {
        return new Response(JSON.stringify({
          success: true,
          token: 'admin-token-iraq-2026',
          user: {
            id: user.id,
            email: user.email,
            displayName: user.display_name,
            role: user.role
          }
        }), { headers: corsHeaders() });
      }
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), { status: 401, headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // ============= BUSINESSES =============
  
  async handleUpdateBusiness(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      const updates = await request.json();
      
      // Build dynamic update query
      const allowedFields = [
        'name', 'category', 'subcategory', 'governorate', 'city', 'district',
        'address', 'phone', 'mobile', 'whatsapp', 'email', 'website',
        'facebook', 'instagram', 'bio', 'description', 'latitude', 'longitude',
        'logo_url', 'cover_image_url', 'tags', 'status', 'verified'
      ];
      
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      if (fields.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No valid fields to update'
        }), { status: 400, headers: corsHeaders() });
      }
      
      fields.push('updated_at = datetime("now")');
      values.push(id);
      
      await env.DB.prepare(
        `UPDATE businesses SET ${fields.join(', ')} WHERE id = ?`
      ).bind(...values).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Business updated successfully'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleDeleteBusiness(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const id = new URL(request.url).pathname.split('/').pop();
      
      await env.DB.prepare('DELETE FROM businesses WHERE id = ?').bind(id).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Business deleted successfully'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // ============= POSTS =============
  
  async handleCreatePost(request, env) {
    try {
      const post = await request.json();
      const id = post.id || `post_${Date.now()}`;
      
      await env.DB.prepare(`
        INSERT INTO posts (id, business_id, type, title, content, image_url, 
          category, governorate, tags, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        id,
        post.business_id || 'custom',
        post.type || 'social',
        post.title || '',
        post.content || '',
        post.image_url || '',
        post.category || '',
        post.governorate || '',
        post.tags || '',
        post.status || 'active'
      ).run();
      
      return new Response(JSON.stringify({
        success: true,
        data: { id }
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleUpdatePost(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const id = new URL(request.url).pathname.split('/').pop();
      const updates = await request.json();
      
      const allowedFields = [
        'title', 'content', 'image_url', 'category', 'governorate', 
        'tags', 'status', 'pinned'
      ];
      
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      if (fields.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No valid fields to update'
        }), { status: 400, headers: corsHeaders() });
      }
      
      fields.push('updated_at = datetime("now")');
      values.push(id);
      
      await env.DB.prepare(
        `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`
      ).bind(...values).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Post updated successfully'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleDeletePost(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const id = new URL(request.url).pathname.split('/').pop();
      
      await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Post deleted successfully'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // ============= POST INTERACTIONS =============
  
  async handleLikePost(request, env) {
    try {
      const { post_id, user_id } = await request.json();
      const id = `like_${post_id}_${user_id || 'anon'}`;
      
      // Check if already liked
      const existing = await env.DB.prepare(
        'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?'
      ).bind(post_id, user_id || 'anonymous').first();
      
      if (existing) {
        // Unlike
        await env.DB.prepare(
          'DELETE FROM post_likes WHERE id = ?'
        ).bind(existing.id).run();
        
        await env.DB.prepare(
          'UPDATE posts SET likes = likes - 1 WHERE id = ?'
        ).bind(post_id).run();
        
        return new Response(JSON.stringify({
          success: true,
          liked: false
        }), { headers: corsHeaders() });
      }
      
      // Like
      await env.DB.prepare(
        'INSERT INTO post_likes (id, post_id, user_id) VALUES (?, ?, ?)'
      ).bind(id, post_id, user_id || 'anonymous').run();
      
      await env.DB.prepare(
        'UPDATE posts SET likes = likes + 1 WHERE id = ?'
      ).bind(post_id).run();
      
      return new Response(JSON.stringify({
        success: true,
        liked: true
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleCommentOnPost(request, env) {
    try {
      const { post_id, text, username, user_id } = await request.json();
      const id = `comment_${Date.now()}`;
      
      await env.DB.prepare(`
        INSERT INTO comments (id, post_id, user_id, username, text, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).bind(id, post_id, user_id || 'anonymous', username || 'Anonymous', text).run();
      
      // Update post comment count
      await env.DB.prepare(
        'UPDATE posts SET comments = comments + 1 WHERE id = ?'
      ).bind(post_id).run();
      
      return new Response(JSON.stringify({
        success: true,
        data: { id }
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleSharePost(request, env) {
    try {
      const { post_id, platform, user_id } = await request.json();
      const id = `share_${Date.now()}`;
      
      await env.DB.prepare(`
        INSERT INTO post_shares (id, post_id, user_id, platform, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(id, post_id, user_id || 'anonymous', platform || 'unknown').run();
      
      await env.DB.prepare(
        'UPDATE posts SET shares = shares + 1 WHERE id = ?'
      ).bind(post_id).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Shared successfully'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // ============= HERO SLIDES =============
  
  async handleGetHeroSlides(request, env) {
    try {
      const slides = await env.DB.prepare(
        'SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC'
      ).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: slides.results || []
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleCreateHeroSlide(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const slide = await request.json();
      const id = slide.id || `hero_${Date.now()}`;
      
      await env.DB.prepare(`
        INSERT INTO hero_slides (id, title, subtitle, image_url, cta_text, cta_link, 
          governorate, category, sort_order, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, slide.title, slide.subtitle || '', slide.image_url, 
        slide.cta_text || '', slide.cta_link || '', slide.governorate || '',
        slide.category || '', slide.sort_order || 0, slide.active ?? 1
      ).run();
      
      return new Response(JSON.stringify({
        success: true,
        data: { id }
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleUpdateHeroSlide(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const id = new URL(request.url).pathname.split('/').pop();
      const updates = await request.json();
      
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (['title', 'subtitle', 'image_url', 'cta_text', 'cta_link', 
             'governorate', 'category', 'sort_order', 'active'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      if (fields.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No valid fields to update'
        }), { status: 400, headers: corsHeaders() });
      }
      
      fields.push('updated_at = datetime("now")');
      values.push(id);
      
      await env.DB.prepare(
        `UPDATE hero_slides SET ${fields.join(', ')} WHERE id = ?`
      ).bind(...values).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Hero slide updated'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleDeleteHeroSlide(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const id = new URL(request.url).pathname.split('/').pop();
      await env.DB.prepare('DELETE FROM hero_slides WHERE id = ?').bind(id).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Hero slide deleted'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // ============= BANNERS =============
  
  async handleGetBanners(request, env) {
    try {
      const url = new URL(request.url);
      const position = url.searchParams.get('position');
      
      let query = 'SELECT * FROM banners WHERE active = 1';
      const params = [];
      
      if (position) {
        query += ' AND position = ?';
        params.push(position);
      }
      
      query += ' ORDER BY sort_order ASC';
      
      const banners = await env.DB.prepare(query).bind(...params).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: banners.results || []
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // ============= DASHBOARD STATS =============
  
  async handleGetStats(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const stats = await env.DB.prepare(`
        SELECT 
          (SELECT COUNT(*) FROM businesses) as total_businesses,
          (SELECT COUNT(*) FROM businesses WHERE status = 'active') as active_businesses,
          (SELECT COUNT(*) FROM posts) as total_posts,
          (SELECT COUNT(*) FROM posts WHERE status = 'active') as active_posts,
          (SELECT COUNT(*) FROM comments) as total_comments,
          (SELECT COUNT(*) FROM import_jobs) as total_imports,
          (SELECT COUNT(*) FROM likes) as total_likes
      `).first();
      
      return new Response(JSON.stringify({
        success: true,
        data: stats
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // ============= COMMENTS MODERATION =============
  
  async handleGetComments(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const url = new URL(request.url);
      const post_id = url.searchParams.get('post_id');
      
      let query = 'SELECT c.*, p.title as post_title FROM comments c LEFT JOIN posts p ON c.post_id = p.id';
      const params = [];
      
      if (post_id) {
        query += ' WHERE c.post_id = ?';
        params.push(post_id);
      }
      
      query += ' ORDER BY c.created_at DESC LIMIT 100';
      
      const comments = await env.DB.prepare(query).bind(...params).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: comments.results || []
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },
  
  async handleDeleteComment(request, env) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
    
    try {
      const id = new URL(request.url).pathname.split('/').pop();
      const comment = await env.DB.prepare('SELECT post_id FROM comments WHERE id = ?').bind(id).first();
      
      await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
      
      if (comment) {
        await env.DB.prepare(
          'UPDATE posts SET comments = MAX(0, comments - 1) WHERE id = ?'
        ).bind(comment.post_id).run();
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Comment deleted'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  }
};

export const adminApi = AdminAPI;
