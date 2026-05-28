import { Hono } from 'hono';
import { successResponse, errorResponse } from '../utils/response';
import { JWTUtils } from '../utils/jwt';
import { DatabaseClient } from '../db/client';
import { PaginationUtils } from '../utils/pagination';
import { getBusinessImageUrl } from '../utils/business-images';
import type { Bindings, Variables } from '../types';
import type { BusinessDTO, BusinessListResponseDTO, BusinessDetailResponseDTO, CreateBusinessDTO, UpdateBusinessDTO } from '../dtos/business.dto';

const businesses = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Authentication middleware for protected routes
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  const token = JWTUtils.extractFromHeader(authHeader || '');

  if (!token) {
    return errorResponse(c, 'UNAUTHORIZED', 'Authorization token required', 401);
  }

  JWTUtils.setSecret(c.env.JWT_SECRET);
  const payload = await JWTUtils.verify(token);

  if (!payload) {
    return errorResponse(c, 'UNAUTHORIZED', 'Invalid or expired token', 401);
  }

  c.set('userId', payload.sub);
  c.set('userRole', payload.role);
  await next();
};

// GET /businesses — supports both offset (legacy) and cursor (new) pagination
businesses.get('/', async (c) => {
  try {
    const query = c.req.query();
    const db = new DatabaseClient(c.env.DB);

    const limit = Math.min(parseInt(query.limit || '20', 10), 50);

    // ── Cursor-based (keyset) pagination (default for 8000+ rows) ──
    // Use cursor mode unless explicit ?page=N is provided (legacy offset)
    if (query.page === undefined) {
      const businessResults = await db.getBusinessesCursor({
        limit,
        cursor: query.cursor || undefined,
        category: query.category,
        city: query.city,
        governorate: query.governorate,
        search: query.search
      });

      const hasMore = businessResults.length > limit;
      const rows = hasMore ? businessResults.slice(0, limit) : businessResults;
      const nextCursor = hasMore ? (rows[rows.length - 1] as any)?.id : null;

      const businessDTOs: BusinessDTO[] = rows.map((biz: any) => ({
        id: biz.id as string,
        name: biz.name as string,
        description: biz.description as string,
        bio: biz.bio as string | undefined,
        category: biz.category as string,
        city: biz.city as string,
        governorate: biz.governorate as string | undefined,
        country: biz.country as string,
        website: biz.website as string | undefined,
        email: biz.email as string | undefined,
        phone: biz.phone as string | undefined,
        mobile: biz.mobile as string | undefined,
        address: biz.address as string | undefined,
        coverImageUrl: getBusinessImageUrl(
          biz.id as string,
          biz.category as string,
          biz.cover_image_url as string | null
        ),
        logoUrl: biz.logo_url as string | undefined,
        rating: (biz.rating as number) || 0,
        reviewCount: (biz.review_count as number) || 0,
        views: (biz.views as number) || 0,
        likes: (biz.likes as number) || 0,
        saves: (biz.saves as number) || 0,
        verified: biz.verified === 1,
        isActive: biz.is_active === 1,
        createdAt: biz.created_at as string,
        updatedAt: biz.updated_at as string
      }));

      // Cache first page for 60s
      if (!query.cursor) {
        c.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      }

      return c.json({
        success: true,
        data: businessDTOs,
        next_cursor: nextCursor,
        has_more: hasMore,
      });
    }

    // ── Legacy offset pagination (kept for backward compat) ──
    const pagination = PaginationUtils.parseParams(query);

    const businessResults = await db.getBusinesses({
      limit: pagination.limit,
      offset: pagination.offset,
      category: query.category,
      city: query.city,
      governorate: query.governorate,
      search: query.search
    });

    const countResult = await db.getBusinessesCount({
      category: query.category,
      city: query.city,
      governorate: query.governorate,
      search: query.search
    });
    const total = typeof countResult === 'number' ? countResult : (countResult as any)?.count || 0;

    const meta = PaginationUtils.buildMeta(total, pagination);

    const businessDTOs: BusinessDTO[] = businessResults.map((biz: any) => ({
      id: biz.id as string,
      name: biz.name as string,
      description: biz.description as string,
      bio: biz.bio as string | undefined,
      category: biz.category as string,
      city: biz.city as string,
      governorate: biz.governorate as string | undefined,
      country: biz.country as string,
      website: biz.website as string | undefined,
      email: biz.email as string | undefined,
      phone: biz.phone as string | undefined,
      mobile: biz.mobile as string | undefined,
      address: biz.address as string | undefined,
      coverImageUrl: getBusinessImageUrl(
        biz.id as string,
        biz.category as string,
        biz.cover_image_url as string | null
      ),
      logoUrl: biz.logo_url as string | undefined,
      rating: (biz.rating as number) || 0,
      reviewCount: (biz.review_count as number) || 0,
      views: (biz.views as number) || 0,
      likes: (biz.likes as number) || 0,
      saves: (biz.saves as number) || 0,
      verified: biz.verified === 1,
      isActive: biz.is_active === 1,
      createdAt: biz.created_at as string,
      updatedAt: biz.updated_at as string
    }));

    return c.json({
      success: true,
      data: businessDTOs,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        hasNext: meta.hasNext,
        hasPrev: meta.hasPrev
      },
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        hasNext: meta.hasNext,
        hasPrev: meta.hasPrev
      }
    });
  } catch (error) {
    console.error('Businesses fetch error:', error);
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to fetch businesses');
  }
});

