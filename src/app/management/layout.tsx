// src/app/management/layout.tsx
'use client';

import { useState } from 'react';
import { Flex, Box, Container, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from './sidebar/SideBar';

interface ManagementLayoutProps {
  children: ReactNode;
}

const ManagementLayout = ({ children }: ManagementLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpened, { toggle: toggleMobileMenu }] = useDisclosure(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ProtectedRoute>
      <Flex w="100%">
        {/* Desktop Sidebar */}
        <Box visibleFrom="md">
          <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </Box>

        {/* Mobile Menu Button */}
        <Box
          hiddenFrom="md"
          pos="fixed"
          top={16}
          left={16}
          style={{ zIndex: 1000 }}
        >
          <Burger
            opened={mobileMenuOpened}
            onClick={toggleMobileMenu}
            size="sm"
            aria-label="Toggle navigation"
          />
        </Box>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpened && (
          <>
            <Box
              pos="fixed"
              inset={0}
              bg="rgba(0, 0, 0, 0.5)"
              style={{ zIndex: 999 }}
              onClick={toggleMobileMenu}
              hiddenFrom="md"
            />
            <Box
              pos="fixed"
              top={0}
              left={0}
              h="100%"
              style={{ zIndex: 1001 }}
              hiddenFrom="md"
            >
              <Sidebar />
            </Box>
          </>
        )}

        {/* Main Content */}
        <Container w='100%' fluid p="xl">
          {children}
        </Container>
      </Flex>
    </ProtectedRoute>
  );
};

export default ManagementLayout;
