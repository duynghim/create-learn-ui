import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectApiClient } from '@/api';
import type {
  CreateSubjectRequest,
  UpdateSubjectRequest,
  SubjectApiFilters,
  ApiFilters,
} from '@/types';

const SUBJECT_QUERY_KEY = ['subjects'] as const;

export const useSubjectQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...SUBJECT_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: SubjectApiFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await subjectApiClient.getAll(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const subjects = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateSubjectRequest) => subjectApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectRequest }) =>
      subjectApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => subjectApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEY });
    },
  });

  return {
    subjects,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    createSubject: createMutation.mutateAsync,
    updateSubject: (id: string, data: UpdateSubjectRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteSubject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
