import React from 'react';
import { Stack, Text, Paper, Image, Flex, Title } from '@mantine/core';
import GradientBox from '@/app/components/gradient-box/GradientBox';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Paper shadow="xs" w={{ base: '80%', xssm: 252 }} h={276}>
      <Flex pos="relative" p={20} justify="center" align="center">
        <Flex
          pos="absolute"
          top="-48px"
          bg="white"
          w={96}
          h={96}
          bdrs="50%"
          align="center"
          justify="center"
        >
          <Image src={icon} alt={title} w={86} />
        </Flex>
        <Stack align="center" gap="xs" py={48} justify="center">
          <Title
            c="fresh-blue"
            fz={{ base: '1.3rem', sm: '1.3rem', md: '1.49rem', xl: '1.49rem' }}
            ta="center"
          >
            {title}
          </Title>
          <Text fz="0.875rem" fw={500} ta="center">
            {description}
          </Text>
        </Stack>
      </Flex>
    </Paper>
  );
};

const AwardWinningEducationCard: React.FC = () => {
  const cardDataList = [
    {
      icon: '/images/react-icon.webp',
      title: 'Award-Winning Education',
      description:
        'Featured by Minecraft Education, Code.org, Meta, Roblox Education, ActivityHero, and more.',
    },
    {
      icon: '/images/people-icon.webp',
      title: 'Very Small Group Classes',
      description:
        'Enjoy personalized attention from your teacher with just 3-5 students per class.',
    },
    {
      icon: '/images/ideal-icon.webp',
      title: 'Expert Teachers',
      description:
        'Less than 5% of teacher candidates are selected as instructors, and our state-of-the-art technology ensures on-going quality.',
    },
    {
      icon: '/images/award-icon.webp',
      title: '100% Satisfaction Guarantee',
      description:
        'Have fun learning computer science. Find the perfect class, or get a full refund.',
    },
  ];

  return (
    <GradientBox pt={100} pb={62}>
      <Flex
        wrap="wrap"
        justify="center"
        columnGap={{ base: 60, sm: 30 }}
        rowGap={60}
      >
        {cardDataList.map((cardData) => (
          <FeatureCard
            key={cardData.icon}
            icon={cardData.icon}
            title={cardData.title}
            description={cardData.description}
          />
        ))}
      </Flex>
    </GradientBox>
  );
};

export default AwardWinningEducationCard;
