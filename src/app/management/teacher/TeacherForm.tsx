'use client';

import React from 'react';
import {
  Button,
  Group,
  TextInput,
  Textarea,
  Select,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/types';

interface TeacherFormProps {
  initialValues?: Teacher | null;
  loading?: boolean;
  onSubmit: (
    data: CreateTeacherRequest | UpdateTeacherRequest
  ) => Promise<void>;
  onCancel: () => void;
}

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
] as const;

export default function TeacherForm({
  initialValues = null,
  loading = false,
  onSubmit,
  onCancel,
}: TeacherFormProps) {
  const form = useForm<CreateTeacherRequest>({
    initialValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      introduction: initialValues?.introduction ?? '',
      gender: (initialValues?.gender as 'MALE' | 'FEMALE') ?? 'MALE',
      profileImageUrl: '', // intentionally unused for this form
    },
    validate: {
      firstName: (v) =>
        v.trim().length < 2 ? 'First name is too short' : null,
      lastName: (v) => (v.trim().length < 2 ? 'Last name is too short' : null),
      introduction: (v) =>
        v.trim().length === 0 ? 'Please provide an introduction' : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    // Keep id out of the payload here; caller can merge id if needed
    await onSubmit(values);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="sm">
        <Group grow>
          <TextInput
            label="First name"
            placeholder="First name"
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Last name"
            placeholder="Last name"
            required
            {...form.getInputProps('lastName')}
          />
        </Group>

        <Select
          label="Gender"
          data={GENDER_OPTIONS}
          {...form.getInputProps('gender')}
        />

        <Textarea
          label="Introduction"
          placeholder="Short intro about the teacher"
          minRows={3}
          {...form.getInputProps('introduction')}
        />

        <Group position="right" mt="sm">
          <Button variant="default" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" color="fresh-blue" loading={loading}>
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
