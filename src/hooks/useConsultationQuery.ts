import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationApiClient } from '@/api';
import type {
  CreateConsultationRequest,
  UpdateConsultationRequest,
  ConsultationApiFilters,
  ApiFilters,
} from '@/types';

const CONSULTATION_QUERY_KEY = ['consultations'] as const;

interface ConsultationQueryParams extends ApiFilters {
  sort?: string;
}

export const useConsultationQuery = (params: ConsultationQueryParams = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search, sort } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...CONSULTATION_QUERY_KEY, { page, size, search, sort }],
    queryFn: async () => {
      const filters: ConsultationApiFilters = {
        page,
        size,
        ...(search && { search }),
        ...(sort && { sort }),
      };
      return await consultationApiClient.getAll(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const consultations = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateConsultationRequest) =>
      consultationApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateConsultationRequest;
    }) => consultationApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => consultationApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEY });
    },
  });

  return {
    consultations,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    createConsultation: createMutation.mutateAsync,
    updateConsultation: (id: string, data: UpdateConsultationRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteConsultation: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};