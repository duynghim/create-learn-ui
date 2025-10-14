'use client';

import React, { useState, useEffect } from 'react';
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
  FileInput,
  Image,
  Text,
  Alert,
  Box,
  ActionIcon,
  Flex,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import type {
  Class,
  Subject,
  Grade,
  Teacher,
  CreateClassRequest,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from '@/types';
import { IconUpload, IconPlus, IconTrash } from '@tabler/icons-react';
import { fileUploadApiClient, scheduleApiClient } from '@/api';
import { useImageUpload } from '@/hooks';

interface ClassFormProps {
  initialValues?: Class | null;
  onSubmit: (data: Partial<Class>) => Promise<void>;
  onCancel: () => void;
  subjects?: Subject[];
  grades?: Grade[];
  teachers?: Teacher[];
}

interface ScheduleEntry {
  id?: number;
  time: string;
  isNew?: boolean;
}

interface ExtendedFormValues extends CreateClassRequest {
  schedules: ScheduleEntry[];
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
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [deletedScheduleIds, setDeletedScheduleIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const form = useForm<ExtendedFormValues>({
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
      schedules: initialValues?.scheduleResponses?.length
        ? initialValues.scheduleResponses.map((s) => ({
            id: s.id,
            time: s.time || '',
            isNew: false,
          }))
        : [{ time: '', isNew: true }],
    },
    validate: {
      name: (v) => (v ? null : 'Name is required'),
      brief: (v) => (v ? null : 'Brief is required'),
      description: (v) => (v ? null : 'Description is required'),
      teacherId: (v) => (v ? null : 'Teacher is required'),
      price: (v) => (v >= 0 ? null : 'Price must be non-negative'),
      schedules: {
        time: (value) => (value ? null : 'Schedule time is required'),
      },
    },
  });

  useEffect(() => {
    if (initialValues?.image) {
      setHasExistingImage(true);
    }
  }, [initialValues?.image]);

  const uploader = async (file: File): Promise<string> => {
    const res = await fileUploadApiClient.upload(file);
    if (!res || res.status !== 200 || !res.data) {
      throw new Error(res?.message || 'Upload failed');
    }
    return res.data;
  };

  const extractImagePath = (imageUrl: string): string => {
    if (!imageUrl) return '';

    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }

    try {
      const url = new URL(imageUrl);
      return url.pathname;
    } catch {
      const regex = /\/create-learn-storage\/.*$/;
      const pathMatch = regex.exec(imageUrl);
      return pathMatch ? pathMatch[0] : imageUrl;
    }
  };

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
    if (file) {
      setHasExistingImage(false);
    }
    onFileChange(file);
  };

  const addSchedule = () => {
    form.insertListItem('schedules', { time: '', isNew: true });
  };

  const removeSchedule = (index: number) => {
    if (form.values.schedules.length > 1) {
      const scheduleToRemove = form.values.schedules[index];

      // If the schedule has an ID and is not new, add it to deleted list
      if (scheduleToRemove.id && !scheduleToRemove.isNew) {
        setDeletedScheduleIds((prev) => [...prev, scheduleToRemove.id!]);
      }

      form.removeListItem('schedules', index);
    }
  };

  const handleDeletedSchedules = async () => {
    if (deletedScheduleIds.length === 0) return;

    const deletePromises = deletedScheduleIds.map((scheduleId) =>
      scheduleApiClient.delete(String(scheduleId))
    );

    await Promise.all(deletePromises);
  };

  const handleSchedules = async (
    classId: string,
    schedules: ScheduleEntry[]
  ) => {
    const promises: Promise<any>[] = [];

    // Handle deleted schedules first
    await handleDeletedSchedules();

    // Handle create/update schedules
    for (const schedule of schedules) {
      if (!schedule.time.trim()) continue;

      if (schedule.isNew) {
        const payload: CreateScheduleRequest = {
          time: schedule.time,
          clazzId: Number(classId),
        };
        promises.push(scheduleApiClient.create(payload));
      } else if (schedule.id) {
        const payload: UpdateScheduleRequest = {
          id: String(schedule.id),
          time: schedule.time,
          clazzId: Number(classId),
        };
        promises.push(scheduleApiClient.update(String(schedule.id), payload));
      }
    }

    await Promise.all(promises);

    // Invalidate queries to refresh data
    await Promise.all([
      // Invalidate specific class query
      queryClient.invalidateQueries({
        queryKey: ['classes', classId],
      }),
      // Invalidate all classes queries
      queryClient.invalidateQueries({
        queryKey: ['classes'],
      }),
      // Invalidate schedule queries if you have them
      queryClient.invalidateQueries({
        queryKey: ['schedules'],
      }),
      // Invalidate schedule queries for specific class
      queryClient.invalidateQueries({
        queryKey: ['schedules', 'class', classId],
      }),
    ]);
  };

  const handleSubmit = wrapSubmit<ExtendedFormValues>(
    async (payload) => {
      const submitData: Partial<Class> = {
        ...payload,
        subjectIds: payload.subjectIds.map(Number),
        gradeIds: payload.gradeIds.map(Number),
        teacherId: Number(payload.teacherId),
      };

      const { schedules, ...classData } = submitData;

      if (!selectedFile && hasExistingImage && initialValues?.image) {
        classData.image = extractImagePath(initialValues.image);
      }

      // First, create/update the class
      await onSubmit(classData);

      // Handle schedules for both create and update
      if (initialValues?.id) {
        await handleSchedules(String(initialValues.id), payload.schedules);
      }

      // Additional invalidation for class queries
      await queryClient.invalidateQueries({
        queryKey: ['classes'],
      });
    },
    {
      imageField: 'image',
      setImage: (url) => form.setFieldValue('image', url),
    }
  );

  const onSubmitWrapper = async (values: ExtendedFormValues) => {
    setIsSubmitting(true);
    try {
      await handleSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
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
          label="Name"
          placeholder="Enter class name"
          {...form.getInputProps('name')}
        />
        <TextInput
          radius="md"
          withAsterisk
          label="Brief"
          placeholder="Enter brief description"
          {...form.getInputProps('brief')}
        />
        <Textarea
          radius="md"
          withAsterisk
          label="Description"
          placeholder="Enter detailed description"
          minRows={3}
          {...form.getInputProps('description')}
        />

        <Textarea
          radius="md"
          label="Requirements"
          placeholder="Enter class requirements"
          minRows={2}
          {...form.getInputProps('requirement')}
        />
        <Textarea
          radius="md"
          label="Guarantee"
          placeholder="Enter class guarantee"
          minRows={2}
          {...form.getInputProps('guarantee')}
        />
        <NumberInput
          radius="md"
          withAsterisk
          label="Price"
          placeholder="Enter price"
          min={0}
          {...form.getInputProps('price')}
        />
        <MultiSelect
          radius="md"
          label="Subjects"
          placeholder="Select subjects"
          data={subjectOptions}
          searchable
          {...form.getInputProps('subjectIds')}
        />
        <MultiSelect
          radius="md"
          label="Grades"
          placeholder="Select grades"
          data={gradeOptions}
          searchable
          {...form.getInputProps('gradeIds')}
        />
        <Select
          radius="md"
          withAsterisk
          label="Teacher"
          placeholder="Select teacher"
          data={teacherOptions}
          searchable
          {...form.getInputProps('teacherId')}
        />

        <Box>
          <Text size="sm" fw={500} mb="xs">
            Schedules
          </Text>
          <Stack gap="xs">
            {form.values.schedules.map((schedule, index) => (
              <Flex
                key={`${schedule.id || 'new'}-${index}`}
                gap="xs"
                align="flex-end"
              >
                <TextInput
                  flex={1}
                  placeholder="Enter schedule time (e.g., Tuesday - 8am to 9am)"
                  {...form.getInputProps(`schedules.${index}.time`)}
                  radius="md"
                />
                <ActionIcon
                  variant="light"
                  color="blue"
                  size="lg"
                  onClick={addSchedule}
                  radius="md"
                >
                  <IconPlus size={16} />
                </ActionIcon>
                {form.values.schedules.length > 1 && (
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="lg"
                    onClick={() => removeSchedule(index)}
                    radius="md"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                )}
              </Flex>
            ))}
          </Stack>
        </Box>

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
          label="Display this class"
          {...form.getInputProps('isDisplayed', { type: 'checkbox' })}
        />
        <Group justify="flex-end" mt="md">
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
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ClassForm;
