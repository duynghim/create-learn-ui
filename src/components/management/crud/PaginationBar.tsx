'use client';

import React from 'react';
import { Pagination, Group } from '@mantine/core';

type PaginationBarProps = {
  totalPages: number; // backend total pages (0-based logic friendly)
  pageZeroBased: number; // current page index (0-based)
  onChangeZeroBased: (page: number) => void;
  hidden?: boolean;
};

export default function PaginationBar({
  totalPages,
  pageZeroBased,
  onChangeZeroBased,
  hidden,
}: Readonly<PaginationBarProps>) {
  if (hidden || totalPages <= 1) return null;

  // Mantine Pagination is 1-based; convert both ways
  const value = pageZeroBased + 1;

  return (
    <Pagination.Root
      total={totalPages}
      value={value}
      onChange={(nextOneBased) => onChangeZeroBased(nextOneBased - 1)}
    >
      <Group gap={5} justify="center" mt="md">
        <Pagination.First />
        <Pagination.Previous />
        <Pagination.Items />
        <Pagination.Next />
        <Pagination.Last />
      </Group>
    </Pagination.Root>
  );
}
