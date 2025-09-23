'use client';

import { ClassCardTypeProps } from '@/app/types/ClassCardProps.types';
import GradientBox from '@/app/components/gradient-box/GradientBox';
import { Flex, Stack, Text } from '@mantine/core';
import ClassCard from '@/app/components/class-card/ClassCard';

const FREE_CLASSES_BUTTON_TEXT = 'Earn Free';
const freeClassesList: ClassCardTypeProps[] = [
  {
    imageUrl: 'https://picsum.photos/400/200?random=1',
    title: 'Free Intro to Scratch Coding',
    grade: 'Grades 2-5',
    description:
      'Code games and animations with Scratch coding, beginner to advanced levels',
    titleButton: FREE_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=2',
    title: 'Minecraft Coding - The Show Must Go On',
    grade: 'Grades 2-7',
    description:
      'Solve puzzles, build, and create games with fun coding in Minecraft',
    titleButton: FREE_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=3',
    title: 'Accelerated Scratch - Intro to Coding for Teens',
    grade: 'Grades 5-10',
    description:
      'Fast-paced introduction to Scratch coding: build games, stories, and animations',
    titleButton: FREE_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=4',
    title: 'AI Explorers - Introduction',
    grade: 'Grades 4-9',
    description:
      'Discover how AI fuels self-driving cars, face recognition, and other advanced technologies',
    titleButton: FREE_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=5',
    title: 'Beginner Roblox Game Coding',
    grade: 'Grades 3-9',
    description: 'Best class to start learning Roblox game making',
    titleButton: FREE_CLASSES_BUTTON_TEXT,
  },
  {
    imageUrl: 'https://picsum.photos/400/200?random=6',
    title: 'Free Intro to Python Coding',
    grade: 'Grades 5-10',
    description: 'Learn a real-world programming language, with a focus on AI',
    titleButton: FREE_CLASSES_BUTTON_TEXT,
  },
];

const FreeClassesSection = () => {
  return (
    <GradientBox>
      <Stack maw={1152} w="100%" gap={40}>
        {/* First Row: Text + First 2 Cards (lg+) OR Just Text (smaller screens) */}
        <Flex direction={{ base: 'column', lg: 'row' }} gap={20}>
          {/* Text Section */}
          <Flex flex={1} direction="column" justify="center" pr={{ lg: 40 }}>
            <Text
              c="white"
              fz={{ base: '2.57rem', sm: '2.78rem', lg: '2.99rem' }}
            >
              Start With
            </Text>
            <Text
              c="white"
              fz={{ base: '2.57rem', sm: '2.78rem', lg: '2.99rem' }}
            >
              Free Classes
            </Text>
            <Text c="white" fz="1.25rem">
              Join a free coding class to experience the magic! Learn in a small
              group with experienced instructors and have fun! Students new to
              coding should start with a Scratch class
            </Text>
          </Flex>

          {/* First 2 Cards - Only visible on lg+ screens */}
          <Flex
            flex={1}
            wrap="wrap"
            gap={20}
            justify="center"
            display={{ base: 'none', lg: 'flex' }}
          >
            {freeClassesList.slice(0, 2).map((freeClass) => (
              <Flex key={freeClass.title} w="calc(50% - 10px)" justify="center">
                <ClassCard classItem={freeClass} />
              </Flex>
            ))}
          </Flex>
        </Flex>

        {/* Cards Section for smaller screens OR remaining 4 cards for large screens */}
        <Flex
          wrap="wrap"
          columnGap={{ base: 8, lg: 20 }}
          rowGap={{ base: 20, lg: 20 }}
          justify="center"
        >
          {/* On large screens: show last 4 cards */}
          {/* On smaller screens: show all 6 cards, 2 per row */}
          {freeClassesList
            .slice(0, 6) // All 6 cards for small screens
            .map((freeClass, index) => (
              <Flex
                key={freeClass.title}
                w={{ base: 'calc(50% - 4px)', lg: 'calc(25% - 15px)' }}
                justify="center"
                display={{
                  base: 'flex',
                  lg: index < 2 ? 'none' : 'flex', // Hide the first 2 on lg+ (already shown above)
                }}
              >
                <ClassCard classItem={freeClass} />
              </Flex>
            ))}
        </Flex>
      </Stack>
    </GradientBox>
  );
};

export default FreeClassesSection;
