'use client';

import { Card, Text, Image, Stack, Title } from '@mantine/core';
import React from 'react';
import { News } from '@/types';
import Link from 'next/link';
import { useMediaQuery } from '@mantine/hooks';

export interface NewsCardProps {
  news: News;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const isSm = useMediaQuery('(min-width: 48em)'); // ≈768px
  const isLg = useMediaQuery('(min-width: 64em)'); // ≈1024px

  // Scaled down sizes for 5-column layout, keeping ratio consistent
  const imageHeight = isLg ? 200 : isSm ? 180 : 160;
  const padding = isLg ? 18 : isSm ? 16 : 14;
  const titleSize = isLg ? 'h5' : 'h6';
  const textSize = isLg ? 'sm' : 'xs';

  return (
    <Card
      withBorder
      shadow="sm"
      p={0}
      h="100%"
      style={{
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        minHeight: isLg ? 260 : 230, // proportional height for 5 across
      }}
      className="hover:shadow-lg hover:-translate-y-1"
    >
      <Card.Section>
        <Image src={news.image} alt={news.title} h={imageHeight} fit="cover" />
      </Card.Section>

      <Stack p={padding} gap={6} style={{ flex: 1 }} bg="#f5f5f5">
        <Link href={`/news/${news.id}`} className="group">
          <Title
            order={4}
            size={titleSize}
            fw={600}
            lh={1.3}
            className="text-zinc-900 transition-colors group-hover:text-blue-600 underline-offset-2 hover:underline"
          >
            {news.title}
          </Title>
        </Link>

        <Text c="#999" fw={400} size={textSize} lineClamp={2} lh={1.5}>
          {news.brief}
        </Text>
      </Stack>
    </Card>
  );
};

export default NewsCard;
