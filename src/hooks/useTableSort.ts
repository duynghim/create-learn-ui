import { useState, useCallback } from 'react';

type SortDirection = 'asc' | 'desc' | null;

export function useTableSort(onPageReset?: () => void) {
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (key: string, direction: SortDirection) => {
      setSortKey(direction ? key : undefined);
      setSortDirection(direction);
      // Reset to first page when sorting changes
      onPageReset?.();
    },
    [onPageReset]
  );

  const sortParam = sortKey && sortDirection 
    ? `${sortKey},${sortDirection.toUpperCase()}` 
    : undefined;

  return {
    sortKey,
    sortDirection,
    sortParam,
    handleSort,
  };
}