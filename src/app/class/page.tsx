'use client';

import {
  Alert,
  Container,
  Text,
  Flex,
  Center,
} from '@mantine/core';
import { useState } from 'react';
import { useClassPublicQuery } from '@/hooks';
import { ClassCardWrapper, ClassHeaderPage, PaginationBar, CardLoadingSkeleton } from '@/components';

const PAGE_SIZE = 10;

const AllClasses = () => {
  const [page, setPage] = useState(0);

  const { classes, totalPages, isLoading, error } = useClassPublicQuery({
    page,
    size: PAGE_SIZE,
  });

  if (isLoading) {
    return (
      <Center>
        <CardLoadingSkeleton />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Alert color="red" title="Error" variant="light">
          <Text>Something wrong, please try again?</Text>
        </Alert>
      </Center>
    );
  }

  return (
    <Container fluid>
      <ClassHeaderPage
        image="/images/class-kid.webp"
        title="Join fun kids computer classes!"
        description="Enjoy small-group kids' classes, led by engaging teachers and designed by Google, MIT, and Stanford experts."
        desktopOnly
      />

      <ClassHeaderPage
        image="/images/class-kid.webp"
        title="Join fun kids computer classes!"
        description="Enjoy small-group kids' classes, led by engaging teachers and designed by Google, MIT, and Stanford experts."
        mobileOnly
      />
      
      <Center my={56}>
        <Flex wrap="wrap" gap={56} maw={1200} justify="center">
          {classes.map((classItem) => (
            <ClassCardWrapper classItem={classItem} key={classItem.id} />
          ))}
        </Flex>
      </Center>

      <PaginationBar
        totalPages={totalPages}
        pageZeroBased={page}
        onChangeZeroBased={setPage}
      />
    </Container>
  );
};

export default AllClasses;
