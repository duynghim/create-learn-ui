'use client';

import { useAccountQuery } from '@/hooks/useAccountQuery';
import {
  Avatar,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  Divider,
  Skeleton,
  Alert,
  rem,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconMail,
  IconUser,
  IconPhone,
} from '@tabler/icons-react';

export default function CurrentProfilePage() {
  const { currentProfile, isLoading, error } = useAccountQuery();

  if (isLoading) {
    return (
      <Container size="sm" py="xl">
        <Card shadow="md" radius="lg" p="xl">
          <Stack>
            <Skeleton height={120} circle mb="md" />
            <Skeleton height={rem(32)} width="60%" mb="xs" />
            <Skeleton height={rem(20)} width="40%" mb="md" />
            <Divider my="sm" />
            <Skeleton height={rem(20)} width="80%" mb="xs" />
            <Skeleton height={rem(20)} width="70%" />
          </Stack>
        </Card>
      </Container>
    );
  }

  if (error || !currentProfile) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          radius="md"
        >
          {error || 'Unable to load profile.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="md" radius="lg" p="xl" withBorder>
        <Stack align="center" gap="xs">
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.username)}&size=120`}
            alt={currentProfile.username}
            size={120}
            radius="50%"
            color="blue"
          >
            <IconUser size={rem(48)} />
          </Avatar>

          <Title order={2} ta="center">
            {currentProfile.username}
          </Title>

          <Group gap="xs">
            <Badge variant="light" color="blue">
              {currentProfile.activated ? 'Activated' : 'Inactive'}
            </Badge>
          </Group>

          <Divider my="sm" w="100%" />

          <Stack gap="xs" w="100%">
            <Group wrap="nowrap">
              <IconMail size={16} />
              <Text size="sm" c="dimmed">
                {currentProfile.email}
              </Text>
            </Group>

            <Group wrap="nowrap">
              <IconPhone size={16} />
              <Text size="sm" c="dimmed">
                {currentProfile.phone}
              </Text>
            </Group>
          </Stack>

          <Button variant="light" color="blue" fullWidth mt="md">
            Edit Profile
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
