// src/app/login/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Image,
  Title,
  Alert,
  Loader,
  Center,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isLoggedIn,
    isLoading: authLoading,
    login,
    error: authError,
    clearError,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (v) => (v.trim().length ? null : 'Username is required'),
      password: (v) => (v.length ? null : 'Password is required'),
    },
    validateInputOnBlur: true,
  });

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      const redirect = searchParams.get('redirect') || '/management';
      router.replace(redirect);
    }
  }, [isLoggedIn, authLoading, router, searchParams]);

  // Bubble auth hook errors into a top-level alert
  useEffect(() => {
    if (authError) {
      setSubmitError(authError);
      clearError();
    }
  }, [authError, clearError]);

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitError(null);
    setLoading(true);

    try {
      await login({ username: values.username, password: values.password });
      const redirect = searchParams.get('redirect') || '/management';
      router.replace(redirect);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  });

  if (authLoading) {
    return (
      <Container fluid p={0}>
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  const canSubmit =
    form.values.username.trim() !== '' && form.values.password !== '';

  return (
    <Container fluid p={0}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        h="100vh"
        align="center"
        gap="xl"
      >
        <Box w={{ base: '100%', md: '40%' }}>
          <form onSubmit={handleSubmit}>
            <Stack align="center" p={{ base: 20, md: 0 }}>
              <Title
                size="2rem"
                c="fresh-blue"
                ta={{ base: 'center', md: 'left' }}
              >
                Welcome back to Create Learn
              </Title>

              {submitError && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  w={{ base: '80%', md: '389px' }}
                  maw={389}
                  onClose={() => setSubmitError(null)}
                  withCloseButton
                >
                  {submitError}
                </Alert>
              )}

              <TextInput
                label="Username"
                placeholder="Your username"
                size="md"
                radius="md"
                w={{ base: '80%', md: '389px' }}
                maw={389}
                disabled={loading}
                required
                {...form.getInputProps('username')}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                mt="md"
                size="md"
                radius="md"
                w={{ base: '80%', md: '389px' }}
                maw={389}
                disabled={loading}
                required
                {...form.getInputProps('password')}
              />

              <Button
                mt="xl"
                size="md"
                radius="md"
                color="fresh-blue"
                type="submit"
                w={{ base: '80%', md: '389px' }}
                maw={389}
                loading={loading}
                disabled={!canSubmit}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>

        <Box visibleFrom="md" w="60%">
          <Image src="/images/login-page.png" alt="Login Page" w="100%" />
        </Box>
      </Flex>
    </Container>
  );
};

export default LoginPage;
