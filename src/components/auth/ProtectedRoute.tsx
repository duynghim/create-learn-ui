'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, Center, Container } from '@mantine/core';
import { useAuth } from '@/hooks';
import type { ProtectedRouteProps } from '@/types';

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
      router.replace(redirectTo);
    }
  }, [isLoggedIn, isLoading, router, redirectTo, isRedirecting]);

  if (isLoading) {
    return (
      <Container fluid p={0}>
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
