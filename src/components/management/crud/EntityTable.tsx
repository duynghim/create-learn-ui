// ...existing code...
'use client';

import React from 'react';
import { Table, Group, ActionIcon, Text, Tooltip } from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconArrowsSort,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';

export type ColumnDef<T> = {
  header: string;
  key: keyof T | string;
  render?: (row: T) => React.ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  ariaLabel?: string;
};

type SortDirection = 'asc' | 'desc' | null;

type EntityTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  caption?: string;
  getRowId: (row: T) => string | number;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  renderActions?: (row: T) => React.ReactNode;
  stickyHeader?: boolean;
  minWidth?: number;
  sortableColumns?: Array<keyof T | string>;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string, nextDirection: SortDirection) => void;
};

export function EntityTable<T>({
  data,
  columns,
  caption,
  getRowId,
  onEdit,
  onDelete,
  renderActions,
  stickyHeader = true,
  minWidth = 600,
  sortableColumns = [],
  sortKey,
  sortDirection = null,
  onSort,
}: Readonly<EntityTableProps<T>>) {
  const handleSortClick = (colKey: string) => {
    if (!onSort) return;
    const isCurrent = sortKey === colKey;
    let next: SortDirection;
    if (!isCurrent) next = 'asc';
    else if (sortDirection === 'asc') next = 'desc';
    else if (sortDirection === 'desc') next = null;
    else next = 'asc';
    onSort(colKey, next);
  };

  const renderSortIcon = (colKey: string) => {
    if (!sortableColumns.includes(colKey)) return null;

    const isCurrent = sortKey === colKey;
    const currentDir = isCurrent ? sortDirection : null;

    const getSortState = () => {
      if (!isCurrent) return { icon: IconArrowsSort, label: 'Sort ascending' };

      switch (currentDir) {
        case 'asc':
          return { icon: IconArrowUp, label: 'Sort descending' };
        case 'desc':
          return { icon: IconArrowDown, label: 'Clear sorting' };
        default:
          return { icon: IconArrowsSort, label: 'Sort ascending' };
      }
    };

    const { icon: IconComponent, label } = getSortState();

    return (
      <Tooltip label={label} withArrow>
        <ActionIcon
          size="sm"
          variant="subtle"
          aria-label={label}
          onClick={() => handleSortClick(colKey)}
        >
          <IconComponent size={16} />
        </ActionIcon>
      </Tooltip>
    );
  };

  return (
    <Table.ScrollContainer minWidth={minWidth}>
      <Table stickyHeader={stickyHeader} highlightOnHover withTableBorder>
        {caption && <caption>{caption}</caption>}
        <Table.Thead>
          <Table.Tr>
            {columns.map((c) => (
              <Table.Th
                key={String(c.key)}
                style={{ width: c.width }}
                align={c.align}
              >
                <Group gap={4} wrap="nowrap">
                  <Text fw={500} size="sm">
                    {c.header}
                  </Text>
                  {renderSortIcon(String(c.key))}
                </Group>
              </Table.Th>
            ))}
            {(onEdit || onDelete || renderActions) && (
              <Table.Th>
                <Text fw={500} size="sm">
                  Actions
                </Text>
              </Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row) => (
            <Table.Tr key={String(getRowId(row))}>
              {columns.map((c) => {
                const content = c.render
                  ? c.render(row)
                  : ((row[c.key as keyof T] as unknown as React.ReactNode) ?? (
                      <Text c="dimmed">—</Text>
                    ));
                return (
                  <Table.Td
                    key={String(c.key)}
                    align={c.align}
                    style={{ width: c.width }}
                  >
                    {content}
                  </Table.Td>
                );
              })}
              {(onEdit || onDelete || renderActions) && (
                <Table.Td>
                  {renderActions ? (
                    <Group gap="xs">{renderActions(row)}</Group>
                  ) : (
                    <Group gap="xs">
                      {onEdit && (
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          aria-label="Edit row"
                          onClick={() => onEdit?.(row)}
                        >
                          <IconEdit size={20} />
                        </ActionIcon>
                      )}
                      {onDelete && (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          aria-label="Delete row"
                          onClick={() => onDelete?.(row)}
                        >
                          <IconTrash size={20} />
                        </ActionIcon>
                      )}
                    </Group>
                  )}
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
