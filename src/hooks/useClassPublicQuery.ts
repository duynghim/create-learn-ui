import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classApiClient } from '@/api';
import type {
  CreateClassRequest,
  UpdateClassRequest,
  ClassApiFilters,
  ApiFilters,
} from '@/types';

const CLASS_QUERY_KEY = ['classes'] as const;

export const useClassPublicQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...CLASS_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: ClassApiFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await classApiClient.getAllPublicClasses(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const classes = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateClassRequest) => classApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassRequest }) =>
      classApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => classApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEY });
    },
  });

  return {
    classes,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    createClass: createMutation.mutateAsync,
    updateClass: (id: string, data: UpdateClassRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteClass: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
