/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'user' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  savedBusinesses: string[];
  ownedBusinesses?: string[];
}

export interface WorkingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Business {
  id: string;
  name: string;
  nameAr: string;
  nameKu?: string;
  description: string;
  descriptionAr: string;
  descriptionKu?: string;
  category: string; // e.g. 'restaurants', 'tech', 'retail', 'healthcare', 'hotels'
  rating: number;
  reviewsCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  location: string; // e.g. 'Downtown', 'West End', etc.
  locationAr: string;
  locationKu?: string;
  address: string;
  addressAr: string;
  addressKu?: string;
  phone: string;
  website: string;
  email: string;
  image: string;
  gallery: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isOpenNow: boolean;
  amenities: string[];
  amenitiesAr: string[];
  amenitiesKu?: string[];
  latitude: number;
  longitude: number;
  workingHours: WorkingHours;
  workingHoursAr: WorkingHours;
  workingHoursKu?: WorkingHours;
}

export interface Review {
  id: string;
  businessId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  commentAr?: string;
  commentKu?: string;
  date: string;
}

export interface Inquiry {
  id: string;
  businessId: string;
  businessName: string;
  senderName: string;
  senderEmail: string;
  message: string;
  date: string;
}

export interface BusinessAnalytics {
  views: number[];
  leads: number[];
  ratingDistribution: { rating: number; count: number }[];
  recentActivity: { id: string; type: 'view' | 'bookmark' | 'lead'; message: string; messageAr: string; time: string }[];
}

export interface FilterState {
  searchQuery: string;
  category: string;
  location: string;
  priceLevels: string[];
  minRating: number;
  isVerified: boolean;
  isOpenNow: boolean;
  sortBy: 'newest' | 'relevance' | 'highest_rated';
}

export type Language = 'en' | 'ar' | 'ku';

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  date: string;
}

export interface Post {
  id: string;
  businessId?: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  contentAr?: string;
  contentKu?: string;
  image?: string;
  bgStyle?: 'default' | 'dark-cosmos' | 'warm-sepia' | 'sunset-sherbet';
  layoutMode?: 'standard' | 'bento' | 'hero-compact' | 'gold-accent';
  aspectRatio?: 'square' | 'portrait' | 'widescreen';
  likes: string[]; // array of user emails or IDs
  comments: PostComment[];
  isVerified: boolean;
  date: string;
}
