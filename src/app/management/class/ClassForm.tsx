'use client';

import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Textarea,
  Group,
  Stack,
  NumberInput,
  Switch,
  Select,
  MultiSelect,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Class, Subject, Grade, Teacher } from '@/types';

interface ClassFormProps {
  initialValues?: Class | null;
  onSubmit: (data: Partial<Class>) => Promise<void>;
  onCancel: () => void;
  subjects?: Subject[];
  grades?: Grade[];
  teachers?: Teacher[];
}

interface FormValues {
  name: string;
  brief: string;
  description: string;
  image: string;
  requirement: string;
  guarantee: string;
  isDisplayed: boolean;
  subjectIds: string[];
  gradeIds: string[];
  teacherId: string;
  price: number;
}

const ClassForm: React.FC<ClassFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  subjects = [],
  grades = [],
  teachers = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      name: initialValues?.name || '',
      brief: initialValues?.brief || '',
      description: initialValues?.description || '',
      image: initialValues?.image || '',
      requirement: initialValues?.requirement || '',
      guarantee: initialValues?.guarantee || '',
      isDisplayed: initialValues?.isDisplayed ?? true,
      subjectIds: initialValues?.subjects?.map((s) => String(s.id)) || [],
      gradeIds: initialValues?.grades?.map((g) => String(g.id)) || [],
      teacherId: initialValues?.teacher?.id
        ? String(initialValues.teacher.id)
        : '',
      price: initialValues?.price || 0,
    },
    validate: {
      name: (v) => (v ? null : 'Name is required'),
      brief: (v) => (v ? null : 'Brief is required'),
      description: (v) => (v ? null : 'Description is required'),
      teacherId: (v) => (v ? null : 'Teacher is required'),
      price: (v) => (v >= 0 ? null : 'Price must be non-negative'),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        subjectIds: values.subjectIds.map(Number), // simplified
        gradeIds: values.gradeIds.map(Number), // simplified
        teacherId: Number(values.teacherId),
      });
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = subjects.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));
  const gradeOptions = grades.map((g) => ({
    value: String(g.id),
    label: g.name,
  }));
  const teacherOptions = teachers.map((t) => ({
    value: String(t.id),
    label: `${t.firstName} ${t.lastName}`,
  }));

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Enter class name"
          {...form.getInputProps('name')}
        />
        <TextInput
          withAsterisk
          label="Brief"
          placeholder="Enter brief description"
          {...form.getInputProps('brief')}
        />
        <Textarea
          withAsterisk
          label="Description"
          placeholder="Enter detailed description"
          minRows={3}
          {...form.getInputProps('description')}
        />
        <TextInput
          label="Image URL"
          placeholder="Enter image URL"
          {...form.getInputProps('image')}
        />
        <Textarea
          label="Requirements"
          placeholder="Enter class requirements"
          minRows={2}
          {...form.getInputProps('requirement')}
        />
        <Textarea
          label="Guarantee"
          placeholder="Enter class guarantee"
          minRows={2}
          {...form.getInputProps('guarantee')}
        />
        <NumberInput
          withAsterisk
          label="Price"
          placeholder="Enter price"
          min={0}
          {...form.getInputProps('price')}
        />
        <MultiSelect
          label="Subjects"
          placeholder="Select subjects"
          data={subjectOptions}
          searchable
          {...form.getInputProps('subjectIds')}
        />
        <MultiSelect
          label="Grades"
          placeholder="Select grades"
          data={gradeOptions}
          searchable
          {...form.getInputProps('gradeIds')}
        />
        <Select
          withAsterisk
          label="Teacher"
          placeholder="Select teacher"
          data={teacherOptions}
          searchable
          {...form.getInputProps('teacherId')}
        />
        <Switch
          label="Display this class"
          {...form.getInputProps('isDisplayed', { type: 'checkbox' })}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ClassForm;
