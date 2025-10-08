// src/app/management/page.tsx
'use client';

import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  ThemeIcon,
  Stack,
  SimpleGrid,
  Progress,
  Badge,
} from '@mantine/core';
import {
  IconUsers,
  IconSchool,
  IconUserCheck,
  IconTrendingUp,
} from '@tabler/icons-react';

const STATS_DATA = [
  {
    title: 'Total Students',
    value: '1,234',
    diff: '+13%',
    icon: IconUsers,
    color: 'blue',
  },
  {
    title: 'Active Classes',
    value: '56',
    diff: '+8%',
    icon: IconSchool,
    color: 'green',
  },
  {
    title: 'Teachers',
    value: '23',
    diff: '+2%',
    icon: IconUserCheck,
    color: 'orange',
  },
  {
    title: 'Revenue',
    value: '$12,340',
    diff: '+18%',
    icon: IconTrendingUp,
    color: 'red',
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    action: 'New student enrolled',
    time: '2 hours ago',
    type: 'success',
  },
  {
    id: 2,
    action: 'Class schedule updated',
    time: '4 hours ago',
    type: 'info',
  },
  {
    id: 3,
    action: 'Teacher profile updated',
    time: '6 hours ago',
    type: 'warning',
  },
  { id: 4, action: 'Payment processed', time: '8 hours ago', type: 'success' },
];

const StatsCard = ({ title, value, diff, icon: Icon, color }: any) => (
  <Card withBorder p="xl" radius="md">
    <Group justify="space-between">
      <div>
        <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
          {title}
        </Text>
        <Text fw={700} fz="xl">
          {value}
        </Text>
      </div>
      <ThemeIcon color={color} variant="light" size={38}>
        <Icon size={22} stroke={1.5} />
      </ThemeIcon>
    </Group>
    <Text c="dimmed" fz="sm" mt="md">
      <Text component="span" c={diff.startsWith('+') ? 'teal' : 'red'} fw={700}>
        {diff}
      </Text>{' '}
      compared to last month
    </Text>
  </Card>
);

const ManagementDashboard = () => {
  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'success':
        return 'green';
      case 'warning':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <Stack gap="xl">
      <div>
        <Title order={2} c="fresh-blue">
          Dashboard
        </Title>
        <Text c="dimmed" mt={4}>
          Welcome back! Here's what's happening with your management system.
        </Text>
      </div>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {STATS_DATA.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </SimpleGrid>

      {/* Content Grid */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="xl" radius="md" h="100%">
            <Title order={3} mb="md">
              Class Performance
            </Title>
            <Stack gap="md">
              {['Math 101', 'Science 201', 'English 301', 'History 401'].map(
                (className, index) => (
                  <div key={className}>
                    <Group justify="space-between" mb={4}>
                      <Text fz="sm">{className}</Text>
                      <Text fz="sm" c="dimmed">
                        {85 - index * 5}%
                      </Text>
                    </Group>
                    <Progress value={85 - index * 5} color="fresh-blue" />
                  </div>
                )
              )}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="xl" radius="md" h="100%">
            <Title order={3} mb="md">
              Recent Activities
            </Title>
            <Stack gap="md">
              {RECENT_ACTIVITIES.map((activity) => (
                <Group key={activity.id} justify="space-between">
                  <div>
                    <Text fz="sm">{activity.action}</Text>
                    <Text fz="xs" c="dimmed">
                      {activity.time}
                    </Text>
                  </div>
                  <Badge
                    color={getActivityColor(activity.type)}
                    variant="light"
                    size="sm"
                  >
                    {activity.type}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default ManagementDashboard;
