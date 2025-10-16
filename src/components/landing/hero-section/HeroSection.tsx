'use client';
import {
  Button,
  Grid,
  Stack,
  Text,
  Title,
  Image,
  BackgroundImage,
  Flex,
  Box,
  Center,
  Container,
} from '@mantine/core';
import CodeIcon from '@/components/icons/CodeIcon';
import MITIcon from '@/components/icons/MITIcon';
import HarvardIcon from '@/components/icons/HarvardIcon';
import StandfordIcon from '@/components/icons/StanfordIcon';
import AppleIcon from '@/components/icons/AppleIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';
import styles from './HeroSection.module.css';
import GradientBox from '@/components/gradient-box/GradientBox';

const HERO_CONTENT = {
  mainTitle: 'Join Fun Creative Adventures',
  subtitle: 'Coding Classes for Kids',
  description:
    'Learn coding, AI, robotics, and more with live online small-group classes led by expert instructors.',
  ctaText: 'Book Free Coding Classes',
  expertsText: 'Designed by experts from:',
  bannerText: 'Special Congressional App Challenge events',
  bannerCtaText: 'Learn More',
} as const;

const RESPONSIVE_STYLES = {
  titleSize: { sm: '2.57rem', md: '2.78rem', xl: '2.99rem' },
  subtitleSize: { sm: '1.8rem', md: '2.02rem', xl: '2.02rem' },
  leftPadding: { base: '5rem', xxl: '20rem', xl: '25rem' },
} as const;

const ExpertIcons = ({ isMobile = false }: { isMobile?: boolean }) => (
  <Flex align="center" gap="xs">
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

const HeroContent = () => {
  const handleScrollToFreeClasses = () => {
    const element = document.getElementById('free-classes-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      <Title fz={RESPONSIVE_STYLES.titleSize} c="fresh-blue">
        {HERO_CONTENT.mainTitle}
      </Title>
      <Title size="2.02rem" fz={RESPONSIVE_STYLES.subtitleSize} c="fresh-blue">
        {HERO_CONTENT.subtitle}
      </Title>
      <Text fw={500}>{HERO_CONTENT.description}</Text>
      <Button
        w="fit-content"
        color="fresh-blue"
        onClick={handleScrollToFreeClasses}
      >
        {HERO_CONTENT.ctaText}
      </Button>
    </>
  );
};

const DesktopHero = () => (
  <Grid visibleFrom="smmd">
    <Grid.Col span={5}>
      <Stack h="100%" justify="center" pl={RESPONSIVE_STYLES.leftPadding}>
        <HeroContent />
      </Stack>
    </Grid.Col>
    <Grid.Col span={7}>
      <Image
        src="/images/coding-kids-hero.png"
        alt="Kids learning coding"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 30% 100%)' }}
        h={540}
      />
    </Grid.Col>
  </Grid>
);

const MobileHero = () => {
  const handleScrollToFreeClasses = () => {
    const element = document.getElementById('free-classes-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <BackgroundImage
      src="/images/coding-kids-hero.png"
      hiddenFrom="smmd"
      h={540}
      pos="relative"
    >
      <Box pos="absolute" inset={0} bg="rgba(0,0,0,0.5)" />
      <Flex
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.4)"
        align="center"
        justify="center"
        px={20}
      >
        <Stack align="center" gap="sm">
          <Title size="2.78rem" ta="center" c="fresh-blue">
            {HERO_CONTENT.mainTitle}
          </Title>
          <Title size="2.02rem" ta="center" c="fresh-blue">
            {HERO_CONTENT.subtitle}
          </Title>
          <Text c="white" ta="center" size="lg">
            {HERO_CONTENT.description}
          </Text>
          <Button size="sm" onClick={handleScrollToFreeClasses}>
            {HERO_CONTENT.ctaText}
          </Button>
        </Stack>
      </Flex>
    </BackgroundImage>
  );
};

const ExpertsSection = () => (
  <>
    <Center py={20} visibleFrom="smmd">
      <Box pb={6} px={20}>
        <Text fw={400} c="rgba(0, 0, 0, 0.6)">
          {HERO_CONTENT.expertsText}
        </Text>
      </Box>
      <ExpertIcons />
    </Center>
    <Stack align="center" gap="xs" py={20} hiddenFrom="smmd">
      <Center>
        <Text fw={400} c="rgba(0, 0, 0, 0.6)">
          {HERO_CONTENT.expertsText}
        </Text>
      </Center>
      <ExpertIcons isMobile />
    </Stack>
  </>
);

const HeroSection = () => {
  return (
    <Container maw="100%" px={0}>
      <GradientBox py={5}>
        <Text c="white" mr={10} fw={500}>
          {HERO_CONTENT.bannerText}
        </Text>
        <Button variant="filled" color="fresh-green">
          {HERO_CONTENT.bannerCtaText}
        </Button>
      </GradientBox>
      <Box>
        <DesktopHero />
        <MobileHero />
      </Box>
      <ExpertsSection />
    </Container>
  );
};

export default HeroSection;
