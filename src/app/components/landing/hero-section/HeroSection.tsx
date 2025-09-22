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
import CodeIcon from '@/app/components/icons/CodeIcon';
import MITIcon from '@/app/components/icons/MITIcon';
import HarvardIcon from '@/app/components/icons/HarvardIcon';
import StandfordIcon from '@/app/components/icons/StanfordIcon';
import AppleIcon from '@/app/components/icons/AppleIcon';
import GoogleIcon from '@/app/components/icons/GoogleIcon';
import styles from './HeroSection.module.css';
import GradientBox from '@/app/components/gradient-box/GradientBox';

const HeroSection = () => {
  return (
    <>
      <GradientBox py={5}>
        <Text c="white" mr={10} fw={500}>
          Special Congressional App Challenge events
        </Text>
        <Button variant="filled" color="fresh-green">
          Learn More
        </Button>
      </GradientBox>

      <Box>
        {/*Desktop view - Above 1120 px*/}
        <Grid visibleFrom="smmd">
          {/*Text Section - Left*/}
          <Grid.Col span={5}>
            <Stack
              h="100%"
              justify="center"
              pl={{
                base: '5rem',
                xxl: '20rem',
                xl: '25rem',
              }}
            >
              <Title
                fz={{ sm: '2.57rem', md: '2.78rem', xl: '2.99rem' }}
                c="fresh-blue"
              >
                Join Fun Creative Adventures
              </Title>
              <Title
                size="2.02rem"
                fz={{ sm: '1.8rem', md: '2.02rem', xl: '2.02rem' }}
                c="fresh-blue"
              >
                Coding Classes for Kids
              </Title>
              <Text fw={500}>
                Learn coding, AI, robotics, and more with live online
                small-group classes led by expert instructors.
              </Text>
              <Button w="fit-content" color="fresh-blue">
                Book Free Coding Classes
              </Button>
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
              h={540}
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
              <Title size="2.78rem" ta="center" c="fresh-blue">
                Join Fun Creative Adventures
              </Title>
              <Title size="2.02rem" ta="center" c="fresh-blue">
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

      {/*Design by experts from section desktop view*/}
      <Center py={20} visibleFrom="smmd">
        <Box pb={6} px={20}>
          <Text fw={400} c="rgba(0, 0, 0, 0.6)">
            Designed by experts from:
          </Text>
        </Box>
        <Flex align="center" gap="xs">
          <GoogleIcon height="36px" />
          <AppleIcon height="46px" />
          <StandfordIcon height="36px" />
          <HarvardIcon height="36px" />
          <MITIcon height="36px" />
          <CodeIcon height="36px" />
        </Flex>
      </Center>

      {/*Design by experts from section mobile view*/}
      <Stack align="center" gap="xs" py={20} hiddenFrom="smmd">
        <Center>
          <Text fw={400} c="rgba(0, 0, 0, 0.6)">
            Designed by experts from:
          </Text>
        </Center>
        <Flex align="center" gap="xs">
          <GoogleIcon className={styles.iconResponsive} />
          <AppleIcon className={styles.iconApple} />
          <StandfordIcon className={styles.iconResponsive} />
          <HarvardIcon className={styles.iconResponsive} />
          <MITIcon className={styles.iconResponsive} />
          <CodeIcon className={styles.iconResponsive} />
        </Flex>
      </Stack>
    </>
  );
};

export default HeroSection;
