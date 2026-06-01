/**
 * Phone Onboarding & Business Claiming API
 * POST /api/onboard/lookup  — search businesses by phone number
 * POST /api/onboard/claim   — claim ownership of a business by phone
 * POST /api/onboard/create  — create a new minimal business listing
 */

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}

function normalizePhone(phone) {
  // Strip spaces, dashes, parens; keep + prefix
  return (phone || '').replace(/[\s\-()]/g, '');
}

export const OnboardAPI = {

  /**
   * POST /api/onboard/lookup
   * Body: { phone: string, governorate?: string }
   * Returns: { matches: Business[] }
   * Searches mobile + phone columns (normalized) for partial match
   */
  async handleLookup(request, env) {
    try {
      const { phone, governorate } = await request.json();

      if (!phone || phone.trim().length < 7) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Phone number too short'
        }), { status: 400, headers: corsHeaders() });
      }

      const normalized = normalizePhone(phone);

      // Search mobile AND phone columns — partial match both directions
      let query = `
        SELECT id, name, category, governorate, city, address, mobile, phone, logo_url, cover_image_url, owner_phone, verified, status
        FROM businesses
        WHERE status = 'active'
          AND (
            REPLACE(REPLACE(REPLACE(mobile, ' ', ''), '-', ''), '(', '') LIKE ?
            OR REPLACE(REPLACE(REPLACE(phone,  ' ', ''), '-', ''), '(', '') LIKE ?
          )
      `;
      const likeVal = `%${normalized}%`;
      const params = [likeVal, likeVal];

      if (governorate && governorate !== 'all') {
        query += ' AND LOWER(governorate) = LOWER(?)';
        params.push(governorate);
      }

      query += ' LIMIT 10';

      const result = await env.DB.prepare(query).bind(...params).all();
      const matches = (result.results || []).map(b => ({
        id: b.id,
        name: b.name,
        category: b.category,
        governorate: b.governorate,
        city: b.city,
        address: b.address,
        mobile: b.mobile,
        logo_url: b.logo_url,
        cover_image_url: b.cover_image_url,
        verified: !!b.verified,
        already_claimed: !!b.owner_phone,
        claimed_by_you: normalizePhone(b.owner_phone) === normalized
      }));

      return new Response(JSON.stringify({
        success: true,
        matches,
        total: matches.length
      }), { headers: corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  /**
   * POST /api/onboard/claim
   * Body: { phone: string, businessId: string }
   * Sets owner_phone on the business row — idempotent if same phone
   */
  async handleClaim(request, env) {
    try {
      const { phone, businessId } = await request.json();

      if (!phone || !businessId) {
        return new Response(JSON.stringify({
          success: false,
          error: 'phone and businessId are required'
        }), { status: 400, headers: corsHeaders() });
      }

      const normalized = normalizePhone(phone);

      // Check business exists
      const biz = await env.DB.prepare(
        'SELECT id, name, owner_phone FROM businesses WHERE id = ?'
      ).bind(businessId).first();

      if (!biz) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Business not found'
        }), { status: 404, headers: corsHeaders() });
      }

      // Already claimed by someone else
      if (biz.owner_phone && normalizePhone(biz.owner_phone) !== normalized) {
        return new Response(JSON.stringify({
          success: false,
          error: 'This business is already claimed by another owner'
        }), { status: 409, headers: corsHeaders() });
      }

      // Set owner_phone
      await env.DB.prepare(
        'UPDATE businesses SET owner_phone = ?, updated_at = datetime("now") WHERE id = ?'
      ).bind(normalized, businessId).run();

      return new Response(JSON.stringify({
        success: true,
        message: 'Business claimed successfully',
        businessId,
        businessName: biz.name
      }), { headers: corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  /**
   * POST /api/onboard/create
   * Body: { phone: string, governorate: string, name?: string }
   * Creates a minimal new business listing owned by this phone
   */
  async handleCreate(request, env) {
    try {
      const { phone, governorate, name } = await request.json();

      if (!phone || !governorate) {
        return new Response(JSON.stringify({
          success: false,
          error: 'phone and governorate are required'
        }), { status: 400, headers: corsHeaders() });
      }

      const normalized = normalizePhone(phone);
      const bizId = `biz_${Date.now()}`;
      const bizName = (name || '').trim() || 'My Business';

      await env.DB.prepare(`
        INSERT INTO businesses (id, name, governorate, mobile, owner_phone, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
      `).bind(bizId, bizName, governorate, normalized, normalized).run();

      return new Response(JSON.stringify({
        success: true,
        message: 'Business created',
        businessId: bizId,
        businessName: bizName
      }), { headers: corsHeaders() });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  }
};
