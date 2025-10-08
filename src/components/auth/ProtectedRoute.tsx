'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, Center, Container } from '@mantine/core';
import { useAuth } from '@/contexts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !isRedirecting) {
      setIsRedirecting(true);

      // Add current path as redirect parameter
      const currentPath =
        globalThis.location.pathname + globalThis.location.search;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;

      router.replace(loginUrl);
    }
  }, [isLoggedIn, isLoading, router, redirectTo, isRedirecting]);

  // Show loading while checking auth or redirecting
  if (isLoading || isRedirecting || !isLoggedIn) {
    return (
      <Container fluid p={0}>
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
