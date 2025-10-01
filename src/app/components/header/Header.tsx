'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const NAVIGATION_LINKS = [
  { name: 'Classes', href: '/classes' },
  { name: 'Camps', href: '/camps' },
  { name: 'Subjects', href: '/subjects' },
  { name: 'Events', href: '/events' },
  { name: 'Programs', href: '/programs' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
] as const;

interface NavigationLinksProps {
  onLinkClick?: () => void;
}

const NavigationLinks = ({ onLinkClick }: NavigationLinksProps) => {
  const router = useRouter();

  return (
    <>
      {NAVIGATION_LINKS.map((link) => (
        <Button
          variant="white"
          key={link.name}
          color="black"
          onClick={() => {
            router.push(link.href);
            onLinkClick?.();
          }}
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

interface UserSectionProps {
  isLoggedIn: boolean;
}

const UserSection = ({ isLoggedIn }: UserSectionProps) => {
  const router = useRouter();

  if (isLoggedIn) {
    return (
      <Avatar color="cyan" radius="xl" visibleFrom="md">
        MK
      </Avatar>
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

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
  const router = useRouter();

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
        <NavigationLinks onLinkClick={onClose} />
        <Divider my="md" />
        <Button
          color="fresh-green"
          onClick={() => {
            router.push('/login');
            onClose();
          }}
        >
          Login
        </Button>
      </Stack>
    </Drawer>
  );
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDrawerOpen, { open, close }] = useDisclosure(false);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!cancelled) setIsLoggedIn(res.ok);
      } catch {
        if (!cancelled) setIsLoggedIn(false);
      }
    };
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <header className="w-full bg-white">
        <Container fluid>
          <Flex justify="space-between" align="center" px={20} py={10}>
            <Logo />
            {/* Desktop Navigation */}
            <Group gap="xs" visibleFrom="md">
              <NavigationLinks />
            </Group>
            {/* Desktop User Section */}
            <UserSection isLoggedIn={isLoggedIn} />
            {/* Mobile Menu Button */}
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

      <MobileDrawer isOpen={isDrawerOpen} onClose={close} />
    </>
  );
};

export default Header;
