import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeApiClient } from '@/api';
import type {
  CreateGradeRequest,
  UpdateGradeRequest,
  GradeApiFilters,
  ApiFilters,
} from '@/types';

const GRADE_QUERY_KEY = ['grades'] as const;

export const useGradeQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...GRADE_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: GradeApiFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await gradeApiClient.getAllPublicClasses(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const grades = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateGradeRequest) => gradeApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADE_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGradeRequest }) =>
      gradeApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADE_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => gradeApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADE_QUERY_KEY });
    },
  });

  return {
    grades,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    createGrade: createMutation.mutateAsync,
    updateGrade: (id: string, data: UpdateGradeRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteGrade: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
