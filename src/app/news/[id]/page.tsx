'use client';

import { useParams } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Stack,
  Alert,
  Loader,
  Center,
  Image,
  Box,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { newsApiClient } from '@/api';
import styles from './news-detail.module.css';

const NewsDetailPage = () => {
  const params = useParams();
  const newsId = params.id as string;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['news', newsId],
    queryFn: () => newsApiClient.getById(newsId),
    enabled: !!newsId,
  });

  const newsData = response?.data;

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !newsData) {
    return (
      <Container py="xl">
        <Alert color="red" mt="md">
          News article not found or error loading news details.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* News Image */}
        {newsData.image && (
          <Box>
            <Image
              src={newsData.image}
              alt={newsData.title}
              radius="md"
              mah={400}
              fit="cover"
            />
          </Box>
        )}

        {/* News Title */}
        <Title order={1} size="2.5rem" c="fresh-blue" ta="center">
          {newsData.title}
        </Title>

        {/* News Brief */}
        <Text
          size="xl"
          fw={500}
          c="dimmed"
          ta="center"
          style={{ fontStyle: 'italic' }}
        >
          {newsData.brief}
        </Text>

        {/* News Content */}
        <Box className={styles.newsContent}>
          <div dangerouslySetInnerHTML={{ __html: newsData.content }} />
        </Box>

        {/* Publication Status (if needed for admin) */}
        {!newsData.isDisplay && (
          <Alert color="orange" variant="light">
            This news article is currently in draft mode and not published.
          </Alert>
        )}
      </Stack>
    </Container>
  );
};

export default NewsDetailPage;
