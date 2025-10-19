'use client';

import {
  Box,
  BackgroundImage,
  Flex,
  Stack,
  Title,
  Text,
  Image,
} from '@mantine/core';
import styles from './classHeaderPage.module.css';

interface ClassHeaderPageProps {
  image: string;
  title: string;
  description: string;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
}

const ClassHeaderPage: React.FC<ClassHeaderPageProps> = ({
  image,
  title,
  description,
  desktopOnly,
  mobileOnly,
}) => {
  if (mobileOnly) {
    return (
      <BackgroundImage src={image} hiddenFrom="smmd" h={360} pos="relative">
        <Box pos="absolute" inset={0} bg="rgba(0,0,0,0.5)" />
        <Flex
          pos="absolute"
          inset={0}
          bg="rgba(0, 0, 0, 0.4)"
          align="center"
          justify="center"
          px={20}
        >
          <Stack align="center" gap="sm" className={styles.coverTitle}>
            <Title ta="center" order={1}>
              {title}
            </Title>
            <Text c="white" ta="center" size="lg">
              {description}
            </Text>
          </Stack>
        </Flex>
      </BackgroundImage>
    );
  }

  return (
    <Box
      className={styles.container}
      visibleFrom={desktopOnly ? 'smmd' : undefined}
    >
      <Box className={styles.coverBanner}>
        <Box className={styles.siteCover}>
          <Image src={image} alt={title} className={styles.coverImg} />
          <Box className={styles.coverTitle}>
            <h1>{title}</h1>
            <h2>{description}</h2>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClassHeaderPage;