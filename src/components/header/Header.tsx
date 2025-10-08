// src/components/header/Header.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Flex,
  Group,
  Stack,
  Menu,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { UserSectionProps, MobileDrawerProps } from '@/types';

const NAVIGATION_LINKS = [
  { name: 'Classes', href: '/classes' },
  { name: 'Camps', href: '/camps' },
  { name: 'Subjects', href: '/subjects' },
  { name: 'Events', href: '/events' },
  { name: 'Programs', href: '/programs' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
] as const;

const NavigationLinks = () => {
  return (
    <>
      {NAVIGATION_LINKS.map((link) => (
        <Button
          variant="white"
          key={link.name}
          color="black"
          component={Link}
          href={link.href}
        >
          {link.name}
        </Button>
      ))}
    </>
  );
};

const Logo = () => (
  <Link href="/">
    <Image
      src="/images/cl_logo.webp"
      alt="Website Logo"
      width={150}
      height={40}
      priority
    />
  </Link>
);

const UserSection = ({ isLoggedIn, onLogout, isLoading }: UserSectionProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div
        style={{ width: 40, height: 40, display: 'flex', alignItems: 'center' }}
      ></div>
    );
  }

  if (isLoggedIn) {
    return (
      <Group gap="xs">
        {/* Desktop Menu */}
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Avatar
              color="cyan"
              radius="xl"
              style={{ cursor: 'pointer' }}
              visibleFrom="md"
              size="md"
            >
              U
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>
              <Text size="sm" fw={500}>
                User
              </Text>
              <Text size="xs" c="dimmed">
                Logged In
              </Text>
            </Menu.Label>
            <Menu.Divider />

            <Menu.Item onClick={() => router.push('/management')}>
              Management
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item color="red" onClick={onLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {/* Mobile Avatar - visible only on mobile */}
        <Avatar color="cyan" radius="xl" hiddenFrom="md" size="md">
          U
        </Avatar>
      </Group>
    );
  }

  return (
    <Group gap="xs">
      <Button
        visibleFrom="md"
        color="fresh-green"
        onClick={() => router.push('/login')}
      >
        Login
      </Button>

      {/* Mobile Login Button */}
      <Button
        hiddenFrom="md"
        color="fresh-green"
        size="sm"
        onClick={() => router.push('/login')}
      >
        Login
      </Button>
    </Group>
  );
};

const MobileDrawer = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLogout,
}: MobileDrawerProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      position="right"
      size={280}
      offset={8}
      radius="md"
    >
      <Stack align="stretch" gap="xs" p="md">
        {/* Navigation Links */}
        <Stack gap="xs">
          {NAVIGATION_LINKS.map((link) => (
            <Button
              key={link.name}
              variant="subtle"
              justify="flex-start"
              onClick={() => handleNavigation(link.href)}
              fullWidth
            >
              {link.name}
            </Button>
          ))}
        </Stack>

        <Divider my="md" />

        {/* User Section */}
        {isLoggedIn ? (
          <Stack gap="xs">
            <Group gap="xs" px="sm">
              <Avatar color="cyan" radius="xl" size="sm">
                U
              </Avatar>
              <div>
                <Text size="sm" fw={500}>
                  User
                </Text>
                <Text size="xs" c="dimmed">
                  Logged In
                </Text>
              </div>
            </Group>

            <Button
              variant="light"
              justify="flex-start"
              onClick={() => handleNavigation('/management')}
              fullWidth
            >
              Management
            </Button>

            <Button
              color="red"
              variant="light"
              justify="flex-start"
              onClick={() => {
                onLogout();
                onClose();
              }}
              fullWidth
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            color="fresh-green"
            onClick={() => handleNavigation('/login')}
            fullWidth
          >
            Login
          </Button>
        )}
      </Stack>
    </Drawer>
  );
};

const Header = () => {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [isDrawerOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <header>
        <Container fluid>
          <Flex justify="space-between" align="center" px={20} py={10}>
            <Logo />

            {/* Desktop Navigation */}
            <Group gap="xs" visibleFrom="md">
              <NavigationLinks />
            </Group>

            {/* User Section */}
            <Group gap="xs">
              <UserSection
                isLoggedIn={isLoggedIn}
                onLogout={logout}
                isLoading={isLoading}
              />

              {/* Mobile Menu Burger */}
              <Burger
                lineSize={2}
                size="md"
                opened={isDrawerOpen}
                onClick={open}
                aria-label="Toggle navigation"
                hiddenFrom="md"
              />
            </Group>
          </Flex>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={close}
        isLoggedIn={isLoggedIn}
        onLogout={logout}
      />
    </>
  );
};

export default Header;
