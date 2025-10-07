'use client';

import React from 'react';
import {
  Stack,
  Text,
  Paper,
  Image,
  Flex,
  Title,
  Container,
} from '@mantine/core';
import GradientBox from '@/components/gradient-box/GradientBox';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FEATURE_CARDS_DATA = [
  {
    id: 'award-winning',
    icon: '/images/react-icon.webp',
    title: 'Award-Winning Education',
    description:
      'Featured by Minecraft Education, Code.org, Meta, Roblox Education, ActivityHero, and more.',
  },
  {
    id: 'small-groups',
    icon: '/images/people-icon.webp',
    title: 'Very Small Group Classes',
    description:
      'Enjoy personalized attention from your teacher with just 3-5 students per class.',
  },
  {
    id: 'expert-teachers',
    icon: '/images/ideal-icon.webp',
    title: 'Expert Teachers',
    description:
      'Less than 5% of teacher candidates are selected as instructors, and our state-of-the-art technology ensures on-going quality.',
  },
  {
    id: 'satisfaction-guarantee',
    icon: '/images/award-icon.webp',
    title: '100% Satisfaction Guarantee',
    description:
      'Have fun learning computer science. Find the perfect class, or get a full refund.',
  },
] as const;

const CARD_STYLES = {
  dimensions: { width: { base: '80%', xssm: 252 }, height: 276 },
  iconContainer: { width: 96, height: 96, iconSize: 86 },
  spacing: { iconOffset: -48, padding: 20, contentPadding: 48 },
  typography: {
    titleSize: { base: '1.3rem', sm: '1.3rem', md: '1.49rem', xl: '1.49rem' },
    descriptionSize: '0.875rem',
  },
} as const;

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Paper
      shadow="xs"
      w={CARD_STYLES.dimensions.width}
      h={CARD_STYLES.dimensions.height}
      radius="md"
    >
      <Flex
        pos="relative"
        p={CARD_STYLES.spacing.padding}
        justify="center"
        align="center"
        h="100%"
      >
        {/* Floating Icon Container */}
        <Flex
          pos="absolute"
          top={CARD_STYLES.spacing.iconOffset}
          bg="white"
          w={CARD_STYLES.iconContainer.width}
          h={CARD_STYLES.iconContainer.height}
          style={{ borderRadius: '50%' }}
          align="center"
          justify="center"
        >
          <Image
            src={icon}
            alt={`${title} icon`}
            w={CARD_STYLES.iconContainer.iconSize}
          />
        </Flex>

        {/* Card Content */}
        <Stack
          align="center"
          gap="xs"
          py={CARD_STYLES.spacing.contentPadding}
          justify="center"
        >
          <Title
            c="fresh-blue"
            fz={CARD_STYLES.typography.titleSize}
            ta="center"
            fw={600}
          >
            {title}
          </Title>
          <Text
            fz={CARD_STYLES.typography.descriptionSize}
            fw={500}
            ta="center"
            c="dimmed"
          >
            {description}
          </Text>
        </Stack>
      </Flex>
    </Paper>
  );
};

const FeatureCardSection: React.FC = () => {
  return (
    <GradientBox pt={100} pb={62}>
      <Container size="xl">
        <Flex
          wrap="wrap"
          justify="center"
          columnGap={{ base: 60, sm: 30 }}
          rowGap={60}
        >
          {FEATURE_CARDS_DATA.map((cardData) => (
            <FeatureCard
              key={cardData.id}
              icon={cardData.icon}
              title={cardData.title}
              description={cardData.description}
            />
          ))}
        </Flex>
      </Container>
    </GradientBox>
  );
};

export default FeatureCardSection;
