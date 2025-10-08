// src/hooks/useTeacherQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApiClient } from '@/api';
import type {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/types';

const TEACHER_QUERY_KEY = ['teachers'] as const;

export const useTeacherQuery = () => {
  const queryClient = useQueryClient();

  // 🧠 Always returns { data: Teacher[] }
  const {
    data: teachers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: TEACHER_QUERY_KEY,
    queryFn: async (): Promise<Teacher[]> => {
      const res = await teacherApiClient.getAll();
      return res.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
    isLoading,
    error: error ? (error as Error).message : null,
    createTeacher: createMutation.mutateAsync,
    updateTeacher: (id: string, data: UpdateTeacherRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteTeacher: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
