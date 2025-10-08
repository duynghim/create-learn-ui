// src/app/management/layout.tsx
'use client';

import Link from 'next/link';
import { Container, Group, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface ManagementLayoutProps {
  children: ReactNode;
}

const ManagementLayout = ({ children }: ManagementLayoutProps) => {
  return (
    <ProtectedRoute>
      <div>
        <Container fluid p={20}>
          <Group justify="space-between" align="center">
            <Title order={2} c="fresh-blue">
              Management
            </Title>
            <Group>
              <Link href="/management">Dashboard</Link>
              <Link href="/management/accounts">Accounts</Link>
              <Link href="/management/classes">Classes</Link>
              <Link href="/management/teachers">Teachers</Link>
              <Link href="/management/consultants">Consultants</Link>
            </Group>
          </Group>
        </Container>
        <Container p={20}>{children}</Container>
      </div>
    </ProtectedRoute>
  );
};

export default ManagementLayout;
