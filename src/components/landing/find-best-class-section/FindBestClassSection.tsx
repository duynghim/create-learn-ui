import {
  Image,
  Flex,
  Paper,
  Text,
  Stack,
  TextInput,
  Textarea,
  Button,
  Box,
  Notification,
} from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';

import { useForm } from '@mantine/form';
import { useState } from 'react';
import GradientBox from '@/components/gradient-box/GradientBox';
import { useConsultationQuery } from '@/hooks';
import classes from './FindBestClassSection.module.css';

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

const FindBestClassSection = () => {
  const xIcon = <IconX size={20} />;
  const checkIcon = <IconCheck size={20} />;
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

      setSuccessMessage(
        'Consultation request submitted successfully! We will contact you soon.'
      );

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error submitting consultation:', error);
      setErrorMessage(
        'Failed to submit consultation request. Please try again.'
      );
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
      <Box px={20}>
        <Text
          fz={{ base: '2.57rem', md: '2.7rem', lg: '2.99rem' }}
          ta="center"
          fw={500}
        >
          Request a Free Consultation
        </Text>
        <Text ta="center" fw={400} fz="1rem">
          Tell us about your learning needs and we&#39;ll help you find the
          perfect classes for your child
        </Text>
      </Box>
      <Paper
        maw={1152}
        w={{ base: '95%', xssm: '80%', lg: 1152 }}
        p={32}
        mt={40}
      >
        {successMessage && (
          <Notification
            icon={checkIcon}
            color="teal"
            title="Registration Success"
            withCloseButton={false}
            mb="md"
          >
            {successMessage}
          </Notification>
        )}

        {errorMessage && (
          <Notification
            icon={xIcon}
            color="red"
            title="Something Wrong, please try again!"
            withCloseButton={false}
            mb="md"
          >
            {errorMessage}
          </Notification>
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
            <Stack gap={16} flex={1} w="100%">
              <TextInput
                {...inputProps}
                withAsterisk
                label="Full Name"
                placeholder="Enter your full name"
                {...form.getInputProps('customerName')}
                w={{ base: '90%', md: 400 }}
              />

              <TextInput
                {...inputProps}
                withAsterisk
                label="Phone Number"
                placeholder="Enter your phone number"
                {...form.getInputProps('phoneNumber')}
                w={{ base: '90%', md: 400 }}
              />

              <TextInput
                {...inputProps}
                withAsterisk
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
                {...form.getInputProps('email')}
                w={{ base: '90%', md: 400 }}
              />

              <Textarea
                {...inputProps}
                withAsterisk
                label="Tell us about your learning needs"
                placeholder="Describe what type of classes you're looking for"
                minRows={4}
                {...form.getInputProps('content')}
                w={{ base: '90%', md: 400 }}
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
      </Paper>
    </GradientBox>
  );
};

export default FindBestClassSection;
