'use client';
import { ClassCardTypeProps } from '@/types/classCardType.types';
import { Flex, Stack, Text } from '@mantine/core';
import GradientBox from '@/components/gradient-box/GradientBox';
import ClassCard from '@/components/class-card/ClassCard';

// Constants
const FREE_CLASSES_BUTTON_TEXT = 'Earn Free';
const CONTAINER_MAX_WIDTH = 1152;
const SECTION_PADDING = 48;
const CONTENT_GAP = 40;
const CARDS_GAP = 20;
const SMALL_CARDS_GAP = 8;
const TEXT_SECTION_PADDING_RIGHT = 40;
const CARD_GAP_ADJUSTMENT = 10;
const GRID_GAP_ADJUSTMENT = 15;
const SMALL_GRID_GAP_ADJUSTMENT = 4;

const TITLE_FONT_SIZES = { base: '2.57rem', sm: '2.78rem', lg: '2.99rem' };
const DESCRIPTION_FONT_SIZE = '1.25rem';

const FREE_CLASSES_LIST: ClassCardTypeProps[] = [
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
    <GradientBox py={SECTION_PADDING}>
      <Stack maw={CONTAINER_MAX_WIDTH} w="100%" gap={CONTENT_GAP}>
        {/* First Row: Text + First 2 Cards (lg+) OR Just Text (smaller screens) */}
        <Flex direction={{ base: 'column', lg: 'row' }} gap={CARDS_GAP}>
          {/* Text Section */}
          <Flex
            flex={1}
            direction="column"
            justify="center"
            pr={{ lg: TEXT_SECTION_PADDING_RIGHT }}
          >
            <Text c="white" fz={TITLE_FONT_SIZES}>
              Start With
            </Text>
            <Text c="white" fz={TITLE_FONT_SIZES}>
              Free Classes
            </Text>
            <Text c="white" fz={DESCRIPTION_FONT_SIZE}>
              Join a free coding class to experience the magic! Learn in a small
              group with experienced instructors and have fun! Students new to
              coding should start with a Scratch class
            </Text>
          </Flex>
          {/* First 2 Cards - Only visible on lg+ screens */}
          <Flex
            flex={1}
            wrap="wrap"
            gap={CARDS_GAP}
            justify="center"
            display={{ base: 'none', lg: 'flex' }}
          >
            {FREE_CLASSES_LIST.slice(0, 2).map((freeClass) => (
              <Flex
                key={freeClass.title}
                w={`calc(50% - ${CARD_GAP_ADJUSTMENT}px)`}
                justify="center"
              >
                <ClassCard classItem={freeClass} />
              </Flex>
            ))}
          </Flex>
        </Flex>
        {/* Cards Section for smaller screens OR remaining 4 cards for large screens */}
        <Flex
          wrap="wrap"
          columnGap={{ base: SMALL_CARDS_GAP, lg: CARDS_GAP }}
          rowGap={{ base: CARDS_GAP, lg: CARDS_GAP }}
          justify="center"
        >
          {/* On large screens: show last 4 cards */}
          {/* On smaller screens: show all 6 cards, 2 per row */}
          {FREE_CLASSES_LIST.slice(0, 6) // All 6 cards for small screens
            .map((freeClass, index) => (
              <Flex
                key={freeClass.title}
                w={{
                  base: `calc(50% - ${SMALL_GRID_GAP_ADJUSTMENT}px)`,
                  lg: `calc(25% - ${GRID_GAP_ADJUSTMENT}px)`,
                }}
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
