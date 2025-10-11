'use client';
import { Button, Card, Flex, Image, Stack, Text } from '@mantine/core';
import React from 'react';

export interface ClassCardProps {
  imageUrl: string;
  title: string;
  grade: string;
  description: string;
  titleButton: string;
}

const ClassCard: React.FC<ClassCardProps> = ({
  imageUrl,
  title,
  grade,
  description,
  titleButton,
}) => {
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
        <Image src={imageUrl} alt={title} mah={165} height={165} radius="md" />
      </Card.Section>

      <Flex justify="space-between" direction="column" h="100%">
        <Stack gap={2}>
          <Text fz="1.25rem" fw={500}>
            {title}
          </Text>
          <Text lineClamp={3} mt={5}>
            {description}
          </Text>
        </Stack>

        <Button color="fresh-green" fullWidth radius="md">
          {titleButton}
        </Button>
      </Flex>
    </Card>
  );
};

export default ClassCard;
