'use client';

import { Card, Text, Image, Stack, Title, NavLink } from '@mantine/core';
import React from 'react';
import { News } from '@/types';
import Link from 'next/link';

export interface NewsCardProps {
  news: News;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <Card withBorder shadow="sm" w={575} maw={575} h={510} mah={510} p={0}>
      <Card.Section>
        <Image src={news.image} alt={news.title} h={287} />
      </Card.Section>
      <Stack p={30} w="100%" h="100%" bg="#f5f5f5">
        <Link href={`/news/${news.id}`} className="group">
          <Title
            order={3}
            fw={500}
            className="text-zinc-900 transition-colors group-hover:text-blue-600 underline-offset-2 hover:underline"
          >
            {news.title}
          </Title>
        </Link>
        <Text c="#999" fw={400} lineClamp={3} mt={-15}>
          {news.brief}
        </Text>
      </Stack>
    </Card>
  );
};

export default NewsCard;
