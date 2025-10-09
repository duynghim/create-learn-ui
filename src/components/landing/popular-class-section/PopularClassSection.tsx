'use client';

import { Flex, Stack, Text } from '@mantine/core';
import ClassCard from '../../class-card/ClassCard';
import { useClassQuery } from '@/hooks';

const POPULAR_CLASSES_BUTTON_TEXT = 'Learn More';
const MAX_ITEMS = 4;

const PopularClassSection = () => {
  const { classes } = useClassQuery({ page: 0, pageSize: 100 });

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
        {classes.slice(0, MAX_ITEMS).map((classItem) => (
          <ClassCard
            key={classItem.id}
            imageUrl={classItem.image}
            title={classItem.brief}
            grade={classItem.grades?.map((g) => g.name).join(', ') || ''}
            description={classItem.description}
            titleButton={POPULAR_CLASSES_BUTTON_TEXT}
          />
        ))}
      </Flex>
    </Stack>
  );
};

export default PopularClassSection;
