import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '../lib/api';
import { ProductFilters } from '../lib/types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    placeholderData: keepPreviousData,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRefreshProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productsApi.refresh(id),
    onSuccess: (data) => {
      // Invalidate and refetch product queries
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
