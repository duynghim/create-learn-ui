'use client';
import { useState } from 'react';
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
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticateUser = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error ?? 'Login failed');
    }

    return data;
  };

  const handleRedirectAfterLogin = (userRole: 'admin' | 'user' | undefined) => {
    const redirect = searchParams.get('redirect');

    if (userRole === 'admin') {
      if (redirect?.startsWith('/management')) {
        router.replace(redirect);
      } else {
        router.replace('/management');
      }
    } else if (redirect?.startsWith('/management')) {
      router.replace('/not-authorized');
    } else {
      router.replace('/');
    }
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await authenticateUser(email, password);
      const role = data?.user?.role as 'admin' | 'user' | undefined;
      handleRedirectAfterLogin(role);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid p={0}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        h="100%"
        align="center"
        gap="xl"
      >
        <Box w={{ base: '100%', md: '40%' }}>
          <Stack align="center" p={{ base: 20, md: 0 }}>
            <Title
              size="2rem"
              c="fresh-blue"
              ta={{ base: 'center', md: 'left' }}
            >
              Welcome back to Create Learn
            </Title>
            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                w={{ base: '80%', md: '389px' }}
                maw={389}
              >
                {error}
              </Alert>
            )}
            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              radius="md"
              w={{ base: '80%', md: '389px' }}
              maw={389}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              radius="md"
              w={{ base: '80%', md: '389px' }}
              maw={389}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button
              mt="xl"
              size="md"
              radius="md"
              color="fresh-blue"
              w={{ base: '80%', md: '389px' }}
              maw={389}
              loading={loading}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Stack>
        </Box>
        <Box visibleFrom="md" w="60%">
          <Image src="/images/login-page.png" alt="Login Page" w="100%" />
        </Box>
      </Flex>
    </Container>
  );
};

export default LoginPage;
