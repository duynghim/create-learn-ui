'use client';

import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Textarea,
  Group,
  Stack,
  Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { News } from '@/types';

interface NewsFormProps {
  initialValues?: News | null;
  onSubmit: (data: Partial<News>) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  brief: string;
  content: string;
  isDisplay: boolean;
  image: string;
}

const NewsForm: React.FC<NewsFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      title: initialValues?.title || '',
      brief: initialValues?.brief || '',
      content: initialValues?.content || '',
      isDisplay: initialValues?.isDisplay ?? true,
      image: initialValues?.image || '',
    },
    validate: {
      title: (value) => (value ? null : 'Title is required'),
      brief: (value) => (value ? null : 'Brief is required'),
      content: (value) => (value ? null : 'Content is required'),
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
          label="Title"
          placeholder="Enter news title"
          {...form.getInputProps('title')}
        />

        <Textarea
          radius="md"
          withAsterisk
          label="Brief"
          placeholder="Enter brief description"
          minRows={3}
          {...form.getInputProps('brief')}
        />

        <Textarea
          radius="md"
          withAsterisk
          label="Content"
          placeholder="Enter full content (HTML supported)"
          minRows={8}
          maxRows={15}
          {...form.getInputProps('content')}
        />

        <TextInput
          radius="md"
          label="Image URL"
          placeholder="Enter image URL"
          {...form.getInputProps('image')}
        />

        <Switch
          label="Display this news"
          description="Toggle to make this news visible to users"
          {...form.getInputProps('isDisplay', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="lg">
          <Button
            radius="md"
            size="sm"
            variant="subtle"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button radius="md" size="sm" type="submit" loading={isSubmitting}>
            {initialValues ? 'Update' : 'Create'} News
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default NewsForm;
