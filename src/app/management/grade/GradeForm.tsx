'use client';

import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Textarea,
  Group,
  FileInput,
  Box,
  Image,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';
import type { Grade } from '@/types';

interface GradeFormProps {
  initialValues?: Grade | null;
  onSubmit: (data: Partial<Grade> & { icon?: File }) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  description: string;
  icon?: File | null;
}

const GradeForm: React.FC<GradeFormProps> = ({
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
        placeholder="Enter grade name"
        {...form.getInputProps('name')}
        required
        mb="md"
      />

      <Textarea
        label="Description"
        placeholder="Enter grade description"
        {...form.getInputProps('description')}
        mb="md"
        minRows={3}
      />

      <FileInput
        label="Icon"
        placeholder="Upload grade icon"
        accept="image/*"
        value={selectedFile}
        onChange={handleFileChange}
        leftSection={<IconUpload size={16} />}
        mb="md"
        clearable
      />

      {selectedFile && (
        <Box mb="md">
          <Text size="sm" mb="xs">
            Selected file: {selectedFile.name}
          </Text>
        </Box>
      )}

      {initialValues?.iconBase64 && !selectedFile && (
        <Box mb="md">
          <Text size="sm" mb="xs">
            Current Icon:
          </Text>
          <Image
            src={`data:image/png;base64,${initialValues.iconBase64}`}
            alt="Current grade icon"
            width={64}
            height={64}
            fit="contain"
          />
        </Box>
      )}

      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialValues ? 'Update' : 'Create'} Grade
        </Button>
      </Group>
    </Box>
  );
};

export default GradeForm;
