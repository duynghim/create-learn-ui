import { Card, Group, Stack, Text, Title } from '@mantine/core';

const ManagementDashboardPage = () => {
  return (
    <Stack gap="md">
      <Title order={3}>Admin Dashboard</Title>
      <Group>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600}>Accounts</Text>
          <Text c="dimmed" size="sm">Create and manage user accounts.</Text>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600}>Classes</Text>
          <Text c="dimmed" size="sm">Manage classes and schedules.</Text>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600}>Consultants</Text>
          <Text c="dimmed" size="sm">Manage consultants and assignments.</Text>
        </Card>
      </Group>
    </Stack>
  );
};

export default ManagementDashboardPage;
