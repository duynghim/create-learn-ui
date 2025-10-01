import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';

const ClassesPage = () => {
  const classes = [
    { name: 'Math 101', status: 'Open' },
    { name: 'Science 201', status: 'Closed' },
  ];

  return (
    <Stack>
      <Title order={3}>Classes</Title>
      <Group>
        {classes.map((c) => (
          <Card key={c.name} withBorder padding="md" radius="md">
            <Text fw={600}>{c.name}</Text>
            <Badge mt={8} color={c.status === 'Open' ? 'green' : 'gray'}>{c.status}</Badge>
          </Card>
        ))}
      </Group>
    </Stack>
  );
};

export default ClassesPage;
