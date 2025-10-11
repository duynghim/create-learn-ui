'use client';

import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Textarea,
  Group,
  FileInput,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';
import type { Subject } from '@/types';

interface SubjectFormProps {
  initialValues?: Subject | null;
  onSubmit: (data: Partial<Subject> & { icon?: File }) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  description: string;
  icon?: File | null;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      icon: null,
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
    },
  });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    form.setFieldValue('icon', file);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const submitData = {
        name: values.name,
        description: values.description || undefined,
        icon: selectedFile || values.icon || undefined,
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
        label="Name"
        placeholder="Enter subject name"
        {...form.getInputProps('name')}
        required
        mb="md"
        radius="md"
      />

      <Textarea
        label="Description"
        placeholder="Enter subject description"
        {...form.getInputProps('description')}
        mb="md"
        minRows={3}
        radius="md"
      />

      <FileInput
        label="Icon"
        placeholder="Upload subject icon"
        accept="image/*"
        value={selectedFile}
        onChange={handleFileChange}
        leftSection={<IconUpload size={16} />}
        mb="md"
        clearable
        radius="md"
      />

      <Group justify="flex-end" mt="lg">
        <Button
          radius="md"
          variant="subtle"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} variant="filled" size="sm">
          {initialValues ? 'Update' : 'Create'} Subject
        </Button>
      </Group>
    </Box>
  );
};

export default SubjectForm;
