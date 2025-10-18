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
  Loader,
  HoverCard,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useAuth } from '@/contexts';
import type { UserSectionProps, MobileDrawerProps } from '@/types';
import { useSubjectQuery } from '@/hooks';
import { PopularSubjectCard } from '@/components';

interface NavigationLink {
  name: string;
  href: string;
}

const NAVIGATION_LINKS: NavigationLink[] = [
  { name: 'Classes', href: '/classes' },
  { name: 'Blog', href: '/news' },
  { name: 'Subjects', href: '/subjects' },
] as const;

const placeholderIcon = 'https://via.placeholder.com/96x96.png?text=Subject';

const SubjectHoverCard = () => {
  const { subjects, isLoading } = useSubjectQuery({
    page: 0,
    pageSize: 100,
  });

  if (isLoading) return <Loader size="sm" />;

  return (
    <HoverCard>
      <HoverCard.Target>
        <Button
          variant="white"
          key="subject-link"
          color="black"
          component={Link}
          href="/subjects"
        >
          Subjects
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Flex px={10} wrap="wrap" gap={30} maw={950} justify="center">
          {subjects.map((subject) => (
            <PopularSubjectCard
              fontSize="0.875rem"
              width={147}
              height={48}
              imageSize={48}
              gap={10}
              key={subject.id}
              id={subject.id}
              name={subject.name}
              imageSrc={
                subject.iconBase64
                  ? `data:image/png;base64,${subject.iconBase64}`
                  : placeholderIcon
              }
            />
          ))}
        </Flex>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

const NavigationLinks = () => {
  return (
    <>
      {NAVIGATION_LINKS.map((link) =>
        link.name === 'Subjects' ? (
          <SubjectHoverCard key={link.name} />
        ) : (
          <Button
            variant="white"
            key={link.name}
            color="black"
            component={Link}
            href={link.href}
          >
            {link.name}
          </Button>
        )
      )}
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

const UserSection = ({ isLoggedIn, onLogout, userLogin }: UserSectionProps) => {
  const router = useRouter();

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
              {userLogin?.role === 'ADMIN' ? 'A' : 'O'}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>
              <Text size="md" fw={500}>
                {userLogin?.sub}
              </Text>
              <Text size="xs" c="dimmed">
                Logged In
              </Text>
            </Menu.Label>
            <Menu.Divider />

            <Menu.Item onClick={() => router.push('/management')}>
              Management
            </Menu.Item>

            <Menu.Item onClick={() => router.push('/current-profile')}>
              Profile
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
  const { isLoggedIn, isLoading, logout, user } = useAuth();
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
                userLogin={user}
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
