'use client';

import React from 'react';

import { Flex, Text, Image, Container, Center } from '@mantine/core';

interface PopularSubjectCardProps {
  imageUrl: string;
  title: string;
}

const subjectList: PopularSubjectCardProps[] = [
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/scratch2_6adf695b91.png',
    title: 'Scratch Coding',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/AI_2_a6e3ff1265.png',
    title: 'Artificial Intelligence',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/minecraft2_947cbd10a3.png',
    title: 'Minecraft Coding',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/python928_5b98524321.png',
    title: 'Python',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/roblox2_ee3d2fcc4f.png',
    title: 'Roblox Coding',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/robotics2_063216cb89.png',
    title: 'Robotics',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/mobile928_ab7646bb56.png',
    title: 'Mobile Games & Apps',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/game928_584c22577e.png',
    title: 'Game Development',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/design928_a96139f1d0.png',
    title: 'Digital Design',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/java2_56a5e41c32.png',
    title: 'AP CS Exams',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/datascience928_2f3b04abff.png',
    title: 'Data Science',
  },
  {
    imageUrl:
      'https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/web2_9f689b9da7.png',
    title: 'Web Development',
  },
];

const PopularSubjectCard: React.FC<PopularSubjectCardProps> = ({
  imageUrl,
  title,
}) => {
  return (
    <Flex w={294} h={96} align="center" gap={20}>
      <Image w={96} src={imageUrl} alt={title} />

      <Text fw="bold" c="#0000EE">
        {title}
      </Text>
    </Flex>
  );
};

const PopularSubjectSection = () => {
  return (
    <Container fluid py={48}>
      <Container maw={976}>
        <Text fz={{ base: '1.82rem', md: '2.25rem' }} ta="center">
          Popular Subjects for Kids&apos; Coding Classes
        </Text>
        <Text fz="1rem" fw={400} c="rgba(0, 0, 0, 0.6)" ta="center">
          Explore a variety of engaging computer science subjects designed to
          spark learners&apos; interests in technology. Each subject includes
          multiple courses that form a learning pathway, progressing from
          introductory to advanced content while enhancing understanding of
          real-world applications.
        </Text>
      </Container>
      <Center  mt={48}>
        <Flex wrap="wrap" gap={30} maw={1352} justify="center">
          {subjectList.map((subject) => (
            <PopularSubjectCard key={subject.title} {...subject} />
          ))}
        </Flex>
      </Center>
    </Container>
  );
};

export default PopularSubjectSection;
