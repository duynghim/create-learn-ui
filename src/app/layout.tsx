import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

import './globals.css';
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core';
import React from 'react';
import { theme } from '@/app/theme/theme';
import { Roboto } from 'next/font/google';
import { Header } from '@/components';
import { AuthProvider } from '@/contexts';
import { QueryProvider } from '@/providers/QueryProvider';
import { NotificationProvider } from '@/providers';
import '@mantine/tiptap/styles.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <title>Create Learn</title>
      </head>
      <body className={roboto.className}>
        <MantineProvider theme={theme}>
          <QueryProvider>
            <AuthProvider>
              <NotificationProvider>
                <Header />
                {children}
              </NotificationProvider>
            </AuthProvider>
          </QueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
