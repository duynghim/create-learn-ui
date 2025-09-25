import { Image, Flex, Paper, Text } from '@mantine/core';
import GradientBox from '@/app/components/gradient-box/GradientBox';

const FindBestClassSection = () => {
  return (
    <GradientBox direction="column" py={48} intensity="light">
      <Text
        fz={{ base: '2.57rem', md: '2.7rem', lg: '2.99rem' }}
        ta="center"
        fw={500}
      >
        Find the Best Classes for Your Child
      </Text>
      <Text ta="center" fw={400} fz="1rem">
        Tell us about your child&#39;s learning experience and interests to
        receive personalized class recommendations
      </Text>
      <Paper maw={1152} w={1152} p={32} mt={40}>
        <Flex align="center" justify="flex-start" gap={20}>
          <Image
            src="https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/Class_Recommendation_Widge_3321183a76.png?width=640"
            alt="Form Image"
            w={254}
          />
        </Flex>
      </Paper>
    </GradientBox>
  );
};

export default FindBestClassSection;
