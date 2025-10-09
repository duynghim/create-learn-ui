import {
  Image,
  Flex,
  Paper,
  Text,
  Stack,
  TextInput,
  Textarea,
  Button,
  Badge,
  Grid,
  Divider,
  Container,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import GradientBox from '@/components/gradient-box/GradientBox';
import { useConsultationQuery } from '@/hooks';
import classes from './FindBestClassSection.module.css';

interface ClassCardTypeProps {
  imageUrl: string;
  title: string;
  grade: string;
  description: string;
  titleButton: string;
}

interface ConsultationFormValues {
  customerName: string;
  phoneNumber: string;
  email: string;
  content: string;
}

const FORM_INITIAL_VALUES: ConsultationFormValues = {
  customerName: '',
  phoneNumber: '',
  email: '',
  content: '',
};

const FORM_VALIDATION = {
  customerName: (value: string) => (value ? null : 'Customer name is required'),
  phoneNumber: (value: string) => (value ? null : 'Phone number is required'),
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
    return null;
  },
  content: (value: string) => (value ? null : 'Content is required'),
};

// Mock data function for recommended classes (unchanged)
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
        Here are the classes recommended based on your consultation request
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { createConsultation } = useConsultationQuery();

  const form = useForm({
    initialValues: FORM_INITIAL_VALUES,
    validate: FORM_VALIDATION,
  });

  const handleSubmit = async (values: ConsultationFormValues) => {
    console.log('Consultation form submitted:', values);
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Create consultation
      await createConsultation({
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        content: values.content,
      });

      setSuccessMessage('Consultation request submitted successfully! We will contact you soon.');
      
      // Show recommended classes after successful submission
      const classes = await getMockRecommendedClasses();
      setRecommendedClasses(classes);
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error submitting consultation:', error);
      setErrorMessage('Failed to submit consultation request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputProps = {
    radius: 'md' as const,
    classNames: { input: classes.input },
  };

  return (
    <GradientBox direction="column" py={48} intensity="light">
      <Text
        fz={{ base: '2.57rem', md: '2.7rem', lg: '2.99rem' }}
        ta="center"
        fw={500}
      >
        Request a Free Consultation
      </Text>
      <Text ta="center" fw={400} fz="1rem">
        Tell us about your learning needs and we'll help you find the perfect classes for your child
      </Text>
      <Paper
        maw={1152}
        w={{ base: '95%', xssm: '80%', lg: 1152 }}
        p={32}
        mt={40}
      >
        {successMessage && (
          <Alert variant="light" color="green" mb="md">
            {successMessage}
          </Alert>
        )}
        
        {errorMessage && (
          <Alert variant="light" color="red" mb="md">
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex
            align="center"
            gap={{ base: 20, sm: 50 }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Image
              src="https://cdn.create-learn.us/next-image/create-learn-prod/strapi-studio/Class_Recommendation_Widge_3321183a76.png?width=640"
              alt="Consultation Form Image"
              w={254}
            />
            <Stack gap={16} flex={1}>
              <TextInput
                {...inputProps}
                withAsterisk
                label="Full Name"
                placeholder="Enter your full name"
                {...form.getInputProps('customerName')}
              />

              <TextInput
                {...inputProps}
                withAsterisk
                label="Phone Number"
                placeholder="Enter your phone number"
                {...form.getInputProps('phoneNumber')}
              />

              <TextInput
                {...inputProps}
                withAsterisk
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
                {...form.getInputProps('email')}
              />

              <Textarea
                {...inputProps}
                withAsterisk
                label="Tell us about your learning needs"
                placeholder="Describe what type of classes you're looking for, your child's age, interests, experience level, or any specific questions you have..."
                minRows={4}
                {...form.getInputProps('content')}
              />

              <Button
                w={232}
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                radius="md"
              >
                Request Free Consultation
              </Button>
            </Stack>
          </Flex>
        </form>
        
        {/* {!isLoading && <RecommendedClassesList classes={recommendedClasses} />} */}
      </Paper>
    </GradientBox>
  );
};

export default FindBestClassSection;