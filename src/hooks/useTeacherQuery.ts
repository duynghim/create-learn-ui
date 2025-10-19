// src/hooks/useTeacherQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApiClient } from '@/api';
import type {
  CreateTeacherRequest,
  UpdateTeacherRequest,
  TeacherFilters,
  ApiFilters,
} from '@/types';

const TEACHER_QUERY_KEY = ['teachers'] as const;

export const useTeacherQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...TEACHER_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: TeacherFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await teacherApiClient.getAllPublicClasses(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const teachers = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateTeacherRequest) => teacherApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherRequest }) =>
      teacherApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teacherApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_QUERY_KEY });
    },
  });

  return {
    teachers,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    createTeacher: createMutation.mutateAsync,
    updateTeacher: (id: string, data: UpdateTeacherRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteTeacher: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
