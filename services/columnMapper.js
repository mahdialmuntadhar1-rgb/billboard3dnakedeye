/**
 * Column Mapper Service
 * Flexible column mapping system for CSV/Excel imports
 * Handles different column names and missing columns
 */

export class ColumnMapper {
  // Standard column names expected by the system
  static STANDARD_COLUMNS = {
    name: ['name', 'business_name', 'company_name', 'title', 'اسم', 'نام'],
    language: ['language', 'lang', 'اللغة', 'زمان'],
    category: ['category', 'cat', 'type', 'business_type', 'تصنيف', 'دسته‌بندی'],
    subcategory: ['subcategory', 'sub_category', 'sub_cat', 'زیردسته', 'الفئة الفرعية'],
    governorate: ['governorate', 'gov', 'province', 'المحافظة', 'استان'],
    city: ['city', 'town', 'location', 'المدينة', 'شهر'],
    district: ['district', 'area', 'region', 'المنطقة', 'ناحیه'],
    address: ['address', 'addr', 'العنوان', 'آدرس'],
    phone: ['phone', 'telephone', 'tel', 'الهاتف', 'تلفن'],
    mobile: ['mobile', 'cell', 'cellphone', 'الجوال', 'موبایل'],
    whatsapp: ['whatsapp', 'wa', 'واتساب'],
    email: ['email', 'mail', 'البريد الإلكتروني', 'ایمیل'],
    website: ['website', 'site', 'url', 'الموقع', 'وبسایت'],
    facebook: ['facebook', 'fb', 'فيسبوك'],
    instagram: ['instagram', 'ig', 'insta', 'انستغرام'],
    bio: ['bio', 'description', 'about', 'short_desc', 'الوصف', 'بیو'],
    description: ['description', 'desc', 'details', 'full_description', 'التفاصيل'],
    latitude: ['latitude', 'lat', 'lat_coords', 'عرض جغرافیایی'],
    longitude: ['longitude', 'lon', 'lng', 'long_coords', 'طول جغرافیایی'],
    logo_url: ['logo', 'logo_url', 'logo_image', 'شعار'],
    cover_image_url: ['cover', 'cover_image', 'cover_url', 'cover_photo', 'تصویر'],
    tags: ['tags', 'keywords', 'labels', 'وسوم', 'برچسب‌ها']
  };

  /**
   * Map CSV/Excel columns to standard column names
   * @param {string[]} fileHeaders - Headers from the imported file
   * @returns {Object} Mapping object { fileHeader: standardColumn }
   */
  static mapColumns(fileHeaders) {
    const mapping = {};
    const normalizedHeaders = fileHeaders.map(h => this.normalizeHeader(h));
    
    for (const standardCol in this.STANDARD_COLUMNS) {
      const alternatives = this.STANDARD_COLUMNS[standardCol];
      
      for (const alt of alternatives) {
        const normalizedAlt = this.normalizeHeader(alt);
        const matchIndex = normalizedHeaders.findIndex(h => h === normalizedAlt);
        
        if (matchIndex !== -1) {
          mapping[fileHeaders[matchIndex]] = standardCol;
          break;
        }
      }
    }
    
    return mapping;
  }

  /**
   * Normalize header for comparison (lowercase, remove spaces/special chars)
   */
  static normalizeHeader(header) {
    if (!header) return '';
    return String(header)
      .toLowerCase()
      .trim()
      .replace(/[\s_\-]/g, '')
      .replace(/[^\w\u0600-\u06FF\u0750-\u077F]/g, ''); // Keep Arabic/Kurdish
  }

  /**
   * Apply mapping to a row of data
   * @param {Object} row - Raw row from file
   * @param {Object} mapping - Column mapping
   * @returns {Object} Mapped row with standard column names
   */
  static applyMapping(row, mapping) {
    const mapped = {};
    
    for (const [fileHeader, standardCol] of Object.entries(mapping)) {
      mapped[standardCol] = row[fileHeader];
    }
    
    return mapped;
  }

  /**
   * Get unmapped columns (columns in file that don't match any standard column)
   */
  static getUnmappedColumns(fileHeaders, mapping) {
    return fileHeaders.filter(h => !mapping[h]);
  }

  /**
   * Get missing standard columns (standard columns not found in file)
   */
  static getMissingColumns(fileHeaders, mapping) {
    const mappedValues = Object.values(mapping);
    const missing = [];
    
    for (const standardCol in this.STANDARD_COLUMNS) {
      if (!mappedValues.includes(standardCol)) {
        missing.push(standardCol);
      }
    }
    
    return missing;
  }

  /**
   * Generate a preview of how columns will be mapped
   */
  static generateMappingPreview(fileHeaders) {
    const mapping = this.mapColumns(fileHeaders);
    const unmapped = this.getUnmappedColumns(fileHeaders, mapping);
    const missing = this.getMissingColumns(fileHeaders, mapping);
    
    return {
      mapping,
      unmapped,
      missing,
      totalColumns: fileHeaders.length,
      mappedCount: Object.keys(mapping).length,
      unmappedCount: unmapped.length,
      missingCount: missing.length
    };
  }
}
