/**
 * Categories Service layer separating application code from industry segment taxonomy queries.
 * Handles localization strings, icons mapping, and active listings counts per segment.
 */

import { ApiClient } from './apiClient';
import { Language } from '../types';
import { 
  Building2, 
  Cpu, 
  Utensils, 
  ChefHat,
  ShoppingBag,
  Shirt,
  Car,
  Home,
  Sparkles,
  HeartPulse,
  Dumbbell,
  GraduationCap,
  Hotel,
  Compass,
  Wrench,
  Hammer,
  Code,
  Megaphone,
  Landmark,
  Scale,
  PartyPopper,
  LucideIcon
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  labels: Record<Language, string>;
  iconName: string;
}

export interface CategoryStats {
  categoryId: string;
  count: number;
}

const STATIC_CATEGORIES: Category[] = [
  { 
    id: 'restaurants-cafes', 
    name: 'Restaurants & Cafes', 
    labels: {
      en: 'Restaurants & Cafes',
      ar: 'المطاعم والمقاهي',
      ku: 'چێشتخانە و کافێکان'
    },
    iconName: 'Utensils'
  },
  { 
    id: 'food-beverage', 
    name: 'Food & Beverage', 
    labels: {
      en: 'Food & Beverage',
      ar: 'الأغذية والمشروبات',
      ku: 'خۆراک و خواردنەوە'
    },
    iconName: 'ChefHat'
  },
  { 
    id: 'retail-stores', 
    name: 'Retail Stores', 
    labels: {
      en: 'Retail Stores',
      ar: 'محلات التجزئة',
      ku: 'فرۆشگاکانی فرۆشتنی ورد'
    },
    iconName: 'ShoppingBag'
  },
  { 
    id: 'clothing-fashion', 
    name: 'Clothing & Fashion', 
    labels: {
      en: 'Clothing & Fashion',
      ar: 'الملابس والأزياء',
      ku: 'جلوبەرگ و مۆدە'
    },
    iconName: 'Shirt'
  },
  { 
    id: 'electronics-tech', 
    name: 'Electronics & Tech Shops', 
    labels: {
      en: 'Electronics & Tech Shops',
      ar: 'الإلكترونيات ومحلات التقنية',
      ku: 'کۆمپیوتەر و ئەلیکترۆنیات'
    },
    iconName: 'Cpu'
  },
  { 
    id: 'automotive-services', 
    name: 'Automotive Services', 
    labels: {
      en: 'Automotive Services',
      ar: 'خدمات السيارات',
      ku: 'خزمەتگوزارییەکانی ئۆتۆمبێل'
    },
    iconName: 'Car'
  },
  { 
    id: 'real-estate', 
    name: 'Real Estate', 
    labels: {
      en: 'Real Estate',
      ar: 'العقارات والبيع',
      ku: 'خانووبەرە'
    },
    iconName: 'Home'
  },
  { 
    id: 'beauty-salons', 
    name: 'Beauty & Salons', 
    labels: {
      en: 'Beauty & Salons',
      ar: 'الصالونات والتجميل',
      ku: 'جوانکاری و ساڵۆنەکان'
    },
    iconName: 'Sparkles'
  },
  { 
    id: 'health-medical', 
    name: 'Health & Medical Services', 
    labels: {
      en: 'Health & Medical Services',
      ar: 'الخدمات الصحية والطبية',
      ku: 'خزمەتگوزارییە تەندروستییەکان'
    },
    iconName: 'HeartPulse'
  },
  { 
    id: 'fitness-gyms', 
    name: 'Fitness & Gyms', 
    labels: {
      en: 'Fitness & Gyms',
      ar: 'اللياقة البدنية والنوادي',
      ku: 'لەشجوانی و هۆڵە وەرزشییەکان'
    },
    iconName: 'Dumbbell'
  },
  { 
    id: 'education-training', 
    name: 'Education & Training Centers', 
    labels: {
      en: 'Education & Training Centers',
      ar: 'التدريب والتعليم',
      ku: 'سەنتەرەکانی پەروەردە و ڕاهێنان'
    },
    iconName: 'GraduationCap'
  },
  { 
    id: 'hotels-hospitality', 
    name: 'Hotels & Hospitality', 
    labels: {
      en: 'Hotels & Hospitality',
      ar: 'الفنادق والضيافة',
      ku: 'هۆتێل و میوانداری'
    },
    iconName: 'Hotel'
  },
  { 
    id: 'travel-tourism', 
    name: 'Travel & Tourism Services', 
    labels: {
      en: 'Travel & Tourism Services',
      ar: 'السفر والسياحة',
      ku: 'گەشتوگوزار و گەشتەکان'
    },
    iconName: 'Compass'
  },
  { 
    id: 'home-services', 
    name: 'Home Services (cleaning, maintenance, etc.)', 
    labels: {
      en: 'Home Services',
      ar: 'الخدمات المنزلية',
      ku: 'خزمەتگوزارییەکانی ماڵەوە'
    },
    iconName: 'Wrench'
  },
  { 
    id: 'construction-contractors', 
    name: 'Construction & Contractors', 
    labels: {
      en: 'Construction & Contractors',
      ar: 'المقاولات والبناء',
      ku: 'بەڵیندەران و بیناسازی'
    },
    iconName: 'Hammer'
  },
  { 
    id: 'it-software', 
    name: 'IT & Software Services', 
    labels: {
      en: 'IT & Software Services',
      ar: 'تكنولوجيا المعلومات والبرمجيات',
      ku: 'تەکنەلۆژیای زانیاری و نەرمەکاڵا'
    },
    iconName: 'Code'
  },
  { 
    id: 'marketing-media', 
    name: 'Marketing & Media Agencies', 
    labels: {
      en: 'Marketing & Media Agencies',
      ar: 'التسويق والوسائل الإعلامية',
      ku: 'مارکێتینگ و میدیا'
    },
    iconName: 'Megaphone'
  },
  { 
    id: 'financial-services', 
    name: 'Financial Services', 
    labels: {
      en: 'Financial Services',
      ar: 'الخدمات المالية',
      ku: 'خزمەتگوزارییە داراییەکان'
    },
    iconName: 'Landmark'
  },
  { 
    id: 'legal-services', 
    name: 'Legal Services', 
    labels: {
      en: 'Legal Services',
      ar: 'الخدمات القانونية',
      ku: 'خزمەتگوزارییە یاساییەکان'
    },
    iconName: 'Scale'
  },
  { 
    id: 'entertainment-events', 
    name: 'Entertainment & Events', 
    labels: {
      en: 'Entertainment & Events',
      ar: 'الترفيه والفعاليات',
      ku: 'کات بەسەربردن و بۆنەکان'
    },
    iconName: 'PartyPopper'
  }
];

