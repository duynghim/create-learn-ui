'use client';

import {
  Alert,
  Center,
  Container,
  Flex,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import ClassCard from '../../class-card/ClassCard';
import { useClassQuery } from '@/hooks';

const POPULAR_CLASSES_BUTTON_TEXT = 'Learn More';
const MAX_ITEMS = 4;

const PopularClassSection = () => {
  const { classes, isLoading } = useClassQuery({ page: 0, pageSize: 100 });
  const router = useRouter();

  const handleClassClick = async (classId: string | number) => {
    router.push(`/class/${classId}`);
  };

  if (isLoading) {
    return (
      <Container fluid py={48}>
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }
  return (
    <Stack py={48}>
      <Text
        fz={{ base: '2.99rem', sm: '2.57rem', md: '2.78rem', lg: '2.99rem' }}
        ta="center"
        c="fresh-blue"
      >
        Popular Coding Classes For Kids
      </Text>
      {classes && classes.length > 0 ? (
        <Flex w="100%" wrap="wrap" justify="center" gap={40}>
          {classes.slice(0, MAX_ITEMS).map((classItem) => (
            <ClassCard
              key={classItem.id}
              imageUrl={classItem.image}
              title={classItem.brief}
              description={classItem.description}
              titleButton={POPULAR_CLASSES_BUTTON_TEXT}
              onButtonClick={() => handleClassClick(classItem.id)}
            />
          ))}
        </Flex>
      ) : (
        <Alert color="red" variant="light">
          <Text>No classes found. Please try again later.</Text>
        </Alert>
      )}
    </Stack>
  );
};

export default PopularClassSection;
