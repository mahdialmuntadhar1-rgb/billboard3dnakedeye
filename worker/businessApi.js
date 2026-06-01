/**
 * Business API Endpoints
 * Handles business CRUD, filtering, search, and pagination
 */

export const BusinessAPI = {
  /**
   * GET /api/businesses
   * Get businesses with filtering, search, and pagination
   */
  async handleGetBusinesses(request, env) {
    const url = new URL(request.url);
    const params = {
      governorate: url.searchParams.get('governorate'),
      category: url.searchParams.get('category'),
      subcategory: url.searchParams.get('subcategory'),
      city: url.searchParams.get('city'),
      tags: url.searchParams.get('tags'),
      search: url.searchParams.get('search'),
      language: url.searchParams.get('language'),
      status: url.searchParams.get('status') || 'active',
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '20')
    };

    try {
      const offset = (params.page - 1) * params.limit;

      // Build query
      let query = 'SELECT * FROM businesses WHERE status = ?';
      const queryParams = [params.status];

      if (params.governorate) {
        query += ' AND LOWER(governorate) = LOWER(?)';
        queryParams.push(params.governorate);
      }

      if (params.category) {
        query += ' AND LOWER(category) = LOWER(?)';
        queryParams.push(params.category);
      }

      if (params.subcategory) {
        query += ' AND subcategory = ?';
        queryParams.push(params.subcategory);
      }

      if (params.city) {
        query += ' AND city = ?';
        queryParams.push(params.city);
      }

      if (params.language) {
        query += ' AND language = ?';
        queryParams.push(params.language);
      }

      if (params.tags) {
        query += ' AND tags LIKE ?';
        queryParams.push(`%${params.tags}%`);
      }

      // Full-text search
      if (params.search) {
        query += ' AND id IN (SELECT rowid FROM businesses_fts WHERE businesses_fts MATCH ?)';
        queryParams.push(params.search);
      }

      // Get total count
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
      const countResult = await env.DB.prepare(countQuery).bind(...queryParams).first();
      const total = countResult?.total || 0;

      // Get paginated results
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(params.limit, offset);

      const businesses = await env.DB.prepare(query).bind(...queryParams).all();

      const totalPages = Math.ceil(total / params.limit);

      return new Response(JSON.stringify({
        success: true,
        data: businesses.results || [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages,
          hasNext: params.page < totalPages,
          hasPrev: params.page > 1
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
   * GET /api/businesses/:id
   * Get single business by ID
   */
  async handleGetBusiness(request, env) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    try {
      const business = await env.DB.prepare('SELECT * FROM businesses WHERE id = ?').bind(id).first();

      if (!business) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Business not found'
        }), { status: 404, headers: this.corsHeaders() });
      }

      return new Response(JSON.stringify({
        success: true,
        data: business
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * GET /api/feed/business-posts
   * Get feed posts with filtering and pagination
   */
  async handleGetFeedPosts(request, env) {
    const url = new URL(request.url);
    const params = {
      category: url.searchParams.get('category'),
      governorate: url.searchParams.get('governorate'),
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '20')
    };

    try {
      const offset = (params.page - 1) * params.limit;

      let query = 'SELECT * FROM v_feed_posts WHERE 1=1';
      const queryParams = [];

      if (params.category) {
        query += ' AND category = ?';
        queryParams.push(params.category);
      }

      if (params.governorate) {
        query += ' AND governorate = ?';
        queryParams.push(params.governorate);
      }

      // Get total count
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
      const countResult = await env.DB.prepare(countQuery).bind(...queryParams).first();
      const total = countResult?.total || 0;

      // Get paginated results
      query += ' ORDER BY pinned DESC, created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(params.limit, offset);

      const posts = await env.DB.prepare(query).bind(...queryParams).all();

      const totalPages = Math.ceil(total / params.limit);

      return new Response(JSON.stringify({
        success: true,
        data: posts.results || [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages,
          hasNext: params.page < totalPages,
          hasPrev: params.page > 1
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
   * GET /api/governorates
   * Get unique governorates
   */
  async handleGetGovernorates(request, env) {
    try {
      const governorates = await env.DB.prepare(
        'SELECT DISTINCT governorate FROM businesses WHERE governorate IS NOT NULL ORDER BY governorate ASC'
      ).all();

      return new Response(JSON.stringify({
        success: true,
        data: governorates.results?.map(r => r.governorate) || []
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * GET /api/categories
   * Get unique categories
   */
  async handleGetCategories(request, env) {
    try {
      const categories = await env.DB.prepare(
        'SELECT DISTINCT category FROM businesses WHERE category IS NOT NULL ORDER BY category ASC'
      ).all();

      return new Response(JSON.stringify({
        success: true,
        data: categories.results?.map(r => r.category) || []
      }), { headers: this.corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: this.corsHeaders() });
    }
  },

  /**
   * GET /api/cities
   * Get unique cities
   */
  async handleGetCities(request, env) {
    try {
      const governorate = new URL(request.url).searchParams.get('governorate');
      
      let query = 'SELECT DISTINCT city FROM businesses WHERE city IS NOT NULL';
      const params = [];

      if (governorate) {
        query += ' AND governorate = ?';
        params.push(governorate);
      }

      query += ' ORDER BY city ASC';

      const cities = await env.DB.prepare(query).bind(...params).all();

      return new Response(JSON.stringify({
        success: true,
        data: cities.results?.map(r => r.city) || []
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
