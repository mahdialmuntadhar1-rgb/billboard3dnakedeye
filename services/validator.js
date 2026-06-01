/**
 * Validation Service
 * Validates business data before import
 * Handles phone formats, URLs, coordinates, and required fields
 */

export class Validator {
  /**
   * Validate a single business record
   * @param {Object} business - Business data to validate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  static validateBusiness(business) {
    const errors = [];

    // Required fields
    if (!business.name || business.name.trim() === '') {
      errors.push('Business name is required');
    }

    if (!business.category || business.category.trim() === '') {
      errors.push('Category is required');
    }

    if (!business.governorate || business.governorate.trim() === '') {
      errors.push('Governorate is required');
    }

    // Phone validation
    if (business.phone) {
      const phoneError = this.validatePhone(business.phone);
      if (phoneError) errors.push(`Phone: ${phoneError}`);
    }

    if (business.mobile) {
      const mobileError = this.validatePhone(business.mobile);
      if (mobileError) errors.push(`Mobile: ${mobileError}`);
    }

    if (business.whatsapp) {
      const whatsappError = this.validatePhone(business.whatsapp);
      if (whatsappError) errors.push(`WhatsApp: ${whatsappError}`);
    }

    // URL validation
    if (business.website) {
      const websiteError = this.validateURL(business.website);
      if (websiteError) errors.push(`Website: ${websiteError}`);
    }

    if (business.facebook) {
      const facebookError = this.validateURL(business.facebook);
      if (facebookError) errors.push(`Facebook: ${facebookError}`);
    }

    if (business.instagram) {
      const instagramError = this.validateURL(business.instagram);
      if (instagramError) errors.push(`Instagram: ${instagramError}`);
    }

    // Email validation
    if (business.email) {
      const emailError = this.validateEmail(business.email);
      if (emailError) errors.push(`Email: ${emailError}`);
    }

    // Coordinate validation
    if (business.latitude || business.longitude) {
      const coordError = this.validateCoordinates(business.latitude, business.longitude);
      if (coordError) errors.push(`Coordinates: ${coordError}`);
    }

    // Language validation
    if (business.language) {
      const langError = this.validateLanguage(business.language);
      if (langError) errors.push(`Language: ${langError}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate phone number (Iraq format: +964XXXXXXXXXX)
   */
  static validatePhone(phone) {
    if (!phone || phone.trim() === '') return null;

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Check length (Iraq numbers: 10-13 digits with country code)
    if (digits.length < 10 || digits.length > 15) {
      return 'Invalid phone number length';
    }

    // Check if starts with valid Iraq prefix
    const iraqPrefix = digits.startsWith('964') ? digits.substring(3) : digits;
    if (!iraqPrefix.startsWith('0') && !iraqPrefix.startsWith('7')) {
      return 'Invalid Iraq phone format';
    }

    return null;
  }

  /**
   * Normalize phone to +964 format
   */
  static normalizePhone(phone) {
    if (!phone) return '';

    let digits = phone.replace(/\D/g, '');

    // Remove country code if present
    if (digits.startsWith('964')) {
      digits = digits.substring(3);
    }

    // Add leading 0 if missing
    if (!digits.startsWith('0')) {
      digits = '0' + digits;
    }

    // Return in +964 format
    return '+964' + digits.substring(1);
  }

  /**
   * Validate URL
   */
  static validateURL(url) {
    if (!url || url.trim() === '') return null;

    try {
      new URL(url);
      return null;
    } catch {
      return 'Invalid URL format';
    }
  }

  /**
   * Normalize URL (add protocol if missing)
   */
  static normalizeURL(url) {
    if (!url) return '';

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }

    return url;
  }

  /**
   * Validate email
   */
  static validateEmail(email) {
    if (!email || email.trim() === '') return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }

    return null;
  }

  /**
   * Validate coordinates
   */
  static validateCoordinates(lat, lon) {
    if (!lat || !lon) return null;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return 'Coordinates must be numbers';
    }

    if (latitude < -90 || latitude > 90) {
      return 'Latitude must be between -90 and 90';
    }

    if (longitude < -180 || longitude > 180) {
      return 'Longitude must be between -180 and 180';
    }

    // Iraq bounds (approximate)
    if (latitude < 29 || latitude > 38) {
      return 'Latitude outside Iraq bounds';
    }

    if (longitude < 38 || longitude > 49) {
      return 'Longitude outside Iraq bounds';
    }

    return null;
  }

  /**
   * Validate language code
   */
  static validateLanguage(lang) {
    const validLanguages = ['ar', 'ku', 'en'];
    const normalized = lang.toLowerCase().trim();

    if (!validLanguages.includes(normalized)) {
      return `Invalid language code. Must be one of: ${validLanguages.join(', ')}`;
    }

    return null;
  }

  /**
   * Detect language from text (simple heuristic)
   */
  static detectLanguage(text) {
    if (!text) return 'ar'; // Default to Arabic

    // Check for Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(text)) {
      // Check for Kurdish-specific characters
      const kurdishRegex = /[\u0750-\u077F]/;
      if (kurdishRegex.test(text)) {
        return 'ku';
      }
      return 'ar';
    }

    // Check for Latin characters
    const latinRegex = /[a-zA-Z]/;
    if (latinRegex.test(text)) {
      return 'en';
    }

    return 'ar'; // Default
  }

  /**
   * Validate governorate name
   */
  static validateGovernorate(governorate) {
    const validGovernorates = [
      'Baghdad', 'Basra', 'Nineveh', 'Kirkuk', 'Diyala', 'Anbar',
      'Karbala', 'Najaf', 'Maysan', 'Muthanna', 'Qadisiyyah', 'Babil',
      'Wasit', 'Erbil', 'Sulaymaniyah', 'Dohuk', 'Halabja', 'Saladin',
      'بغداد', 'البصرة', 'نينوى', 'كركوك', 'ديالى', 'الأنبار',
      'كربلاء', 'النجف', 'ميسان', 'المثنى', 'القادسية', 'بابل',
      'واسط', 'أربيل', 'السليمانية', 'دهوك', 'حلبجة', 'صلاح الدين',
      'بغداد', 'بصرە', 'نەینەوا', 'کەرکووک', 'دیالى', 'ئەنبار',
      'کەربەلا', 'نەجەف', 'میسان', 'مەثن', 'قادسیە', 'بابیل',
      'واسیت', 'هەولێر', 'سلێمانی', 'دهۆک', 'هەڵەبجە', 'سەلاحەدین'
    ];

    if (!governorate) return 'Governorate is required';

    const normalized = governororate.trim();
    if (!validGovernorates.includes(normalized)) {
      return `Unknown governorate: ${governorate}`;
    }

    return null;
  }

  /**
   * Generate validation report for multiple records
   */
  static generateValidationReport(records) {
    const report = {
      total: records.length,
      valid: 0,
      invalid: 0,
      errors: []
    };

    records.forEach((record, index) => {
      const validation = this.validateBusiness(record);
      if (validation.valid) {
        report.valid++;
      } else {
        report.invalid++;
        report.errors.push({
          row: index + 1,
          name: record.name || 'Unknown',
          errors: validation.errors
        });
      }
    });

    return report;
  }
}
