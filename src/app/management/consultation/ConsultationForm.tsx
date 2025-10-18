'use client';

import React, { useState } from 'react';
import { Button, TextInput, Textarea, Group, Stack, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Consultation } from '@/types';

interface ConsultationFormProps {
  initialValues?: Consultation | null;
  onSubmit: (data: Partial<Consultation>) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  customerName: string;
  phoneNumber: string;
  email: string;
  content: string;
  status: string;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      customerName: initialValues?.customerName || '',
      phoneNumber: initialValues?.phoneNumber || '',
      email: initialValues?.email || '',
      content: initialValues?.content || '',
      status: initialValues?.status || 'PROCESSING',
    },
    validate: {
      customerName: (value) => (value ? null : 'Customer name is required'),
      phoneNumber: (value) => (value ? null : 'Phone number is required'),
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      content: (value) => (value ? null : 'Content is required'),
      status: (value) => (value ? null : 'Status is required'),
    },
  });

  const statusOptions = [
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'PROCESSED', label: 'Processed' },
  ];

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Failed to submit form:', error);
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
          label="Customer Name"
          placeholder="Enter customer name"
          {...form.getInputProps('customerName')}
        />

        <TextInput
          radius="md"
          withAsterisk
          label="Phone Number"
          placeholder="Enter phone number"
          {...form.getInputProps('phoneNumber')}
        />

        <TextInput
          radius="md"
          withAsterisk
          label="Email"
          placeholder="Enter email address"
          type="email"
          {...form.getInputProps('email')}
        />

        <Textarea
          radius="md"
          withAsterisk
          label="Content"
          placeholder="Enter consultation content"
          minRows={4}
          {...form.getInputProps('content')}
        />

        <Select
          radius="md"
          withAsterisk
          label="Status"
          placeholder="Select consultation status"
          data={statusOptions}
          {...form.getInputProps('status')}
        />

        <Group justify="flex-end" mt="md">
          <Button size="sm" radius="md" variant="subtle" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" radius="md" type="submit" loading={isSubmitting}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ConsultationForm;