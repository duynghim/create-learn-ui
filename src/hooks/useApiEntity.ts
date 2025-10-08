'use client';

import { useState, useCallback } from 'react';

export function useApiEntity<
  T extends BaseEntity,
  CreateT = Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  UpdateT = Partial<CreateT>
>(
  apiClient: ApiClient<T, CreateT, UpdateT>,
  entityKey: string // e.g., 'teachers', 'students', 'classes'
) {
  const [state, setState] = useState<UseApiEntityState<T>>({
    entities: [],
    currentEntity: null,
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const getAll = useCallback(async (filters?: ApiFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getAll(filters);
      
      if (response.status === 200) {
        setState(prev => ({
          ...prev,
          entities: response.data[entityKey],
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          isLoading: false,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${entityKey}`;
      setError(errorMessage);
      setLoading(false);
    }
  }, [apiClient, entityKey, setLoading, setError]);

  const getById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getById(id);
      
      if (response.status === 200) {
        setState(prev => ({
          ...prev,
          currentEntity: response.data,
          isLoading: false,
        }));
        return response.data;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${entityKey.slice(0, -1)}`;
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [apiClient, entityKey, setLoading, setError]);

  const create = useCallback(async (data: CreateT) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.create(data);
      
      if (response.status === 201 || response.status === 200) {
        setState(prev => ({
          ...prev,
          entities: [...prev.entities, response.data],
          isLoading: false,
        }));
        return response.data;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to create ${entityKey.slice(0, -1)}`;
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [apiClient, entityKey, setLoading, setError]);

  const update = useCallback(async (id: string, data: UpdateT) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.update(id, data);
      
      if (response.status === 200) {
        setState(prev => ({
          ...prev,
          entities: prev.entities.map(entity => 
            entity.id === id ? response.data : entity
          ),
          currentEntity: prev.currentEntity?.id === id ? response.data : prev.currentEntity,
          isLoading: false,
        }));
        return response.data;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to update ${entityKey.slice(0, -1)}`;
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [apiClient, entityKey, setLoading, setError]);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(id);
      
      setState(prev => ({
        ...prev,
        entities: prev.entities.filter(entity => entity.id !== id),
        currentEntity: prev.currentEntity?.id === id ? null : prev.currentEntity,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${entityKey.slice(0, -1)}`;
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [apiClient, entityKey, setLoading, setError]);

  const clearCurrentEntity = useCallback(() => {
    setState(prev => ({ ...prev, currentEntity: null }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    ...state,
    getAll,
    getById,
    create,
    update,
    remove,
    clearCurrentEntity,
    clearError,
  };
}