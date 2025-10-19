'use client';

import React from 'react';
import { useNewsQuery } from '@/hooks';
import { ClassCard } from '@/components';
import {
  Alert,
  Center,
  Container,
  Loader,
  Stack,
  Text,
  Flex,
} from '@mantine/core';
import { useRouter } from 'next/navigation';

const NewsSection: React.FC = () => {
  const { news, isLoading, error } = useNewsQuery();
  const router = useRouter();

  const handleNewsClick = (newsId: string | number) => {
    router.push(`/news/${newsId}`);
  };

  if (isLoading) {
    return (
      <Container fluid py={48}>
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py={48}>
        <Alert variant="light" color="red">
          News not found. Please try again later.
        </Alert>
      </Container>
    );
  }

  // Only show published news articles
  const displayNews =
    news?.filter((article) => article.isDisplay).slice(0, 8) || [];

  if (displayNews.length === 0) {
    return (
      <Container py={48}>
        <Text ta="center" c="dimmed">
          No news articles available at the moment.
        </Text>
      </Container>
    );
  }

  return (
    <Stack py={48}>
      <Text
        fz={{ base: '2.57rem', sm: '2.78rem', lg: '2.99rem' }}
        ta="center"
        c="fresh-blue"
        fw={600}
      >
        News for Kids and Parents
      </Text>

      <Flex w="100%" wrap="wrap" justify="center" gap={40}>
        {displayNews.map((newsItem) => (
          <ClassCard
            key={newsItem.id}
            title={newsItem.title}
            description={newsItem.brief}
            imageUrl={newsItem.image || 'https://picsum.photos/400/200'}
            titleButton="Learn More"
            onButtonClick={() => handleNewsClick(newsItem.id)}
          />
        ))}
      </Flex>
    </Stack>
  );
};

export default NewsSection;
