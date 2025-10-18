// src/components/management/Sidebar.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Stack,
  Text,
  UnstyledButton,
  Group,
  Tooltip,
} from '@mantine/core';
import {
  IconMath,
  IconUsers,
  IconSchool,
  IconChevronRight,
  IconChevronLeft,
  IconChalkboardTeacher,
  IconCalendar,
  IconNews,
  IconUserPlus,
  IconCalendarUser,
} from '@tabler/icons-react';
import classes from './Sidebar.module.css';
import React from 'react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  description?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'subject',
    label: 'Subject',
    icon: IconMath,
    href: '/management',
    description: 'Manage Subjects',
  },
  {
    id: 'grades',
    label: 'Grades',
    icon: IconUsers,
    href: '/management/grade',
    description: 'Manage user grades',
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: IconChalkboardTeacher,
    href: '/management/teacher',
    description: 'Manage teaching staff',
  },
  {
    id: 'class',
    label: 'Classes',
    icon: IconSchool,
    href: '/management/class',
    description: 'Manage Classes',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: IconCalendar,
    href: '/management/schedule',
    description: 'Manage Schedule',
  },
  {
    id: 'consultation',
    label: 'Consultation',
    icon: IconCalendar,
    href: '/management/consultation',
    description: 'Manage Consultation',
  },
  {
    id: 'news',
    label: 'News',
    icon: IconNews,
    href: '/management/news',
    description: 'Manage News Articles',
  },
  {
    id: 'account',
    label: 'Account',
    icon: IconUserPlus,
    href: '/management/account',
    description: 'Manage Account',
  },
  {
    id: 'registration',
    label: 'Registration',
    icon: IconCalendarUser,
    href: '/management/registration',
    description: 'Manage Registration',
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === '/management') {
      return pathname === '/management';
    }
    return pathname.startsWith(href);
  };

  return (
    <Box className={classes.sidebar} data-collapsed={collapsed}>
      {/* Header */}
      <Group justify="space-between" p="md" className={classes.header}>
        {!collapsed && (
          <Text size="lg" fw={600} c="fresh-blue">
            Management
          </Text>
        )}
        {onToggle && (
          <UnstyledButton onClick={onToggle} className={classes.toggleButton}>
            {collapsed ? (
              <IconChevronRight size={18} />
            ) : (
              <IconChevronLeft size={18} />
            )}
          </UnstyledButton>
        )}
      </Group>

      {/* Navigation Items */}
      <Stack gap={4} p="sm">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          const navButton = (
            <UnstyledButton
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={classes.navButton}
              data-active={active}
            >
              <Group gap="sm" wrap="nowrap">
                <Icon
                  size={20}
                  className={classes.navIcon}
                  data-active={active}
                />
                {!collapsed && (
                  <Text
                    size="sm"
                    fw={active ? 600 : 400}
                    className={classes.navLabel}
                    data-active={active}
                  >
                    {item.label}
                  </Text>
                )}
              </Group>
            </UnstyledButton>
          );

          if (collapsed && item.description) {
            return (
              <Tooltip
                key={item.id}
                label={item.description}
                position="right"
                withArrow
              >
                {navButton}
              </Tooltip>
            );
          }

          return navButton;
        })}
      </Stack>
    </Box>
  );
};

export default Sidebar;
