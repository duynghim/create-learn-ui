// `src/hooks/useApiEntity.ts`
import { useState, useCallback } from 'react';

interface ApiEntityState<T> {
  entities: T[];
  isLoading: boolean;
  error: string | null;
}

export function useApiEntity<T>() {
  const [state, setState] = useState<ApiEntityState<T>>({
    entities: [],
    isLoading: false,
    error: null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setEntities = useCallback((entities: T[]) => {
    setState((prev) => ({ ...prev, entities }));
  }, []);

  const createEntity = useCallback(
    async (apiCall: () => Promise<T>) => {
      try {
        setLoading(true);
        setError(null);
        const newEntity = await apiCall();
        setState((prev) => ({
          ...prev,
          entities: [...prev.entities, newEntity],
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create entity'
        );
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const updateEntity = useCallback(
    async (id: number, apiCall: () => Promise<T>) => {
      try {
        setLoading(true);
        setError(null);
        const updatedEntity = await apiCall();
        setState((prev) => ({
          ...prev,
          entities: prev.entities.map((entity) =>
            (entity as any).id === id ? updatedEntity : entity
          ),
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update entity'
        );
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const deleteEntity = useCallback(
    async (id: number, apiCall: () => Promise<void>) => {
      try {
        setLoading(true);
        setError(null);
        await apiCall();
        setState((prev) => ({
          ...prev,
          entities: prev.entities.filter((entity) => (entity as any).id !== id),
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete entity'
        );
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    state,
    setLoading,
    setError,
    setEntities,
    createEntity,
    updateEntity,
    deleteEntity,
  };
}