// GET /businesses/:id
businesses.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!id) {
      return errorResponse(c, 'VALIDATION_ERROR', 'Business ID is required');
    }

    const db = new DatabaseClient(c.env.DB);
    const business = await db.getBusinessById(id);

    if (!business) {
      return errorResponse(c, 'NOT_FOUND', 'Business not found', 404);
    }

    // Transform to DTO format with all fields
    const businessDTO: BusinessDTO = {
      id: business.id as string,
      name: business.name as string,
      description: business.description as string,
      bio: business.bio as string | undefined,
      category: business.category as string,
      city: business.city as string,
      governorate: business.governorate as string | undefined,
      country: business.country as string,
      website: business.website as string | undefined,
      email: business.email as string | undefined,
      phone: business.phone as string | undefined,
      mobile: business.mobile as string | undefined,
      address: business.address as string | undefined,
      coverImageUrl: getBusinessImageUrl(
        business.id as string,
        business.category as string,
        business.cover_image_url as string | null
      ),
      logoUrl: business.logo_url as string | undefined,
      rating: (business.rating as number) || 0,
      reviewCount: (business.review_count as number) || 0,
      views: (business.views as number) || 0,
      likes: (business.likes as number) || 0,
      saves: (business.saves as number) || 0,
      verified: business.verified === 1,
      isActive: business.is_active === 1,
      createdAt: business.created_at as string,
      updatedAt: business.updated_at as string
    };

    // Return DTO-compliant response
    const response: BusinessDetailResponseDTO = {
      success: true,
      data: businessDTO
    };

    return c.json(response);
  } catch (error) {
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to fetch business');
  }
});

// POST /businesses (protected)
businesses.post('/', authMiddleware, async (c) => {
  try {
    const userRole = c.get('userRole');
    if (userRole !== 'admin') {
      return errorResponse(c, 'FORBIDDEN', 'Admin access required', 403);
    }

    const data: CreateBusinessDTO = await c.req.json();

    // Validate required fields
    if (!data.name || !data.description || !data.category || !data.city || !data.country) {
      return errorResponse(c, 'VALIDATION_ERROR', 'Name, description, category, city, and country are required');
    }

    const db = new DatabaseClient(c.env.DB);
    const businessId = await db.createBusiness(data);

    if (!businessId) {
      return errorResponse(c, 'CREATION_FAILED', 'Failed to create business');
    }

    // Get created business
    const business = await db.getBusinessById(businessId);
    if (!business) {
      return errorResponse(c, 'CREATION_FAILED', 'Failed to retrieve created business');
    }

    // Transform to DTO format with all fields
    const businessDTO: BusinessDTO = {
      id: business.id as string,
      name: business.name as string,
      description: business.description as string,
      bio: business.bio as string | undefined,
      category: business.category as string,
      city: business.city as string,
      governorate: business.governorate as string | undefined,
      country: business.country as string,
      website: business.website as string | undefined,
      email: business.email as string | undefined,
      phone: business.phone as string | undefined,
      mobile: business.mobile as string | undefined,
      address: business.address as string | undefined,
      coverImageUrl: business.cover_image_url as string | undefined,
      logoUrl: business.logo_url as string | undefined,
      rating: (business.rating as number) || 0,
      reviewCount: (business.review_count as number) || 0,
      views: (business.views as number) || 0,
      likes: (business.likes as number) || 0,
      saves: (business.saves as number) || 0,
      verified: business.verified === 1,
      isActive: business.is_active === 1,
      createdAt: business.created_at as string,
      updatedAt: business.updated_at as string
    };

    // Return DTO-compliant response
    const response: BusinessDetailResponseDTO = {
      success: true,
      data: businessDTO
    };

    return c.json(response, 201);
  } catch (error) {
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to create business');
  }
});

