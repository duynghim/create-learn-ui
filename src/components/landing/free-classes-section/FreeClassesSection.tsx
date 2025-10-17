// `src/components/landing/free-classes-section/FreeClassesSection.tsx`
'use client';
import { Flex, Stack, Text } from '@mantine/core';
import GradientBox from '@/components/gradient-box/GradientBox';
import ClassCard from '@/components/class-card/ClassCard';
import { useEffect, useState } from 'react';
import type { Class } from '@/types';
import { classApiClient } from '@/api';
import { useClassQuery } from '@/hooks';
import { useRouter } from 'next/navigation';

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

const FreeClassesSection = () => {
  const { classes, isLoading } = useClassQuery({ page: 0, pageSize: 100 });
  const router = useRouter();

  const handleClassClick = async (classId: string | number) => {
    router.push(`/class/${classId}`);
  };

  return (
    <GradientBox py={SECTION_PADDING}>
      <Stack
        maw={CONTAINER_MAX_WIDTH}
        w="100%"
        gap={CONTENT_GAP}
        id="free-classes-section"
      >
        <Flex direction={{ base: 'column', lg: 'row' }} gap={CARDS_GAP}>
          <Flex
            flex={1}
            direction="column"
            justify="center"
            px={20}
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
          <Flex
            flex={1}
            wrap="wrap"
            gap={CARDS_GAP}
            justify="center"
            display={{ base: 'none', lg: 'flex' }}
          >
            {classes.slice(0, 2).map((freeClass) => (
              <Flex
                key={freeClass.id ?? freeClass.brief ?? freeClass.name}
                w={`calc(50% - ${CARD_GAP_ADJUSTMENT}px)`}
                justify="center"
              >
                <ClassCard
                  imageUrl={freeClass.image || 'https://picsum.photos/400/200'}
                  title={freeClass.brief || freeClass.name || 'Class'}
                  description={freeClass.brief || ''}
                  titleButton={FREE_CLASSES_BUTTON_TEXT}
                  onButtonClick={() => handleClassClick(freeClass.id)}
                />
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Flex
          wrap="wrap"
          columnGap={{ base: SMALL_CARDS_GAP, lg: CARDS_GAP }}
          rowGap={{ base: CARDS_GAP, lg: CARDS_GAP }}
          justify="center"
        >
          {classes.slice(0, 6).map((freeClass, index) => (
            <Flex
              key={
                (freeClass.id ?? freeClass.brief ?? freeClass.name) +
                '-' +
                index
              }
              w={{
                base: `calc(50% - ${SMALL_GRID_GAP_ADJUSTMENT}px)`,
                lg: `calc(25% - ${GRID_GAP_ADJUSTMENT}px)`,
              }}
              justify="center"
              display={{
                base: 'flex',
                lg: index < 2 ? 'none' : 'flex',
              }}
            >
              <ClassCard
                imageUrl={freeClass.image || 'https://picsum.photos/400/200'}
                title={freeClass.brief || freeClass.name || 'Class'}
                description={freeClass.brief || ''}
                titleButton={FREE_CLASSES_BUTTON_TEXT}
                onButtonClick={() => handleClassClick(freeClass.id)}
              />
            </Flex>
          ))}
        </Flex>
      </Stack>
    </GradientBox>
  );
};

export default FreeClassesSection;
