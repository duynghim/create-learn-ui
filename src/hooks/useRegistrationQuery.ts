import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationApiClient, classApiClient } from '@/api';
import type {
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
  RegistrationApiFilters,
  ApiFilters,
} from '@/types';

const REGISTRATION_QUERY_KEY = ['registrations'] as const;

export const useRegistrationQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...REGISTRATION_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: RegistrationApiFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await registrationApiClient.getAllPublicClasses(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get class options for dropdown
  const { data: classResponse, isLoading: isLoadingClassOptions } = useQuery({
    queryKey: ['classes', 'options'],
    queryFn: async () => {
      return await classApiClient.getAllPublicClasses({ page: 0, size: 100 });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const registrations = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const classOptions =
    classResponse?.data?.data?.map((clazz) => ({
      value: String(clazz.id),
      label: clazz.name,
    })) ?? [];

  const createMutation = useMutation({
    mutationFn: (data: CreateRegistrationRequest) =>
      registrationApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRegistrationRequest;
    }) => registrationApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => registrationApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGISTRATION_QUERY_KEY });
    },
  });

  return {
    registrations,
    totalElements,
    totalPages,
    isLoading,
    error: error ? error.message : null,
    classOptions,
    isLoadingClassOptions,
    createRegistration: createMutation.mutateAsync,
    updateRegistration: (id: string, data: UpdateRegistrationRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteRegistration: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