// PUT /businesses/:id (protected)
businesses.put('/:id', authMiddleware, async (c) => {
  try {
    const userRole = c.get('userRole');
    if (userRole !== 'admin') {
      return errorResponse(c, 'FORBIDDEN', 'Admin access required', 403);
    }

    const id = c.req.param('id');
    const data: UpdateBusinessDTO = await c.req.json();

    if (!id) {
      return errorResponse(c, 'VALIDATION_ERROR', 'Business ID is required');
    }

    const db = new DatabaseClient(c.env.DB);
    
    // Check if business exists
    const existingBusiness = await db.getBusinessById(id);
    if (!existingBusiness) {
      return errorResponse(c, 'NOT_FOUND', 'Business not found', 404);
    }

    // Update business
    const success = await db.updateBusiness(id, data);
    if (!success) {
      return errorResponse(c, 'UPDATE_FAILED', 'Failed to update business');
    }

    // Get updated business
    const updatedBusiness = await db.getBusinessById(id);
    if (!updatedBusiness) {
      return errorResponse(c, 'UPDATE_FAILED', 'Failed to retrieve updated business');
    }

    // Transform to DTO format with all fields
    const businessDTO: BusinessDTO = {
      id: updatedBusiness.id as string,
      name: updatedBusiness.name as string,
      description: updatedBusiness.description as string,
      bio: updatedBusiness.bio as string | undefined,
      category: updatedBusiness.category as string,
      city: updatedBusiness.city as string,
      governorate: updatedBusiness.governorate as string | undefined,
      country: updatedBusiness.country as string,
      website: updatedBusiness.website as string | undefined,
      email: updatedBusiness.email as string | undefined,
      phone: updatedBusiness.phone as string | undefined,
      mobile: updatedBusiness.mobile as string | undefined,
      address: updatedBusiness.address as string | undefined,
      coverImageUrl: updatedBusiness.cover_image_url as string | undefined,
      logoUrl: updatedBusiness.logo_url as string | undefined,
      rating: (updatedBusiness.rating as number) || 0,
      reviewCount: (updatedBusiness.review_count as number) || 0,
      views: (updatedBusiness.views as number) || 0,
      likes: (updatedBusiness.likes as number) || 0,
      saves: (updatedBusiness.saves as number) || 0,
      verified: updatedBusiness.verified === 1,
      isActive: updatedBusiness.is_active === 1,
      createdAt: updatedBusiness.created_at as string,
      updatedAt: updatedBusiness.updated_at as string
    };

    // Return DTO-compliant response
    const response: BusinessDetailResponseDTO = {
      success: true,
      data: businessDTO
    };

    return c.json(response);
  } catch (error) {
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to update business');
  }
});

// DELETE /businesses/:id (protected)
businesses.delete('/:id', authMiddleware, async (c) => {
  try {
    const userRole = c.get('userRole');
    if (userRole !== 'admin') {
      return errorResponse(c, 'FORBIDDEN', 'Admin access required', 403);
    }

    const id = c.req.param('id');
    
    if (!id) {
      return errorResponse(c, 'VALIDATION_ERROR', 'Business ID is required');
    }

    const db = new DatabaseClient(c.env.DB);
    
    // Check if business exists
    const existingBusiness = await db.getBusinessById(id);
    if (!existingBusiness) {
      return errorResponse(c, 'NOT_FOUND', 'Business not found', 404);
    }

    // Delete business
    const success = await db.deleteBusiness(id);
    if (!success) {
      return errorResponse(c, 'DELETE_FAILED', 'Failed to delete business');
    }

    return successResponse(c, {
      message: 'Business deleted successfully'
    });
  } catch (error) {
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to delete business');
  }
});

export { businesses as businessRoutes };
