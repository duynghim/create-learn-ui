import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApiClient } from '@/api';
import type {
  CreateNewsRequest,
  UpdateNewsRequest,
  NewsApiFilters,
  ApiFilters,
} from '@/types';

const NEWS_QUERY_KEY = ['news'] as const;

export const useNewsPublicQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...NEWS_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: NewsApiFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await newsApiClient.getAllPublic(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const news = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateNewsRequest) => newsApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsRequest }) =>
      newsApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });

  return {
    news,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    createNews: createMutation.mutateAsync,
    updateNews: (id: string, data: UpdateNewsRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteNews: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
