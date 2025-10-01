'use client';

import React, { useMemo } from 'react';
import { Card, Text, Group, Rating, Stack } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import GradientBox from '@/app/components/gradient-box/GradientBox';
import { format } from 'date-fns';

import classes from './CustomerReviewSection.module.css';

type ReviewCardProps = {
  review: string;
  rating: number; // 1-5
  name: string;
  date: string;
};

const ReviewCard: React.FC<ReviewCardProps> = React.memo(
  ({ review, rating, name, date }) => {
    return (
      <Card radius="md" h={213} p="md">
        <Stack h="100%" justify="space-between">
          <Text fw={400} fz="1rem" lineClamp={4}>
            <Text
              component="span"
              fw={900}
              fz="1.2rem"
              style={{ lineHeight: 1 }}
            >
              &#34;
            </Text>
            {` ${review} `}
            <Text
              component="span"
              fw={900}
              fz="1.2rem"
              style={{ lineHeight: 1 }}
            >
              &#34;
            </Text>
          </Text>

          <Group justify="space-between" align="center">
            <Rating value={rating} readOnly />
            <Stack gap={0} align="flex-end">
              <Text fw={600} fz="0.8rem">
                - {name}
              </Text>
              <Text fw={600} fz="0.8rem">
                {format(new Date(date), 'yyyy-MMM-dd')}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Card>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';

const REVIEW_DATA = [
  {
    review:
      'Excellent service! The team was professional and delivered exactly what we needed',
    rating: 5,
    name: 'Sarah Johnson',
    date: '2024-01-15',
  },
  {
    review:
      'Great experience overall. Quick response time and quality work. Will definitely use again.',
    rating: 4,
    name: 'Michael Chen',
    date: '2024-01-12',
  },
  {
    review:
      'Outstanding quality and attention to detail. The project exceeded our expectations.',
    rating: 5,
    name: 'Emily Davis',
    date: '2024-01-10',
  },
  {
    review:
      'Good service but took a bit longer than expected. Results were satisfactory though.',
    rating: 3,
    name: 'Robert Wilson',
    date: '2024-01-08',
  },
  {
    review:
      'Amazing work! The team understood our requirements perfectly and delivered on time.',
    rating: 5,
    name: 'Lisa Martinez',
    date: '2024-01-05',
  },
  {
    review:
      'Professional and reliable. The communication throughout the process was excellent.',
    rating: 4,
    name: 'David Thompson',
    date: '2024-01-03',
  },
  {
    review:
      'Very impressed with the final product. Clean, efficient, and exactly what we asked for.',
    rating: 5,
    name: 'Jennifer Brown',
    date: '2023-12-28',
  },
  {
    review:
      'Solid work with room for improvement. The team was responsive to feedback.',
    rating: 3,
    name: 'Mark Anderson',
    date: '2023-12-25',
  },
  {
    review:
      'Fantastic collaboration! They went above and beyond to ensure our satisfaction.',
    rating: 5,
    name: 'Amanda Taylor',
    date: '2023-12-22',
  },
  {
    review: 'Great value for money. Professional service with timely delivery.',
    rating: 4,
    name: 'Christopher Lee',
    date: '2023-12-20',
  },
];

const CustomerReviewSection: React.FC = () => {
  const slides = useMemo(
    () =>
      REVIEW_DATA.map((review, index) => (
        <Carousel.Slide key={`${review.name}-${index}`}>
          <ReviewCard {...review} />
        </Carousel.Slide>
      )),
    []
  );

  return (
    <GradientBox py={48} direction="column">
      <Text
        fz={{ base: '1.82rem', sm: '2.03rem' }}
        fw={500}
        ta="center"
        c="white"
      >
        Trusted by 100,000+ Students and Parents Worldwide
      </Text>
      <Text fz="1rem" fw={400} ta="center" c="white" mb="2.5rem">
        Trusted by 100,000+ Students and Parents Worldwide
      </Text>
      <Carousel
        maw={{ base: '90%', sm: '70%', md: '90%', xl: '70%' }}
        withIndicators
        slideSize={{ base: '100%', sm: '50%', md: '33.333333%', xl: '25%' }}
        slideGap={{ base: 0, sm: 'md' }}
        emblaOptions={{ loop: true, align: 'start' }}
        classNames={{ control: classes.control }}
      >
        {slides}
      </Carousel>
    </GradientBox>
  );
};

export default CustomerReviewSection;
