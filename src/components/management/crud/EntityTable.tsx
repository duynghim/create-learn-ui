'use client';

import React from 'react';
import { Table, TableData, Group, ActionIcon, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export type ColumnDef<T> = {
  header: string;
  key: keyof T | string;
  render?: (row: T) => React.ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  ariaLabel?: string;
};

type EntityTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  caption?: string;
  getRowId: (row: T) => string | number;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  renderActions?: (row: T) => React.ReactNode; // custom override
  stickyHeader?: boolean;
  minWidth?: number;
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
}: Readonly<EntityTableProps<T>>) {
  const tableData: TableData = {
    caption,
    head: [
      ...columns.map((c) => c.header),
      onEdit || onDelete || renderActions ? 'Actions' : '',
    ].filter(Boolean),
    body: data.map((row) => {
      const cells = columns.map((c) => {
        if (c.render) return c.render(row);
        const key = c.key as keyof T;
        const value = row[key] as unknown as React.ReactNode;
        return value ?? <Text c="dimmed">—</Text>;
      });

      if (renderActions) {
        cells.push(
          <Group gap="xs" key={String(getRowId(row))}>
            {renderActions(row)}
          </Group>
        );
      } else if (onEdit || onDelete) {
        cells.push(
          <Group gap="xs" key={String(getRowId(row))}>
            {onEdit && (
              <ActionIcon
                variant="subtle"
                color="blue"
                aria-label="Edit row"
                onClick={() => onEdit?.(row)}
              >
                <IconEdit size={22} />
              </ActionIcon>
            )}
            {onDelete && (
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label="Delete row"
                onClick={() => onDelete?.(row)}
              >
                <IconTrash size={22} />
              </ActionIcon>
            )}
          </Group>
        );
      }

      return cells;
    }),
  };

  return (
    <Table.ScrollContainer minWidth={minWidth}>
      <Table stickyHeader={stickyHeader} data={tableData} />
    </Table.ScrollContainer>
  );
}
