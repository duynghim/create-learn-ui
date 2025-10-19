'use client';

import {
  Alert,
  Container,
  Skeleton,
  Stack,
  Box,
  BackgroundImage,
  Text,
  Title,
  Flex,
  Image,
  SimpleGrid,
} from '@mantine/core';
import { useNewsPublicQuery } from '@/hooks/useNewsPublicQuery';
import { NewsCard } from '@/components';
import styles from './page.module.css';

const DeskTopSection = () => (
  <Box className={styles.container} visibleFrom="smmd">
    <Box className={styles.coverBanner}>
      <Box className={styles.siteCover}>
        <Image
          src="/images/coding-kids-hero.png"
          alt="Coding Kids Hero"
          className={styles.coverImg}
        />
        <Box className={styles.coverTitle}>
          <h1>Kids&apos; Coding&nbsp;Corner</h1>
          <h2>Fun projects and resources for kids and teens to learn coding</h2>
        </Box>
      </Box>
    </Box>
  </Box>
);

const MobileSection = () => (
  <BackgroundImage
    src="/images/coding-kids-hero.png"
    hiddenFrom="smmd"
    h={360}
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
          Kids&apos;
        </Title>
        <Title size="2.02rem" ta="center" c="fresh-blue">
          Coding Corner
        </Title>
        <Text c="white" ta="center" size="lg">
          Fun projects and resources for kids and teens to learn coding
        </Text>
      </Stack>
    </Flex>
  </BackgroundImage>
);

const AllNews = () => {
  const { news, isLoading, error } = useNewsPublicQuery();

  if (isLoading)
    return (
      <Container size="xl" px={{ base: 'md', sm: 'lg', lg: 'xl' }}>
        <Flex justify="center" mt={56}>
          <SimpleGrid
            cols={{ base: 1, sm: 3, md: 4, lg: 5 }}
            spacing="lg"
            style={{ justifyItems: 'center', maxWidth: 1600 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Stack key={i} gap="sm" style={{ width: 240 }}>
                <Skeleton height={180} radius="md" />
                <Skeleton height={20} radius="sm" width="80%" />
                <Skeleton height={50} radius="sm" />
              </Stack>
            ))}
          </SimpleGrid>
        </Flex>
      </Container>
    );

  if (error)
    return (
      <Container size="xl" mt={56}>
        <Alert variant="light" color="red">
          An error occurred while fetching news
        </Alert>
      </Container>
    );

  return (
    <Container fluid px={0}>
      <DeskTopSection />
      <MobileSection />

      <Container
        size="xl"
        px={{ base: 'md', sm: 'lg', lg: 'xl' }}
        mt={56}
        mb={{ base: 56, sm: 80, lg: 100 }}
      >
        {/* ✅ Center the grid */}
        <Flex justify="center">
          <SimpleGrid
            cols={{ base: 1, sm: 3, md: 4, lg: 4 }}
            spacing={{ base: 'md', sm: 'lg', lg: 24 }}
            verticalSpacing={{ base: 'lg', sm: 32, lg: 40 }}
            style={{
              justifyItems: 'center',
              maxWidth: 1600, // keeps layout width constrained
            }}
          >
            {news.map((item) => (
              <Box
                key={item.id}
                style={{
                  transform: 'scale(0.92)',
                  width: '100%',
                  maxWidth: 260,
                }}
              >
                <NewsCard news={item} />
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Container>
    </Container>
  );
};

export default AllNews;
