// Backend API Types
export interface Product {
  id: string;
  sourceId: string;
  categoryId: string;
  title: string;
  author?: string;
  price: string;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  lastScrapedAt: string;
  detail?: ProductDetail;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail {
  id: string;
  productId: string;
  description?: string;
  specs?: Record<string, any>;
  ratingsAvg?: number;
  reviewsCount: number;
  recommendedProducts?: string[];
}

export interface Category {
  id: string;
  navigationId: string;
  parentId?: string;
  title: string;
  slug: string;
  sourceUrl?: string;
  productCount: number;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  author?: string;
  minRating?: number;
}