export const CategoriesService = {
  /**
   * Fetches all registered system category definitions
   */
  async fetchCategories(): Promise<Category[]> {
    if (ApiClient.isMockMode) {
      return STATIC_CATEGORIES;
    }

    try {
      return await ApiClient.get<Category[]>('/api/categories');
    } catch (err) {
      // Graceful fallback to static taxonomies if server throws warning or does not serve index yet
      console.warn('⚠️ Fetch categories API error, falling back to local static catalog:', err);
      return STATIC_CATEGORIES;
    }
  },

  /**
   * Fetches the number of active business listings per category
   */
  async fetchCategoryStats(): Promise<CategoryStats[]> {
    if (ApiClient.isMockMode) {
      return STATIC_CATEGORIES.map(cat => ({
        categoryId: cat.id,
        count: cat.id === 'it-software' ? 2 : (cat.id === 'restaurants-cafes' ? 1 : (cat.id === 'retail-stores' ? 1 : (cat.id === 'health-medical' ? 1 : (cat.id === 'hotels-hospitality' ? 1 : 0))))
      }));
    }

    try {
      return await ApiClient.get<CategoryStats[]>('/api/categories/stats');
    } catch (err) {
      console.warn('⚠️ Fetch category stats API error, returning default stats:', err);
      return STATIC_CATEGORIES.map(cat => ({
        categoryId: cat.id,
        count: 0
      }));
    }
  },

  /**
   * Resolves the corresponding visual Lucide icon component bound to a category identifier
   */
  getCategoryIcon(iconName: string): LucideIcon {
    switch (iconName) {
      case 'Cpu':
        return Cpu;
      case 'Utensils':
        return Utensils;
      case 'ChefHat':
        return ChefHat;
      case 'ShoppingBag':
        return ShoppingBag;
      case 'Shirt':
        return Shirt;
      case 'Car':
        return Car;
      case 'Home':
        return Home;
      case 'Sparkles':
        return Sparkles;
      case 'HeartPulse':
        return HeartPulse;
      case 'Dumbbell':
        return Dumbbell;
      case 'GraduationCap':
        return GraduationCap;
      case 'Hotel':
        return Hotel;
      case 'Compass':
        return Compass;
      case 'Wrench':
        return Wrench;
      case 'Hammer':
        return Hammer;
      case 'Code':
        return Code;
      case 'Megaphone':
        return Megaphone;
      case 'Landmark':
        return Landmark;
      case 'Scale':
        return Scale;
      case 'PartyPopper':
        return PartyPopper;
      case 'Building2':
      default:
        return Building2;
    }
  }
};
