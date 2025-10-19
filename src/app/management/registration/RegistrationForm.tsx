'use client';

import React, { useState } from 'react';
import { Button, TextInput, Group, Stack, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Registration, ClassOption } from '@/types';

interface RegistrationFormProps {
  initialValues?: Registration | null;
  onSubmit: (data: Partial<Registration>) => Promise<void>;
  onCancel: () => void;
  classOptions: ClassOption[];
  isLoadingClassOptions?: boolean;
}

interface FormValues {
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  status: 'PROCESSING' | 'PROCESSED';
  clazzId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  classOptions,
  isLoadingClassOptions = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      customerName: initialValues?.customerName || '',
      customerEmail: initialValues?.customerEmail || '',
      phoneNumber: initialValues?.phoneNumber || '',
      status: initialValues?.status || 'PROCESSING',
      clazzId: initialValues?.classResponse?.id
        ? String(initialValues.classResponse.id)
        : '',
    },
    validate: {
      customerName: (value) => (value ? null : 'Customer name is required'),
      customerEmail: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      phoneNumber: (value) => {
        if (!value) return 'Phone number is required';
        if (!/^\+?[\d\s\-()]+$/.test(value)) return 'Invalid phone format';
        return null;
      },
      status: (value) => (value ? null : 'Status is required'),
      clazzId: (value) => (value ? null : 'Class is required'),
    },
  });

  const statusOptions = [
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'PROCESSED', label: 'Processed' },
  ];

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const submitData = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        phoneNumber: values.phoneNumber,
        status: values.status,
        clazzId: Number(values.clazzId), // Convert back to number for API
      };

      await onSubmit(submitData);
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
          label="Customer Name"
          placeholder="Enter customer name"
          {...form.getInputProps('customerName')}
          autoComplete="off"
          data-form-type="other"
        />

        <TextInput
          radius="md"
          withAsterisk
          label="Customer Email"
          placeholder="Enter customer email"
          type="email"
          {...form.getInputProps('customerEmail')}
          autoComplete="off"
          data-form-type="other"
        />

        <TextInput
          radius="md"
          withAsterisk
          label="Phone Number"
          placeholder="Enter phone number"
          type="tel"
          {...form.getInputProps('phoneNumber')}
          autoComplete="off"
          data-form-type="other"
        />

        <Select
          radius="md"
          withAsterisk
          label="Class"
          placeholder="Select a class"
          data={classOptions}
          {...form.getInputProps('clazzId')}
          disabled={isLoadingClassOptions}
          searchable
          clearable
        />

        <Select
          radius="md"
          withAsterisk
          label="Status"
          placeholder="Select registration status"
          data={statusOptions}
          {...form.getInputProps('status')}
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
          <Button radius="md" size="sm" type="submit" loading={isSubmitting}>
            {initialValues ? 'Update' : 'Create'} Registration
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default RegistrationForm;
