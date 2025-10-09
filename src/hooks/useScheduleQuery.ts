import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApiClient } from '@/api';
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleApiFilters,
  ApiFilters,
} from '@/types';

const SCHEDULE_QUERY_KEY = ['schedules'] as const;

export const useScheduleQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...SCHEDULE_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: ScheduleApiFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await scheduleApiClient.getAll(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const schedules = response?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateScheduleRequest) => scheduleApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleRequest }) =>
      scheduleApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => scheduleApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
    },
  });

  return {
    schedules,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    createSchedule: createMutation.mutateAsync,
    updateSchedule: (id: string, data: UpdateScheduleRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteSchedule: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
