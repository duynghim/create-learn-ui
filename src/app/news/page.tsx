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
} from '@mantine/core';
import { useNewsQuery } from '@/hooks';
import { NewsCard } from '@/components';
import styles from './page.module.css';

const DeskTopSection = () => {
  return (
    <Box className={styles.container} visibleFrom='smmd'>
      <Box className={styles.coverBanner}>
        <Box className={styles.siteCover}>
          <Image
            src="/images/coding-kids-hero.png"
            alt="Coding Kids Hero"
            className={styles.coverImg}
          />
          <Box className={styles.coverTitle}>
            <h1>Kids&apos; Coding&nbsp;Corner</h1>
            <h2>
              Fun projects and resources for kids and teens to learn coding
            </h2>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const MobileSection = () => {
  return (
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
};
const AllNews = () => {
  const { news, isLoading, error } = useNewsQuery();

  if (isLoading)
    return (
      <Stack align="center">
        <Skeleton height={287} radius="sm" width="50%" />
        <Skeleton height={20} radius="sm" width="50%" />
        <Skeleton height={50} radius="sm" width="50%" />
      </Stack>
    );

  if (error) {
    return (
      <Alert variant="light" color="red">
        An error occurred while fetching news
      </Alert>
    );
  }

  return (
    <Container fluid>
      <DeskTopSection />
      <MobileSection />
      <Stack align="center" gap={56} mt={56}>
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </Stack>
    </Container>
  );
};

export default AllNews;
