'use client';

import {
  Button,
  Grid,
  Stack,
  Text,
  Title,
  Image,
  BackgroundImage,
  Flex,
  Box,
  Center,
} from '@mantine/core';

const HeroSection = () => {
  return (
    <>
      <Center bg="blue" py={5}>
        <Text c="white" mr={10} fw={500}>
          Special Congressional App Challenge events
        </Text>
        <Button variant="filled" color="fresh-green">
          Learn More
        </Button>
      </Center>
      <Box>
        {/*Desktop view - Above 1120 px*/}
        <Grid visibleFrom="smmd">
          {/*Text Section - Left*/}
          <Grid.Col span={5}>
            <Stack h="100%" justify="center" pl="5rem">
              <Title size="2.78rem" c="blue">
                Join Fun Creative Adventures
              </Title>
              <Title size="2.02rem" c="blue">
                Coding Classes for Kids
              </Title>
              <Text fw={500}>
                Learn coding, AI, robotics, and more with live online
                small-group classes led by expert instructors.
              </Text>
              <Button w="fit-content">Book Free Coding Classes</Button>
            </Stack>
          </Grid.Col>

          {/*Image Section - Right*/}
          <Grid.Col span={7}>
            <Image
              src="/images/coding-kids-hero.png"
              alt="Kids learning coding"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 30% 100%)',
              }}
            />
          </Grid.Col>
        </Grid>

        {/*Mobile/Tablet view - Below 1120px*/}
        <BackgroundImage
          src="/images/coding-kids-hero.png"
          hiddenFrom="smmd"
          h={540}
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
              <Title size="2.78rem" ta="center" c="blue">
                Join Fun Creative Adventures
              </Title>
              <Title size="2.02rem" ta="center" c="blue">
                Coding Classes for Kids
              </Title>
              <Text c="white" ta="center" size="lg">
                Learn coding, AI, robotics, and more with live online
                small-group classes led by expert instructors.
              </Text>
              <Button size="sm">Book Free Coding Classes</Button>
            </Stack>
          </Flex>
        </BackgroundImage>
      </Box>
    </>
  );
};

export default HeroSection;
