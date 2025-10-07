'use client';
import { Button, Card, Flex, Image, Stack, Text } from '@mantine/core';
import React from 'react';
import { ClassCardTypeProps } from '@/types/ClassCardProps.types';

interface ClassCardProps {
  classItem: ClassCardTypeProps;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem }) => {
  return (
    <Card
      w={{ base: '70%', xssm: 264 }}
      h={397}
      pb={8}
      shadow="md"
      radius="md"
      withBorder
    >
      <Card.Section p={5}>
        <Image
          src={classItem.imageUrl}
          alt={classItem.title}
          height={165}
          radius="md"
        />
      </Card.Section>

      <Flex justify="space-between" direction="column" h="100%">
        <Stack gap={2}>
          <Text fz="1.25rem" fw={500}>
            {classItem.title}
          </Text>
          <Text fz="1rem" c="rgba(0,0,0,0.6)" fw={500}>
            {classItem.grade}
          </Text>
          <Text lineClamp={3} mt={5}>
            {classItem.description}
          </Text>
        </Stack>

        <Button color="fresh-green" fullWidth radius="md">
          {classItem.titleButton}
        </Button>
      </Flex>
    </Card>
  );
};

export default ClassCard;
