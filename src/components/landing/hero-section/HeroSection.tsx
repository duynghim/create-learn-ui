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
import GradientBox from '@/components/gradient-box/GradientBox';
import { ExpertIcons } from '@/components';

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

const handleScrollToFreeClasses = () => {
  const element = document.getElementById('free-classes-section');
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

const RESPONSIVE_STYLES = {
  titleSize: { sm: '2.57rem', md: '2.78rem', xl: '2.99rem' },
  subtitleSize: { sm: '1.8rem', md: '2.02rem', xl: '2.02rem' },
  leftPadding: { base: '5rem', xxl: '20rem', xl: '25rem' },
} as const;

const HeroContent = () => {
  return (
    <>
      <Title fz={RESPONSIVE_STYLES.titleSize} c="fresh-blue">
        {HERO_CONTENT.mainTitle}
      </Title>
      <Title size="2.02rem" fz={RESPONSIVE_STYLES.subtitleSize} c="fresh-blue">
        {HERO_CONTENT.subtitle}
      </Title>
      <Text fw={500}>{HERO_CONTENT.description}</Text>
      <Button w="fit-content" onClick={handleScrollToFreeClasses}>
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
      <ExpertIcons />
    </Container>
  );
};

export default HeroSection;
