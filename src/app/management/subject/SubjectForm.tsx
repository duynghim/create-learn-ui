'use client';

import React, { useState, useEffect } from 'react';
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
  iconBase64?: string | null;
}

/**
 * Convert a raw base64 string (no data: prefix) into a File
 * Defaults to image/png unless you pass a different mime.
 */
async function base64ToFile(
  base64: string,
  filename: string,
  mime: string = 'image/png'
): Promise<File> {
  // Build a data URL and fetch it so we don’t have to atob huge strings manually
  const resp = await fetch(`data:${mime};base64,${base64}`);
  const blob = await resp.blob();
  return new File([blob], filename, { type: mime });
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      icon: null,
      iconBase64: initialValues?.iconBase64 || null,
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
    },
  });

  // Cleanup object URL on unmount or when replaced
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // If we are editing and only have base64 from server, hydrate a File for FileInput
  useEffect(() => {
    let cancelled = false;

    const hydrateFromBase64 = async () => {
      if (!initialValues?.iconBase64) return;
      if (selectedFile) return; // already have a picked file, do nothing

      try {
        const safeName = (initialValues.name || 'icon')
          .toLowerCase()
          .replaceAll(/\s+/g, '-')
          .replaceAll(/[^a-z0-9._-]/g, '')
          .slice(0, 60);

        // If you store mime on server, pass it here instead of default 'image/png'
        const file = await base64ToFile(
          initialValues.iconBase64,
          `${safeName || 'icon'}.png`,
          'image/png'
        );
        if (cancelled) return;

        setSelectedFile(file);
        form.setFieldValue('icon', file);

        // Preview
        const url = URL.createObjectURL(file);
        setObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch {
        // If conversion fails, keep base64 preview path; user can reupload if needed
      }
    };

    hydrateFromBase64();
    return () => {
      cancelled = true;
    };
  }, [initialValues?.iconBase64, initialValues?.name, form, selectedFile]);

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (file: File | null) => {
    setSelectedFile(file);
    form.setFieldValue('icon', file);

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      try {
        const b64 = await fileToBase64(file);
        form.setFieldValue('iconBase64', b64);
      } catch {
        form.setFieldValue('iconBase64', null);
      }
    } else {
      form.setFieldValue('iconBase64', null);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const submitData = {
        name: values.name,
        description: values.description || undefined,
        icon: selectedFile || values.icon || undefined,
        iconBase64: values.iconBase64 || undefined,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  let previewSrc = '';
  if (selectedFile && objectUrl) {
    previewSrc = objectUrl;
  } else if (form.values.iconBase64) {
    previewSrc = `data:image/png;base64,${form.values.iconBase64}`;
  }

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

      {previewSrc ? (
        <Image
          src={previewSrc}
          alt={form.values.name || 'icon'}
          maw={200}
          fit="contain"
          mb="md"
        />
      ) : (
        <Text size="sm" mb="md">
          No icon
        </Text>
      )}

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
