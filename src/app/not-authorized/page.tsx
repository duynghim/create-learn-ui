import Link from 'next/link';
import { Button, Container, Stack, Text, Title } from '@mantine/core';

const NotAuthorizedPage = () => {
  return (
    <Container p={40}>
      <Stack align="center" gap="sm">
        <Title order={2} c="red">Access denied</Title>
        <Text>You do not have permission to view this page.</Text>
        <Button component={Link} href="/" color="fresh-blue">Go to Home</Button>
      </Stack>
    </Container>
  );
};

export default NotAuthorizedPage;
