'use client';

import { Flex, Stack, Text } from '@mantine/core';
import ClassCard from '../../class-card/ClassCard';
import { ClassCardTypeProps } from '@/types/ClassCardProps.types';

const POPULAR_CLASSES_BUTTON_TEXT = 'Learn More';
const popularClassesList: ClassCardTypeProps[] = [
  {
    imageUrl: 'https://picsum.photos/400/200?random=1',
    title: 'Scratch Ninja',
    grade: 'Grades 2-6',
    description:
      'Code games and animations with Scratch coding, beginner to advanced levels',
    titleButton: POPULAR_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=2',
    title: 'Minecraft Modding Quest',
    grade: 'Grades 3-6',
    description:
      'Solve puzzles, build, and create games with fun coding in Minecraft',
    titleButton: POPULAR_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=3',
    title: 'Beginner Roblox Game Coding',
    grade: 'Grades 4-9',
    description: 'Best class to start learning Roblox game making',
    titleButton: POPULAR_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=4',
    title: 'Python for AI',
    grade: 'Grades 5-12',
    description: 'Learn a real-world programming language, with a focus on AI',
    titleButton: POPULAR_CLASSES_BUTTON_TEXT,
  },
];

const PopularClassSection = () => {
  return (
    <Stack py={48}>
      <Text
        fz={{ base: '2.99rem', sm: '2.57rem', md: '2.78rem', lg: '2.99rem' }}
        ta="center"
        c="fresh-blue"
      >
        Popular Coding Classes For Kids
      </Text>
      <Flex w="100%" wrap="wrap" justify="center" gap={40}>
        {popularClassesList.map((classItem) => (
          <ClassCard key={classItem.title} classItem={classItem} />
        ))}
      </Flex>
    </Stack>
  );
};

export default PopularClassSection;
