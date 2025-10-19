'use client';

import React, { useState } from 'react';
import { Button, TextInput, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

interface PublicRegistrationFormProps {
  onSubmit: (data: {
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
  }) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
}

const PublicRegistrationForm: React.FC<PublicRegistrationFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      customerName: '',
      customerEmail: '',
      phoneNumber: '',
    },
    validate: {
      customerName: (value) => (value ? null : 'Full name is required'),
      customerEmail: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      phoneNumber: (value) => {
        if (!value) return 'Phone number is required';
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          radius="md"
          withAsterisk
          label="Full Name"
          placeholder="Enter your full name"
          {...form.getInputProps('customerName')}
        />

        <TextInput
          radius="md"
          withAsterisk
          label="Email Address"
          placeholder="Enter your email address"
          type="email"
          {...form.getInputProps('customerEmail')}
        />

        <TextInput
          radius="md"
          withAsterisk
          label="Phone Number"
          placeholder="Enter your phone number"
          {...form.getInputProps('phoneNumber')}
        />

        <Group justify="flex-end" mt="md">
          <Button
            size="sm"
            radius="md"
            variant="subtle"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            radius="md"
            size="sm"
            type="submit"
            loading={isSubmitting}
          >
            Register Now
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default PublicRegistrationForm;
