/**
 * Post Generator Service
 * Automatically generates business postcards/feed cards for imported businesses
 */

export class PostGenerator {
  /**
   * Generate a business card post for a business
   */
  static async generateBusinessCard(businessId, business, env) {
    const postId = this.generateId();

    // Generate post content
    const title = business.name;
    const content = business.bio || business.description || '';
    
    // Use cover image or logo
    const imageUrl = business.cover_image_url || business.logo_url || '';

    const post = {
      id: postId,
      business_id: businessId,
      type: 'business_card',
      title,
      content: this.truncateContent(content, 200),
      image_url: imageUrl,
      category: business.category,
      governorate: business.governorate,
      tags: business.tags || '',
      status: 'active',
      created_at: new Date().toISOString()
    };

    await env.DB.prepare(`
      INSERT INTO posts (id, business_id, type, title, content, image_url, category, governorate, tags, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      post.id,
      post.business_id,
      post.type,
      post.title,
      post.content,
      post.image_url,
      post.category,
      post.governorate,
      post.tags,
      post.status,
      post.created_at
    ).run();

    return postId;
  }

  /**
   * Generate multiple business cards in batch
   */
  static async generateBatch(businessIds, env) {
    const results = { generated: 0, failed: 0 };

    for (const businessId of businessIds) {
      try {
        const business = await env.DB.prepare('SELECT * FROM businesses WHERE id = ?').bind(businessId).first();
        if (business) {
          await this.generateBusinessCard(businessId, business, env);
          results.generated++;
        }
      } catch (error) {
        results.failed++;
      }
    }

    return results;
  }

  /**
   * Truncate content to specified length
   */
  static truncateContent(content, maxLength) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }

  /**
   * Generate promotional post
   */
  static async generatePromotion(businessId, promotionData, env) {
    const postId = this.generateId();
    const business = await env.DB.prepare('SELECT * FROM businesses WHERE id = ?').bind(businessId).first();
    
    if (!business) throw new Error('Business not found');

    const post = {
      id: postId,
      business_id: businessId,
      type: 'promotion',
      title: promotionData.title || `Special Offer from ${business.name}`,
      content: promotionData.content || '',
      image_url: promotionData.image_url || business.cover_image_url || business.logo_url || '',
      category: business.category,
      governorate: business.governorate,
      tags: promotionData.tags || 'promotion,sale',
      status: 'active',
      created_at: new Date().toISOString()
    };

    await env.DB.prepare(`
      INSERT INTO posts (id, business_id, type, title, content, image_url, category, governorate, tags, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      post.id,
      post.business_id,
      post.type,
      post.title,
      post.content,
      post.image_url,
      post.category,
      post.governorate,
      post.tags,
      post.status,
      post.created_at
    ).run();

    return postId;
  }

  /**
   * Pin a post
   */
  static async pinPost(postId, env) {
    await env.DB.prepare('UPDATE posts SET pinned = 1 WHERE id = ?').bind(postId).run();
  }

  /**
   * Unpin a post
   */
  static async unpinPost(postId, env) {
    await env.DB.prepare('UPDATE posts SET pinned = 0 WHERE id = ?').bind(postId).run();
  }

  /**
   * Delete a post
   */
  static async deletePost(postId, env) {
    await env.DB.prepare('UPDATE posts SET status = ? WHERE id = ?').bind('deleted', postId).run();
  }

  /**
   * Hide a post
   */
  static async hidePost(postId, env) {
    await env.DB.prepare('UPDATE posts SET status = ? WHERE id = ?').bind('hidden', postId).run();
  }

  /**
   * Regenerate posts for a business
   */
  static async regenerateForBusiness(businessId, env) {
    // Delete existing posts
    await env.DB.prepare('DELETE FROM posts WHERE business_id = ?').bind(businessId).run();

    // Generate new post
    const business = await env.DB.prepare('SELECT * FROM businesses WHERE id = ?').bind(businessId).first();
    if (business) {
      return await this.generateBusinessCard(businessId, business, env);
    }

    throw new Error('Business not found');
  }

  /**
   * Generate unique ID
   */
  static generateId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
