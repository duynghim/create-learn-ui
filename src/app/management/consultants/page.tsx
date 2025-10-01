import { Avatar, Group, Stack, Text, Title } from '@mantine/core';

const ConsultantsPage = () => {
  const consultants = [
    { name: 'Alice Johnson', expertise: 'STEM' },
    { name: 'Bob Smith', expertise: 'Arts' },
  ];

  return (
    <Stack>
      <Title order={3}>Consultants</Title>
      <Stack mt="md" gap="sm">
        {consultants.map((c) => (
          <Group key={c.name}>
            <Avatar name={c.name} color="cyan" />
            <div>
              <Text fw={600}>{c.name}</Text>
              <Text c="dimmed" size="sm">Expertise: {c.expertise}</Text>
            </div>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
};

export default ConsultantsPage;
