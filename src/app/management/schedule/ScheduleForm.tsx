'use client';

import React, { useState } from 'react';
import { Button, TextInput, Select, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Schedule, ClassOption } from '@/types';

interface ScheduleFormProps {
  initialValues?: Schedule | null;
  onSubmit: (data: Partial<Schedule>) => Promise<void>;
  onCancel: () => void;
  classOptions: ClassOption[];
  isLoadingClassOptions?: boolean;
}

interface FormValues {
  time: string;
  clazzId: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  classOptions,
  isLoadingClassOptions = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      time: initialValues?.time || '',
      clazzId: initialValues?.clazzId ? String(initialValues.clazzId) : '',
    },
    validate: {
      time: (value) => (value ? null : 'Time is required'),
      clazzId: (value) => (value ? null : 'Class is required'),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const submitData = {
        time: values.time,
        clazzId: Number(values.clazzId),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Time"
        placeholder="Enter schedule time (e.g., Tuesday - 8am to 9am)"
        {...form.getInputProps('time')}
        required
        mb="md"
      />

      <Select
        label="Class"
        placeholder="Select a class"
        data={classOptions}
        {...form.getInputProps('clazzId')}
        required
        mb="md"
        disabled={isLoadingClassOptions}
        searchable
        clearable
      />

      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialValues ? 'Update' : 'Create'} Schedule
        </Button>
      </Group>
    </Box>
  );
};

export default ScheduleForm;
