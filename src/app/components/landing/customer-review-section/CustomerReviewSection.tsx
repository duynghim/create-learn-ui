'use client';
import React from 'react';
import { Card, Text, Group, Rating, Blockquote } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import GradientBox from '@/app/components/gradient-box/GradientBox';

type ReviewCardProps = {
  review: string;
  rating: number; // 1-5
  name: string;
  date: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  rating,
  name,
  date,
}) => {
  return (
    <Card radius="md" w={272} h={213}>
      <Blockquote p={5}>
        <Text size="md" mb="sm" lineClamp={3}>
          {review}
        </Text>
      </Blockquote>
      <Rating value={rating} readOnly mb="sm" />

      <Group justify="space-between" mt="md">
        <Text fw={500} size="sm">
          {name}
        </Text>
        <Text size="xs" c="dimmed">
          {date}
        </Text>
      </Group>
    </Card>
  );
};

const REVIEW_DATA = [
  {
    review:
      'Excellent service! The team was professional and delivered exactly what we needed. Highly recommend!',
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
  return (
    <GradientBox py={48}>
      <Carousel
        withIndicators
        w="100%"
        slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
        slideGap={{ base: 0, sm: 'md' }}
        emblaOptions={{ loop: true, align: 'start' }}
      >
        {REVIEW_DATA.map((review) => (
          <Carousel.Slide key={review.name}>
            <ReviewCard
              review={review.review}
              rating={review.rating}
              name={review.name}
              date={review.date}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </GradientBox>
  );
};

export default CustomerReviewSection;
