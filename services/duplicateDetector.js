/**
 * Duplicate Detection Service
 * Detects duplicate businesses by phone, whatsapp, name similarity, website, coordinates
 */

export class DuplicateDetector {
  /**
   * Check if a business is a duplicate
   * @param {Object} business - Business data to check
   * @param {Object} env - Cloudflare environment with DB access
   * @returns {Promise<Object>} { isDuplicate: boolean, existingId: string, matchType: string }
   */
  static async checkDuplicate(business, env) {
    const checks = [];

    // Check by phone
    if (business.phone) {
      const phoneMatch = await this.checkByPhone(business.phone, env);
      if (phoneMatch) checks.push({ type: 'phone', match: phoneMatch });
    }

    // Check by mobile
    if (business.mobile) {
      const mobileMatch = await this.checkByPhone(business.mobile, env);
      if (mobileMatch) checks.push({ type: 'mobile', match: mobileMatch });
    }

    // Check by whatsapp
    if (business.whatsapp) {
      const whatsappMatch = await this.checkByPhone(business.whatsapp, env);
      if (whatsappMatch) checks.push({ type: 'whatsapp', match: whatsappMatch });
    }

    // Check by website
    if (business.website) {
      const websiteMatch = await this.checkByWebsite(business.website, env);
      if (websiteMatch) checks.push({ type: 'website', match: websiteMatch });
    }

    // Check by name + governorate
    if (business.name && business.governorate) {
      const nameMatch = await this.checkByNameAndGovernorate(business.name, business.governorate, env);
      if (nameMatch) checks.push({ type: 'name_governorate', match: nameMatch });
    }

    // Check by coordinates (if both lat and lon provided)
    if (business.latitude && business.longitude) {
      const coordMatch = await this.checkByCoordinates(business.latitude, business.longitude, env);
      if (coordMatch) checks.push({ type: 'coordinates', match: coordMatch });
    }

    // Determine if duplicate based on checks
    if (checks.length > 0) {
      // Prioritize: phone/whatsapp > website > name > coordinates
      const priority = ['phone', 'mobile', 'whatsapp', 'website', 'name_governorate', 'coordinates'];
      checks.sort((a, b) => priority.indexOf(a.type) - priority.indexOf(b.type));

      return {
        isDuplicate: true,
        existingId: checks[0].match.id,
        matchType: checks[0].type,
        existingBusiness: checks[0].match,
        allMatches: checks
      };
    }

    return { isDuplicate: false };
  }

  /**
   * Check duplicate by phone number
   */
  static async checkByPhone(phone, env) {
    const normalizedPhone = this.normalizePhone(phone);
    const result = await env.DB.prepare(
      'SELECT id, name, governorate, phone, mobile, whatsapp FROM businesses WHERE phone = ? OR mobile = ? OR whatsapp = ? LIMIT 1'
    ).bind(normalizedPhone, normalizedPhone, normalizedPhone).first();

    return result;
  }

  /**
   * Check duplicate by website
   */
  static async checkByWebsite(website, env) {
    const normalizedWebsite = this.normalizeURL(website);
    const result = await env.DB.prepare(
      'SELECT id, name, governorate, website FROM businesses WHERE website = ? LIMIT 1'
    ).bind(normalizedWebsite).first();

    return result;
  }

  /**
   * Check duplicate by name and governorate
   */
  static async checkByNameAndGovernorate(name, governorate, env) {
    const normalizedName = this.normalizeName(name);
    const result = await env.DB.prepare(
      'SELECT id, name, governorate FROM businesses WHERE name_normalized = ? AND governorate = ? LIMIT 1'
    ).bind(normalizedName, governorate).first();

    return result;
  }

  /**
   * Check duplicate by coordinates (within 100 meters)
   */
  static async checkByCoordinates(lat, lon, env) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const threshold = 0.001; // ~100 meters

    const result = await env.DB.prepare(
      `SELECT id, name, governorate, latitude, longitude 
       FROM businesses 
       WHERE ABS(latitude - ?) < ? AND ABS(longitude - ?) < ?
       LIMIT 1`
    ).bind(latitude, threshold, longitude, threshold).first();

    return result;
  }

  /**
   * Normalize phone number for comparison
   */
  static normalizePhone(phone) {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  }

  /**
   * Normalize URL for comparison
   */
  static normalizeURL(url) {
    if (!url) return '';
    return url.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  }

  /**
   * Normalize name for comparison
   */
  static normalizeName(name) {
    if (!name) return '';
    return name.toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\u0600-\u06FF\u0750-\u077F\s]/g, '');
  }

  /**
   * Calculate similarity between two names (Levenshtein distance)
   */
  static calculateSimilarity(name1, name2) {
    if (!name1 || !name2) return 0;
    
    const n1 = this.normalizeName(name1);
    const n2 = this.normalizeName(name2);
    
    if (n1 === n2) return 1;
    
    const distance = this.levenshteinDistance(n1, n2);
    const maxLen = Math.max(n1.length, n2.length);
    
    return 1 - (distance / maxLen);
  }

  /**
   * Levenshtein distance algorithm
   */
  static levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],
            dp[i][j - 1],
            dp[i - 1][j - 1]
          );
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Find all potential duplicates in the database
   */
  static async findPotentialDuplicates(env, limit = 100) {
    // Find businesses with same phone numbers
    const phoneDuplicates = await env.DB.prepare(`
      SELECT phone, COUNT(*) as count 
      FROM businesses 
      WHERE phone IS NOT NULL AND phone != ''
      GROUP BY phone 
      HAVING count > 1
      LIMIT ${limit}
    `).all();

    const duplicates = [];

    for (const dup of phoneDuplicates.results) {
      const businesses = await env.DB.prepare(`
        SELECT id, name, governorate, phone 
        FROM businesses 
        WHERE phone = ?
      `).bind(dup.phone).all();

      if (businesses.results.length > 1) {
        duplicates.push({
          type: 'phone',
          value: dup.phone,
          businesses: businesses.results
        });
      }
    }

    return duplicates;
  }

  /**
   * Merge duplicate businesses
   */
  static async mergeDuplicates(primaryId, duplicateIds, env) {
    const results = {
      merged: 0,
      failed: 0,
      errors: []
    };

    for (const dupId of duplicateIds) {
      try {
        // Update posts to reference primary business
        await env.DB.prepare(`
          UPDATE posts SET business_id = ? WHERE business_id = ?
        `).bind(primaryId, dupId).run();

        // Mark duplicate as merged
        await env.DB.prepare(`
          UPDATE businesses SET status = 'merged', duplicate_of = ? WHERE id = ?
        `).bind(primaryId, dupId).run();

        results.merged++;
      } catch (error) {
        results.failed++;
        results.errors.push({ id: dupId, error: error.message });
      }
    }

    return results;
  }
}
