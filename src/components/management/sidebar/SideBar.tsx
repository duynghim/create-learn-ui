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
    id: 'classes',
    label: 'Classes',
    icon: IconSchool,
    href: '/management/classes',
    description: 'Manage classes and courses',
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: IconChalkboardTeacher,
    href: '/management/teacher',
    description: 'Manage teaching staff',
  },
  {
    id: 'consultants',
    label: 'Consultants',
    icon: IconUsers,
    href: '/management/consultants',
    description: 'Manage consultants',
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
