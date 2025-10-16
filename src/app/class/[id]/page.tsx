'use client';

import { useParams } from 'next/navigation';
import {
  Container,
  Alert,
  Loader,
  Center,
  Image,
  Flex,
  Text,
  Box,
  Button,
  Group,
  Badge,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { classApiClient, registrationApiClient } from '@/api';
import { Class } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { FormModal, PublicRegistrationForm } from '@/components';
import React from 'react';
import { useNotification } from '@/hooks';

const ClassDetailPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { showSuccess, showError } = useNotification();

  const params = useParams();
  const classId = params.id as string;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => classApiClient.getById(classId),
    enabled: !!classId,
  });

  const classData = response?.data as Class;

  const handleFormSubmit = async (data: {
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
  }) => {
    try {
      const submitData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        phoneNumber: data.phoneNumber,
        status: 'PROCESSING' as const,
        clazzId: Number(classId),
      };

      await registrationApiClient.create(submitData);

      showSuccess('Registration submitted successfully!');
      close();
    } catch (error) {
      console.error('Registration submission error:', error);
      showError('Failed to submit registration. Please try again.');
    }
  };

  const handleRegistrationClick = () => {
    open();
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !classData) {
    return (
      <Container>
        <Alert variant="light" color="red" mt="md">
          Class not found or error loading class details.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid p={0} h="100%">
      <Flex justify="center" direction={{ base: 'column', sm: 'row' }} gap={20}>
        <Box>
          <Image
            src={classData.image}
            alt={classData.name}
            h={350}
            mah={350}
            fit="contain"
          />
        </Box>
        <Flex
          maw={{ base: '100%', sm: 700 }}
          direction="column"
          w="100%"
          p={28}
          gap={5}
        >
          <Text fz="0.75rem" fw={400}>
            {classData.subjects
              ?.map((subject) => subject.name.toUpperCase())
              .join(', ')}
          </Text>
          <Text
            fz={{ base: '2.507rem', md: '2.7rem', lg: '2.99rem' }}
            c="fresh-blue"
            fw={600}
          >
            {classData.name}
          </Text>
          <Text fw={500} fz="1.25rem">
            {classData.description}
          </Text>
          <Text fw={500} fz="1.25rem">
            Schedule:
          </Text>
          <Group>
            {classData.scheduleResponses.map((schedule) => (
              <Badge key={schedule.id} variant="light" size="md">
                {schedule.time}
              </Badge>
            ))}
          </Group>
          <Button
            size="sm"
            radius="md"
            color="fresh-green"
            onClick={handleRegistrationClick}
            w="fit-content"
            mt={28}
          >
            Register for Class
          </Button>
        </Flex>
      </Flex>

      <FormModal
        opened={opened}
        onCloseAction={close}
        title="Register for Class"
        size="md"
      >
        <PublicRegistrationForm onCancel={close} onSubmit={handleFormSubmit} />
      </FormModal>
    </Container>
  );
};

export default ClassDetailPage;
