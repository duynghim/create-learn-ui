'use client';

import React from 'react';
import { Flex, Text, Image } from '@mantine/core';

interface PopularSubjectCardProps {
  name: string;
  imageSrc?: string;
  width?: number;
  height?: number;
  imageSize?: number;
  gap?: number;
  id?: number;
  fontSize?: string | number;
}

const PopularSubjectCard: React.FC<PopularSubjectCardProps> = ({
  name,
  imageSrc,
  width = 294,
  height = 96,
  imageSize = 96,
  gap = 20,
  fontSize = 16,
  id,
}) => (
  <Flex w={width} h={height} align="center" gap={gap} id={id?.toString()}>
    <Image w={imageSize} h={imageSize} src={imageSrc} alt={name} radius="md" />
    <Text fw="bold" c="#0000EE" fz={fontSize}>
      {name}
    </Text>
  </Flex>
);

export default PopularSubjectCard;
