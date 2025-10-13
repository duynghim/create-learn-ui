'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  TextInput,
  Textarea,
  Group,
  Stack,
  Switch,
  FileInput,
  Image,
  Alert,
  Text,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import type { News } from '@/types';
import { RichContentEditor } from '@/components';
import { fileUploadApiClient } from '@/api';

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
  image: string; // final URL
}

const NewsForm: React.FC<NewsFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(form.values.image || '');
    }
  }, [selectedFile, form.values.image]);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadError(null);
    try {
      const res = await fileUploadApiClient.upload(file);
      if (!res || res.status !== 200 || !res.data) {
        throw new Error(res?.message || 'Upload failed');
      }
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Image upload failed';
      setUploadError(msg);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrl = values.image;

      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
          form.setFieldValue('image', imageUrl);
        } catch {
          // uploadError already set
          return;
        }
      }

      await onSubmit({ ...values, image: imageUrl });
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

        <RichContentEditor
          label="Content"
          withAsterisk
          value={form.values.content}
          onChange={(html) => form.setFieldValue('content', html)}
          minHeight={300}
          placeholder="Write the full content here…"
        />

        <FileInput
          label="Image"
          placeholder="Select image (optional)"
          accept="image/*"
          value={selectedFile}
          onChange={(file) => {
            setSelectedFile(file);
            setUploadError(null);
          }}
          leftSection={<IconUpload size={16} />}
          radius="md"
          clearable
          disabled={isSubmitting || uploading}
        />

        {previewUrl ? (
          <Image src={previewUrl} alt="Preview" maw={200} radius="md" />
        ) : (
          <Text>No Image</Text>
        )}

        {uploadError && (
          <Alert color="red" variant="light" radius="md">
            {uploadError}
          </Alert>
        )}

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
            disabled={isSubmitting || uploading}
          >
            Cancel
          </Button>
          <Button
            radius="md"
            size="sm"
            type="submit"
            loading={isSubmitting || uploading}
            disabled={uploading}
          >
            {initialValues ? 'Update' : 'Create'} News
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default NewsForm;
