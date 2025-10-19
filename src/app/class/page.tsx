'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Container,
  Skeleton,
  Stack,
  Box,
  BackgroundImage,
  Text,
  Title,
  Flex,
  Image,
  SimpleGrid,
  Pagination,
  Center,
  Card,
} from '@mantine/core';
import { useSearchParams, useRouter } from 'next/navigation';
import { useClassesPublicQuery } from '@/hooks/useClassPublicQuery';
import { useSubjectQuery } from '@/hooks';
import ClassCardWrapper from '@/components/class-card/ClassCardWrapper';

const DeskTopSection = ({ subjectName }: { subjectName?: string }) => {
  return (
    <Box
      visibleFrom="smmd"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <Box style={{ position: 'relative', height: '400px' }}>
        <Image
          src="/images/coding-kids-hero.png"
          alt="Classes Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack align="center" gap="md">
            <Title size="3rem" c="white" ta="center">
              {subjectName ? `${subjectName} Classes` : 'All Classes'}
            </Title>
            <Text c="white" size="xl" ta="center">
              Discover and learn with our curated courses
            </Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

const MobileSection = ({ subjectName }: { subjectName?: string }) => {
  return (
    <BackgroundImage
      src="/images/coding-kids-hero.png"
      hiddenFrom="smmd"
      h={360}
      pos="relative"
    >
      <Box pos="absolute" inset={0} bg="rgba(0,0,0,0.5)" />
      <Flex
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.4)"
        align="center"
        justify="center"
        px={20}
      >
        <Stack align="center" gap="sm">
          <Title size="2.5rem" ta="center" c="white">
            {subjectName ? `${subjectName}` : 'All Classes'}
          </Title>
          <Title size="1.5rem" ta="center" c="white">
            Classes
          </Title>
          <Text c="white" ta="center" size="lg">
            Discover and learn with our curated courses
          </Text>
        </Stack>
      </Flex>
    </BackgroundImage>
  );
};

const LoadingSkeleton = () => (
  <Card
    w={{ base: '70%', xssm: 264 }}
    h={397}
    shadow="md"
    radius="md"
    withBorder
  >
    <Stack gap="sm" h="100%">
      <Skeleton height={165} radius="md" />
      <Skeleton height={24} radius="sm" />
      <Skeleton height={60} radius="sm" />
      <Skeleton height={36} radius="md" mt="auto" />
    </Stack>
  </Card>
);

const AllClasses = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const gradeId = searchParams.get('gradeId');
  const type = searchParams.get('type') || undefined;
  const pageParam = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1
  );

  const {
    data: response,
    isLoading,
    error,
  } = useClassesPublicQuery({
    subjectId: subjectId ? parseInt(subjectId) : undefined,
    gradeId: gradeId ? parseInt(gradeId) : undefined,
    type,
    page: currentPage - 1, // API uses 0-based indexing
    size: 12,
  });

  // Get subject data using the hook
  const { subjects } = useSubjectQuery({
    page: 0,
    pageSize: 100,
  });

  // Find the subject name based on subjectId
  const subjectName = subjects.find(
    (s) => s.id === parseInt(subjectId || '0')
  )?.name;

  // Update page when URL changes
  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    } else {
      setCurrentPage(1);
    }
  }, [pageParam]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/classes?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Container fluid px={0}>
        <DeskTopSection subjectName={subjectName} />
        <MobileSection subjectName={subjectName} />
        <Container
          size="xl"
          px={{ base: 'md', sm: 'lg', lg: 'xl' }}
          mt={56}
          mb={100}
        >
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: 'lg', sm: 'xl', lg: 32 }}
            verticalSpacing={{ base: 'xl', sm: 40, lg: 56 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Center key={i}>
                <LoadingSkeleton />
              </Center>
            ))}
          </SimpleGrid>
        </Container>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid px={0}>
        <DeskTopSection subjectName={subjectName} />
        <MobileSection subjectName={subjectName} />
        <Container size="xl" mt={56} mb={100}>
          <Alert variant="light" color="red">
            An error occurred while fetching classes
          </Alert>
        </Container>
      </Container>
    );
  }

  const classes = response?.data.data || [];
  const totalPages = response?.data.totalPages || 0;

  return (
    <Container fluid px={0}>
      <DeskTopSection subjectName={subjectName} />
      <MobileSection subjectName={subjectName} />

      <Container
        size="xl"
        px={{ base: 'md', sm: 'lg', lg: 'xl' }}
        mt={56}
        mb={{ base: 56, sm: 80, lg: 100 }}
      >
        {classes.length === 0 ? (
          <Center py={60}>
            <Stack align="center" gap="md">
              <Title order={3} c="dimmed">
                No classes found
              </Title>
              <Text c="dimmed">
                Try selecting a different subject or filter
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={{ base: 'lg', sm: 'xl', lg: 32 }}
              verticalSpacing={{ base: 'xl', sm: 40, lg: 56 }}
            >
              {classes.map((classItem) => (
                <Center key={classItem.id}>
                  <ClassCardWrapper classItem={classItem} />
                </Center>
              ))}
            </SimpleGrid>

            {totalPages > 1 && (
              <Center mt={56}>
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={handlePageChange}
                  size="lg"
                  radius="md"
                />
              </Center>
            )}
          </>
        )}
      </Container>
    </Container>
  );
};

export default AllClasses;
