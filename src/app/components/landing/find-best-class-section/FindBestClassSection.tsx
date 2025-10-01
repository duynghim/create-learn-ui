import {
  Image,
  Flex,
  Paper,
  Text,
  Stack,
  Select,
  MultiSelect,
  Button,
  Badge,
  Grid,
  Divider,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import GradientBox from '@/app/components/gradient-box/GradientBox';
import classes from './FindBestClassSection.module.css';

interface ClassCardTypeProps {
  imageUrl: string;
  title: string;
  grade: string;
  description: string;
  titleButton: string;
}

interface FormValues {
  gradeLevel: string;
  fiftyPlusHours: string;
  twentyToFiftyHours: string;
  fiveToTwentyHours: string;
  areasOfInterest: string[];
}

// Extracted constants
const GRADE_LEVEL_OPTIONS = ['React', 'Angular', 'Vue', 'Svelte'];
const EXPERIENCE_OPTIONS = ['React', 'Angular', 'Vue', 'Svelte'];
const INTEREST_OPTIONS = ['React', 'Angular', 'Vue', 'Svelte'];

const FORM_INITIAL_VALUES: FormValues = {
  gradeLevel: '',
  fiftyPlusHours: '',
  twentyToFiftyHours: '',
  fiveToTwentyHours: '',
  areasOfInterest: [],
};

const FORM_VALIDATION = {
  gradeLevel: (value: string) => (!value ? 'Grade level is required' : null),
};

// Extracted mock data function
const getMockRecommendedClasses = async (): Promise<ClassCardTypeProps[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return [
    {
      imageUrl: 'https://via.placeholder.com/300x200',
      title: 'Introduction to React for Beginners',
      grade: 'Grades 6-8',
      description:
        'Learn the fundamentals of React.js and build your first interactive web application. Perfect for students new to programming.',
      titleButton: 'Enroll Now',
    },
    {
      imageUrl: 'https://via.placeholder.com/300x200',
      title: 'Advanced JavaScript Programming',
      grade: 'Grades 9-12',
      description:
        'Master advanced JavaScript concepts including async/await, closures, and modern ES6+ features for web development.',
      titleButton: 'Start Learning',
    },
    {
      imageUrl: 'https://via.placeholder.com/300x200',
      title: 'Web Design with HTML & CSS',
      grade: 'Grades 5-7',
      description:
        'Create beautiful and responsive websites using HTML and CSS. Learn design principles and modern web development practices.',
      titleButton: 'Join Class',
    },
  ];
};

const RecommendedClassesList = ({
  classes,
}: {
  classes: ClassCardTypeProps[];
}) => {
  if (classes.length === 0) return null;

  return (
    <Container fluid mt={24}>
      <Text fz="1.25rem" fw={500}>
        Here are the classes recommended based on your selection of interests
        and experiences
      </Text>
      <Stack gap={24} mt={16}>
        {classes.map((classItem) => (
          <div key={classItem.title}>
            <Grid>
              <Grid.Col span={2}>
                <Text
                  fw={700}
                  className="cursor-pointer"
                  fz="0.875rem"
                  c="#0288d1"
                >
                  {classItem.title}
                </Text>
              </Grid.Col>
              <Grid.Col span={2}>
                <Badge variant="light" fw={400}>
                  {classItem.grade}
                </Badge>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text fw={400} c="gray.6" fz="0.875rem" ta="left">
                  {classItem.description}
                </Text>
              </Grid.Col>
            </Grid>
            <Divider />
          </div>
        ))}
      </Stack>
    </Container>
  );
};

const FindBestClassSection = () => {
  const [recommendedClasses, setRecommendedClasses] = useState<
    ClassCardTypeProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: FORM_INITIAL_VALUES,
    validate: FORM_VALIDATION,
  });

  const handleSubmit = async (values: FormValues) => {
    console.log('Form submitted:', values);
    setIsLoading(true);
    try {
      const classes = await getMockRecommendedClasses();
      setRecommendedClasses(classes);
    } catch (error) {
      console.error('Error fetching recommended classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectProps = {
    classNames: { input: classes.input },
    comboboxProps: {
      transitionProps: { transition: 'pop' as const, duration: 200 },
    },
  };

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
      <Paper
        maw={1152}
        w={{ base: '95%', xssm: '80%', lg: 1152 }}
        p={32}
        mt={40}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex
            align="center"
            gap={{ base: 20, sm: 50 }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Image
              src="https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/Class_Recommendation_Widge_3321183a76.png?width=640"
              alt="Form Image"
              w={254}
            />
            <Stack gap={16}>
              <Select
                {...selectProps}
                withAsterisk
                label="Student's Grade Level"
                data={GRADE_LEVEL_OPTIONS}
                {...form.getInputProps('gradeLevel')}
              />
              <Stack gap={0}>
                <Text fz="1rem" fw={700}>
                  Experiences
                </Text>
                <Text fz="0.875rem" fw={500} c="rgba(0, 0, 0, 0.6)">
                  Select topics your child has learned based on the time spent
                  on them
                </Text>
              </Stack>
              <Select
                {...selectProps}
                withAsterisk
                label="50+ Hours of Learning"
                data={EXPERIENCE_OPTIONS}
                {...form.getInputProps('fiftyPlusHours')}
              />
              <Select
                {...selectProps}
                label="20-50 Hours of Learning"
                data={EXPERIENCE_OPTIONS}
                {...form.getInputProps('twentyToFiftyHours')}
              />
              <Select
                {...selectProps}
                label="5-20 Hours of Learning"
                data={EXPERIENCE_OPTIONS}
                {...form.getInputProps('fiveToTwentyHours')}
              />
              <Text fz="1rem" fw={700}>
                Areas of Interest
              </Text>
              <Stack gap={0}>
                <MultiSelect
                  {...selectProps}
                  clearable
                  data={INTEREST_OPTIONS}
                  {...form.getInputProps('areasOfInterest')}
                />
                <Text fz="0.75rem" fw={400} c="rgba(0, 0, 0, 0.6)">
                  Select up to 3 subjects your child is interested in learning
                </Text>
              </Stack>
              <Button
                w={232}
                type="submit"
                disabled={!form.values.gradeLevel || isLoading}
                loading={isLoading}
              >
                Find Recommended Classes
              </Button>
            </Stack>
          </Flex>
        </form>
        {!isLoading && <RecommendedClassesList classes={recommendedClasses} />}
      </Paper>
    </GradientBox>
  );
};

export default FindBestClassSection;
