'use client';
import CodeIcon from '@/components/icons/CodeIcon';
import MITIcon from '@/components/icons/MITIcon';
import HarvardIcon from '@/components/icons/HarvardIcon';
import StandfordIcon from '@/components/icons/StanfordIcon';
import AppleIcon from '@/components/icons/AppleIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { Flex, Center, Box, Text, Stack } from '@mantine/core';
import styles from './DesignByExperts.module.css';

const ExpertIcons = ({ isMobile = false }: { isMobile?: boolean }) => (
  <Flex align="center" gap="xl" px={{ base: 10, md: 0 }} wrap="wrap">
    <GoogleIcon
      height={isMobile ? undefined : '36px'}
      className={isMobile ? styles.iconResponsive : undefined}
    />
    <AppleIcon
      height={isMobile ? undefined : '46px'}
      className={isMobile ? styles.iconApple : undefined}
    />
    <StandfordIcon
      height={isMobile ? undefined : '36px'}
      className={isMobile ? styles.iconResponsive : undefined}
    />
    <HarvardIcon
      height={isMobile ? undefined : '36px'}
      className={isMobile ? styles.iconResponsive : undefined}
    />
    <MITIcon
      height={isMobile ? undefined : '36px'}
      className={isMobile ? styles.iconResponsive : undefined}
    />
    <CodeIcon
      height={isMobile ? undefined : '36px'}
      className={isMobile ? styles.iconResponsive : undefined}
    />
  </Flex>
);

const ExpertsSection = () => (
  <>
    <Center py={20} visibleFrom="smmd">
      <Box pb={6} px={10}>
        <Text fw={400} c="rgba(0, 0, 0, 0.6)">
          Designed by experts from:
        </Text>
      </Box>

      {/* Scale down + increase spacing */}
      <Box
        style={{
          transform: 'scale(0.8)',
          transformOrigin: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 32, // increased spacing between icons (try 24–40 depending on taste)
        }}
      >
        <ExpertIcons />
      </Box>
    </Center>

    <Stack align="center" gap="xs" py={20} hiddenFrom="smmd">
      <Center>
        <Text fw={400} c="rgba(0, 0, 0, 0.6)">
          Designed by experts from:
        </Text>
      </Center>

      {/* Mobile icons smaller and spaced slightly less */}
      <Box
        style={{
          transform: 'scale(0.8)',
          transformOrigin: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <ExpertIcons isMobile />
      </Box>
    </Stack>
  </>
);

export default ExpertsSection;
