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
  Box,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import type { News, CreateNewsRequest } from '@/types';
import { RichContentEditor } from '@/components';
import { fileUploadApiClient } from '@/api';
import { useImageUpload } from '@/hooks/useImageUpload';

interface NewsFormProps {
  initialValues?: News | null;
  onSubmit: (data: CreateNewsRequest) => Promise<void>;
  onCancel: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasExistingImage, setHasExistingImage] = useState(false);

  const form = useForm<CreateNewsRequest>({
    initialValues: {
      title: initialValues?.title ?? '',
      brief: initialValues?.brief ?? '',
      content: initialValues?.content ?? '',
      isDisplay: initialValues?.isDisplay ?? true,
      image: initialValues?.image ?? '',
    },
    validate: {
      title: (value) => (value ? null : 'Title is required'),
      brief: (value) => (value ? null : 'Brief is required'),
      content: (value) => (value ? null : 'Content is required'),
    },
  });

  useEffect(() => {
    // Set hasExistingImage when component mounts with initial values
    if (initialValues?.image) {
      setHasExistingImage(true);
    }
  }, [initialValues?.image]);

  // uploader function for useImageUpload
  const uploader = async (file: File): Promise<string> => {
    const res = await fileUploadApiClient.upload(file);
    if (!res || res.status !== 200 || !res.data) {
      throw new Error(res?.message || 'Upload failed');
    }
    return res.data;
  };

  // Function to extract path from full URL
  const extractImagePath = (imageUrl: string): string => {
    if (!imageUrl) return '';

    // If it's already a path (starts with /), return as is
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }

    // If it's a full URL, extract the path part
    try {
      const url = new URL(imageUrl);
      return url.pathname;
    } catch {
      // If URL parsing fails, try to extract manually
      const pathMatch = imageUrl.match(/\/create-learn-storage\/.*$/);
      return pathMatch ? pathMatch[0] : imageUrl;
    }
  };

  // reusable upload hook
  const {
    selectedFile,
    onFileChange,
    previewUrl,
    uploadError,
    uploading,
    wrapSubmit,
  } = useImageUpload({
    initialUrl: form.values.image,
    uploader,
  });

  const handleFileChange = (file: File | null) => {
    // Clear existing image flag when user selects a new file
    if (file) {
      setHasExistingImage(false);
    }
    onFileChange(file);
  };

  const handleSubmit = wrapSubmit<CreateNewsRequest>(
    async (payload) => {
      const submitData: CreateNewsRequest = { ...payload };

      // Only include image if a new file was selected
      // For updates without new file, keep existing image but use path format
      if (!selectedFile && hasExistingImage && initialValues?.image) {
        submitData.image = extractImagePath(initialValues.image);
      }

      await onSubmit(submitData);
    },
    {
      imageField: 'image',
      setImage: (url) => form.setFieldValue('image', url),
    }
  );

  const onSubmitWrapper = async (values: CreateNewsRequest) => {
    setIsSubmitting(true);
    try {
      await handleSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine what image to show
  const getImageSrc = () => {
    if (previewUrl) {
      return previewUrl;
    }
    if (form.values.image) {
      return form.values.image;
    }
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <form onSubmit={form.onSubmit(onSubmitWrapper)}>
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
          placeholder={
            hasExistingImage && !selectedFile
              ? 'Current image will be kept'
              : 'Select image (optional)'
          }
          accept="image/*"
          value={selectedFile}
          onChange={handleFileChange}
          leftSection={<IconUpload size={16} />}
          radius="md"
          clearable
          disabled={isSubmitting || uploading}
        />

        {imageSrc ? (
          <Box>
            <Text size="sm" mb="xs" c="dimmed">
              {selectedFile ? 'New image preview:' : 'Current image:'}
            </Text>
            <Image src={imageSrc} alt="Preview" maw={200} radius="md" />
          </Box>
        ) : (
          <Text size="sm" c="dimmed">
            No Image
          </Text>
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
