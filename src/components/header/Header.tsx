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
  <Link href="/" className="flex items-center space-x-2 cursor-pointer">
    <Image
      src="/images/cl_logo.webp"
      alt="Website Logo"
      width={150}
      height={40}
    />
  </Link>
);

const UserSection = ({ isLoggedIn, onLogout, isLoading }: UserSectionProps) => {
  const router = useRouter();

  if (isLoading) {
    return <div style={{ width: 32, height: 32 }} />;
  }

  if (isLoggedIn) {
    return (
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Avatar
            color="cyan"
            radius="xl"
            style={{ cursor: 'pointer' }}
            visibleFrom="md"
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
    );
  }

  return (
    <Button
      visibleFrom="md"
      color="fresh-green"
      onClick={() => router.push('/login')}
    >
      Login
    </Button>
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
      size={200}
      offset={8}
      radius="md"
    >
      <Stack align="stretch" gap="xs">
        <NavigationLinks />
        <Divider my="md" />

        {isLoggedIn ? (
          <>
            <Text size="sm" fw={500} px="sm">
              User
            </Text>
            <Text size="xs" c="dimmed" px="sm" mb="xs">
              Logged In
            </Text>

            <Button
              variant="light"
              onClick={() => handleNavigation('/management')}
            >
              Management
            </Button>

            <Button
              color="red"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            color="fresh-green"
            onClick={() => handleNavigation('/login')}
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
      <header className="w-full bg-white">
        <Container fluid>
          <Flex justify="space-between" align="center" px={20} py={10}>
            <Logo />
            <Group gap="xs" visibleFrom="md">
              <NavigationLinks />
            </Group>
            <UserSection
              isLoggedIn={isLoggedIn}
              onLogout={logout}
              isLoading={isLoading}
            />
            <Burger
              lineSize={2}
              size="md"
              opened={isDrawerOpen}
              onClick={open}
              aria-label="Toggle navigation"
              hiddenFrom="md"
            />
          </Flex>
        </Container>
      </header>

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
