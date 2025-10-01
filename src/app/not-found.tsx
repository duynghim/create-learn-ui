import {
  Box,
  Container,
  Flex,
  Image,
  Title,
  Text,
  Button,
  Stack,
} from '@mantine/core';

const NotFound = () => {
  return (
    <Container fluid>
      <Flex
        align="center"
        justify="center"
        h="100vh"
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 'xl', md: 100 }}
      >
        <Stack w={{ base: '100%', md: '30%' }} gap="xl">
          <Title fz="2rem" fw={600}>
            Something is not right...
          </Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            w={{ base: '100%', md: 250 }}
          >
            Get back to home page
          </Button>
        </Stack>
        <Box w={{ base: '100%', md: '50%' }}>
          <Image src="/images/404-page.svg" alt="404" w="100%" />
        </Box>
      </Flex>
    </Container>
  );
};

export default NotFound;
