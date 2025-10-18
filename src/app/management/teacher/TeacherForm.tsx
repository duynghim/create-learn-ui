'use client';

import React, { useState } from 'react';
import {
  Button,
  Group,
  TextInput,
  Select,
  Stack,
  FileInput,
  Image,
  Alert,
  Text,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import type {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/types';
import { fileUploadApiClient } from '@/api';
import { useImageUpload } from '@/hooks/useImageUpload';
import { RichContentEditor } from '@/components';

interface TeacherFormProps {
  readonly initialValues?: Teacher | null;
  readonly loading?: boolean;
  readonly onSubmit: (
    data: CreateTeacherRequest | UpdateTeacherRequest
  ) => Promise<void>;
  readonly onCancel: () => void;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTeacherRequest>({
    initialValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      introduction: initialValues?.introduction ?? '',
      gender: (initialValues?.gender as 'MALE' | 'FEMALE') ?? 'MALE',
      profileImageUrl: initialValues?.profileImageUrl ?? '',
    },
    validate: {
      firstName: (v) =>
        v.trim().length < 2 ? 'First name is too short' : null,
      lastName: (v) => (v.trim().length < 2 ? 'Last name is too short' : null),
      introduction: (v) =>
        v.trim().length === 0 ? 'Please provide an introduction' : null,
    },
  });

  // uploader function for useImageUpload
  const uploader = async (file: File): Promise<string> => {
    const res = await fileUploadApiClient.upload(file);
    if (!res || res.status !== 200 || !res.data) {
      throw new Error(res?.message || 'Upload failed');
    }
    return res.data;
  };

  const {
    selectedFile,
    onFileChange,
    previewUrl,
    uploadError,
    uploading,
    wrapSubmit,
  } = useImageUpload({
    initialUrl: form.values.profileImageUrl,
    uploader,
  });

  const handleSubmit = wrapSubmit<CreateTeacherRequest>(
    async (payload) => {
      await onSubmit(payload);
    },
    {
      imageField: 'profileImageUrl',
      setImage: (url: string) => form.setFieldValue('profileImageUrl', url),
    }
  );

  const onSubmitHandler = form.onSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await handleSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmitHandler}>
      <Stack gap="sm">
        <Group grow>
          <TextInput
            label="First name"
            placeholder="First name"
            required
            radius="md"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Last name"
            placeholder="Last name"
            required
            radius="md"
            {...form.getInputProps('lastName')}
          />
        </Group>

        <Select
          label="Gender"
          data={GENDER_OPTIONS}
          radius="md"
          {...form.getInputProps('gender')}
        />

        <RichContentEditor
          label="Introduction"
          withAsterisk
          value={form.values.introduction}
          onChange={(html) => form.setFieldValue('introduction', html)}
          minHeight={300}
          placeholder="Write the full content here…"
        />

        <FileInput
          label="Profile image"
          placeholder="Select profile image (optional)"
          accept="image/*"
          value={selectedFile}
          onChange={onFileChange}
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

        <Group justify="flex-end" mt="lg">
          <Button
            variant="default"
            onClick={onCancel}
            disabled={loading || isSubmitting || uploading}
            radius="md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="fresh-blue"
            loading={loading || isSubmitting || uploading}
            radius="md"
          >
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
