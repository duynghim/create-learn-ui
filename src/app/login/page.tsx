'use client';

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
} from '@mantine/core';

const LoginPage = () => {
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

            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              radius="md"
              w={{ base: '80%', md: '389px' }}
              maw={389}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              radius="md"
              w={{ base: '80%', md: '389px' }}
              maw={389}
            />
            <Button
              mt="xl"
              size="md"
              radius="md"
              color="fresh-blue"
              w={{ base: '80%', md: '389px' }}
              maw={389}
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
