import { Hono } from 'hono';
import { successResponse, errorResponse } from '../utils/response';
import { DatabaseClient } from '../db/client';
import type { Bindings, Variables } from '../types';

const feed = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// GET /feed/business-posts
feed.get('/business-posts', async (c) => {
  try {
    const query = c.req.query();
    const limit = parseInt(query.limit || '30');
    const page = parseInt(query.page || '1');
    const offset = (page - 1) * limit;

    const db = new DatabaseClient(c.env.DB);
    
    // Get businesses with their posts (for now, return businesses as posts)
    const businessResults = await db.getBusinesses({
      limit,
      offset,
      category: query.category,
      city: query.city,
      governorate: query.governorate,
      search: query.search
    });

    // Transform businesses to post format
    const posts = businessResults.map((biz: any) => ({
      id: `post-${biz.id}`,
      businessId: biz.id,
      businessName: biz.name,
      businessAvatar: biz.logo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      category: biz.category,
      governorate: biz.governorate,
      mediaUrl: biz.cover_image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
      caption: {
        ar: biz.description || '',
        ku: biz.description || '',
        en: biz.description || ''
      },
      likes: biz.likes || 0,
      commentsCount: 0,
      shares: 0,
      timeAgo: {
        ar: 'منذ ساعة',
        ku: '1 کاتژمێر پێش ئێستا',
        en: '1 hour ago'
      },
      likedByUser: false,
      savedByUser: false,
      comments: []
    }));

    return c.json({
      success: true,
      data: posts,
      pagination: {
        total: posts.length,
        page,
        limit,
        hasNext: false,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Feed error:', error);
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to fetch feed posts');
  }
});

// POST /feed/posts (create post - placeholder)
feed.post('/posts', async (c) => {
  try {
    const data = await c.req.json();
    // Placeholder for post creation
    return c.json({
      success: true,
      data: { id: `post-${Date.now()}`, ...data }
    });
  } catch (error) {
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to create post');
  }
});

// POST /feed/posts/like (like post - placeholder)
feed.post('/posts/like', async (c) => {
  try {
    const { postId } = await c.req.json();
    // Placeholder for like functionality
    return c.json({
      success: true,
      data: { postId, liked: true }
    });
  } catch (error) {
    return errorResponse(c, 'INTERNAL_ERROR', 'Failed to like post');
  }
});

export { feed as feedRoutes };
