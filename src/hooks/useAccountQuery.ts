import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApiClient } from '@/api';
import type {
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountApiFilters,
  ApiFilters,
} from '@/types';

const ACCOUNT_QUERY_KEY = ['accounts'] as const;

export const useAccountQuery = (params: ApiFilters = {}) => {
  const queryClient = useQueryClient();
  const { page = 0, size = 10, search } = params;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...ACCOUNT_QUERY_KEY, { page, size, search }],
    queryFn: async () => {
      const filters: AccountApiFilters = {
        page,
        size,
        ...(search && { search }),
      };
      return await accountApiClient.getAll(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const accounts = response?.data?.data ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPages = response?.data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: CreateAccountRequest) => accountApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
    },
  });

  return {
    accounts,
    totalElements,
    totalPages,
    isLoading,
    error: error ? (error).message : null,
    createAccount: createMutation.mutateAsync,
    updateAccount: (id: string, data: UpdateAccountRequest) =>
      updateMutation.mutateAsync({ id, data }),
    deleteAccount: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
