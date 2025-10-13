// src/components/landing/popular-subject-section/PopularSubjectSection.tsx
'use client';

import React from 'react';
import { Flex, Text, Image, Container, Center, Loader } from '@mantine/core';
import { useSubjectQuery } from '@/hooks';
import type { Subject } from '@/types';

interface PopularSubjectCardProps {
  id: string | number;
  name: string;
  imageSrc: string;
  description?: string;
}

const placeholderIcon = 'https://via.placeholder.com/96x96.png?text=Subject';

const toCardProps = (s: Subject): PopularSubjectCardProps => ({
  id: s.id,
  name: s.name,
  imageSrc: s.iconBase64
    ? `data:image/png;base64,${s.iconBase64}`
    : placeholderIcon,
  description: s.description,
});

const PopularSubjectCard: React.FC<PopularSubjectCardProps> = ({
  name,
  imageSrc,
}) => (
  <Flex w={294} h={96} align="center" gap={20}>
    <Image w={96} h={96} src={imageSrc} alt={name} radius="md" />
    <Text fw="bold" c="#0000EE">
      {name}
    </Text>
  </Flex>
);

const PopularSubjectSection: React.FC = () => {
  const { subjects, isLoading, error } = useSubjectQuery({
    page: 0,
    pageSize: 100,
  });

  const cards = (subjects ?? []).map(toCardProps);

  return (
    <Container fluid py={48}>
      <Container maw={976}>
        <Text fz={{ base: '1.82rem', md: '2.25rem' }} ta="center">
          Popular Subjects for Kids&apos; Coding Classes
        </Text>
        <Text fz="1rem" fw={400} c="rgba(0, 0, 0, 0.6)" ta="center">
          Explore a variety of engaging computer science subjects designed to
          spark learners&apos; interests in technology.
        </Text>
      </Container>
      <Center mt={48}>
        {isLoading && <Loader />}
        {!isLoading && error && <Text c="red">Failed to load subjects.</Text>}
        {!isLoading && !error && (
          <Flex wrap="wrap" gap={30} maw={1352} justify="center">
            {cards.map((card) => (
              <PopularSubjectCard key={card.id} {...card} />
            ))}
          </Flex>
        )}
      </Center>
    </Container>
  );
};

export default PopularSubjectSection;
