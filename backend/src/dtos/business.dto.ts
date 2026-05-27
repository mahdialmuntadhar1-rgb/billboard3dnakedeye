// Business DTOs

export interface BusinessDTO {
  id: string;
  name: string;
  description: string;
  bio?: string;
  category: string;
  city: string;
  governorate?: string;
  country: string;
  website?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  coverImageUrl?: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  views?: number;
  likes?: number;
  saves?: number;
  verified?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessListResponseDTO {
  success: true;
  data: BusinessDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BusinessDetailResponseDTO {
  success: true;
  data: BusinessDTO;
}

export interface CreateBusinessDTO {
  name: string;
  description: string;
  category: string;
  city: string;
  country: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateBusinessDTO {
  name?: string;
  description?: string;
  category?: string;
  city?: string;
  country?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}
