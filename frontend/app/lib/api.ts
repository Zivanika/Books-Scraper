import axios from 'axios';
import { Product, PaginatedResponse, ProductFilters, Category } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// API functions
export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/api/v1/products', { 
      params: filters 
    });
    return response.data;
  },
  
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/api/v1/products/${id}`);
    return response.data;
  },
  
  refresh: async (id: string): Promise<Product> => {
    const response = await api.post<Product>(`/api/v1/products/${id}/refresh`);
    return response.data;
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/v1/categories');
    return response.data;
  },
  
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/api/v1/categories/${id}`);
    return response.data;
  },
};
