'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const NavigationLinks = ({ onLinkClick }: NavigationLinksProps) => (
  <>
    {NAVIGATION_LINKS.map((link) => (
      <Button
        variant="white"
        key={link.name}
        component="a"
        href={link.href}
        color="black"
        onClick={(event) => {
          event.preventDefault();
          onLinkClick?.();
        }}
      >
        {link.name}
      </Button>
    ))}
  </>
);

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
  if (isLoggedIn) {
    return (
      <Avatar color="cyan" radius="xl" visibleFrom="md">
        MK
      </Avatar>
    );
  }

  return (
    <Button
      component="a"
      href="/login"
      visibleFrom="md"
      color="fresh-green"
      onClick={(event) => event.preventDefault()}
    >
      Login
    </Button>
  );
};

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => (
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
        component="a"
        href="/login"
        color="fresh-green"
        onClick={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        Login
      </Button>
    </Stack>
  </Drawer>
);

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDrawerOpen, { open, close }] = useDisclosure(false);

  useEffect(() => {
    // TODO: Replace with actual authentication logic
    setIsLoggedIn(false);
  }, []);

  return (
    <>
      <header className="w-full border-b bg-white">
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
            />
          </Flex>
        </Container>
      </header>

      <MobileDrawer isOpen={isDrawerOpen} onClose={close} />
    </>
  );
};

export default Header;
