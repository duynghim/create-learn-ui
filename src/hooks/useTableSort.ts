'use client';

import { useState, useCallback } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';

export type SortDirection = 'asc' | 'desc' | null;

type UseTableSortOptions = {
  onPageResetAction?: () => void;
  baseKey?: QueryKey;
  refetchType?: 'active' | 'all';
  onAfterChangeAction?: (key: string | undefined, dir: SortDirection) => void;
};

export function useTableSort({
  onPageResetAction,
  baseKey,
  refetchType = 'active',
  onAfterChangeAction,
}: UseTableSortOptions = {}) {
  const queryClient = useQueryClient();

  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (key: string, direction: SortDirection) => {
      const nextKey = direction ? key : undefined;
      setSortKey(nextKey);
      setSortDirection(direction);

      onPageResetAction?.();

      if (baseKey) {
        void queryClient.refetchQueries({
          queryKey: baseKey,
          type: refetchType,
        });
      }

      onAfterChangeAction?.(nextKey, direction);
    },
    [onPageResetAction, baseKey, refetchType, queryClient, onAfterChangeAction]
  );

  const sortParam =
    sortKey && sortDirection
      ? `${sortKey},${sortDirection.toUpperCase()}`
      : undefined;

  return {
    sortKey,
    sortDirection,
    sortParam,
    handleSort,
    setSortKey,
    setSortDirection,
  };
}
