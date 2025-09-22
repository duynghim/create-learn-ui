'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Stack,
} from '@mantine/core';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useDisclosure } from '@mantine/hooks';

const navigationLinks = [
  { name: 'Classes', href: '/classes' },
  { name: 'Camps', href: '/camps' },
  { name: 'Subjects', href: '/subjects' },
  { name: 'Events', href: '/events' },
  { name: 'Programs', href: '/programs' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDrawerOpen, { open, close }] = useDisclosure(false);

  useEffect(() => {
    // Mock hook first
    setIsLoggedIn(false);
  }, []);

  return (
    <>
      <header className="w-full border-b bg-white flex">
        <nav>
          <Flex bg="white" justify="space-between" px={20} py={10}>
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image
                src="/images/cl_logo.webp"
                alt="Website Logo"
                width={150}
                height={40}
              />
            </Link>

            {/* Center: Navigation (Desktop) */}
            <Group gap="xs" visibleFrom="md">
              {navigationLinks.map((link) => (
                <Button
                  variant="white"
                  key={link.name}
                  component="a"
                  href={link.href}
                  color="black"
                  onClick={(event) => event.preventDefault()}
                >
                  {link.name}
                </Button>
              ))}
            </Group>

            {/* Right: Desktop Login/Avatar and Mobile Hamburger */}
            {isLoggedIn ? (
              <Avatar color="cyan" radius="xl" visibleFrom="md">
                MK
              </Avatar>
            ) : (
              <Button
                component="a"
                href="/login"
                visibleFrom="md"
                color="fresh-green"
              >
                Login
              </Button>
            )}

            <ActionIcon
              variant="white"
              color="black"
              className="flex md:hidden"
              hiddenFrom="md"
              onClick={open}
            >
              <RxHamburgerMenu></RxHamburgerMenu>
            </ActionIcon>
          </Flex>
        </nav>
      </header>

      {/*Drawer Mobile*/}
      <Drawer
        opened={isDrawerOpen}
        onClose={close}
        withCloseButton={false}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        position="right"
        size={200}
        offset={8}
        radius="md"
      >
        <Stack align="stretch" gap="xs">
          {navigationLinks.map((link) => (
            <Button
              variant="white"
              key={link.name}
              component="a"
              href={link.href}
              color="black"
              onClick={(event) => event.preventDefault()}
            >
              {link.name}
            </Button>
          ))}
          <Divider my="md" />

          <Button component="a" href="/login" color="fresh-green">
            Login
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default Header;
