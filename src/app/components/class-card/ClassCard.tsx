'use client';
import { Button, Card, Flex, Image, Stack, Text } from '@mantine/core';
import React from 'react';
import { ClassItem } from '@/app/types/class.types';

interface ClassCardProps {
  classItem: ClassItem;
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
                <Image src={classItem.imageUrl} alt={classItem.title} height={165} />
      </Card.Section>

      <Flex justify="space-between" direction="column" h="100%">
        <Stack gap={2}>
          <Text fz="1.25rem" fw={500}>
            {classItem.title}
          </Text>
          <Text fz="1rem" c="rgba(0,0,0,0.6)" fw={500}>
            {classItem.grade}
          </Text>
          <Text mt={5}>{classItem.description}</Text>
        </Stack>

        <Button color="fresh-green" fullWidth radius="md">
          Learn more
        </Button>
      </Flex>
    </Card>
  );
};

export default ClassCard;
