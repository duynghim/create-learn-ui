'use client'

import { Card, Stack, Skeleton } from '@mantine/core';

const CardLoadingSkeleton = () => (
  <Card
    w={{ base: '70%', xssm: 264 }}
    h={397}
    shadow="md"
    radius="md"
    withBorder
  >
    <Stack gap="sm" h="100%">
      <Skeleton height={165} radius="md" />
      <Skeleton height={24} radius="sm" />
      <Skeleton height={60} radius="sm" />
      <Skeleton height={36} radius="md" mt="auto" />
    </Stack>
  </Card>
);

export default CardLoadingSkeleton;
