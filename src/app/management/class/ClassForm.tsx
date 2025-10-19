'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
import { RichContentEditor } from '@/components';

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
  uid?: string; // local key for new rows
}

interface ExtendedFormValues extends CreateClassRequest {
  schedules: ScheduleEntry[];
}

const uid = () => Math.random().toString(36).slice(2, 10);

const ClassForm: React.FC<ClassFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  subjects = [],
  grades = [],
  teachers = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      price: initialValues?.price ?? 0,
      schedules: initialValues?.scheduleResponses?.length
        ? initialValues.scheduleResponses.map((s) => ({
            id: s.id,
            time: s.time || '',
            isNew: false,
            uid: uid(),
          }))
        : [{ time: '', isNew: true, uid: uid() }],
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

  const uploader = useCallback(async (file: File): Promise<string> => {
    const res = await fileUploadApiClient.upload(file);
    if (!res || res.status !== 200 || !res.data) {
      throw new Error(res?.message || 'Upload failed');
    }
    return res.data;
  }, []);

  const extractImagePath = useCallback((imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('/')) return imageUrl;
    try {
      const url = new URL(imageUrl);
      return url.pathname || imageUrl;
    } catch {
      const m = /\/create-learn-storage\/.*$/.exec(imageUrl);
      return m ? m[0] : imageUrl;
    }
  }, []);

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

  const keepExistingImage = useMemo(
    () => !selectedFile && Boolean(initialValues?.image),
    [selectedFile, initialValues?.image]
  );

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: String(s.id), label: s.name })),
    [subjects]
  );
  const gradeOptions = useMemo(
    () => grades.map((g) => ({ value: String(g.id), label: g.name })),
    [grades]
  );
  const teacherOptions = useMemo(
    () =>
      teachers.map((t) => ({
        value: String(t.id),
        label: `${t.firstName} ${t.lastName}`,
      })),
    [teachers]
  );

  const imageSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (form.values.image) return form.values.image;
    return null;
  }, [previewUrl, form.values.image]);

  const handleFileChange = useCallback(
    (file: File | null) => {
      onFileChange(file);
    },
    [onFileChange]
  );

  const addSchedule = useCallback(() => {
    form.insertListItem('schedules', { time: '', isNew: true, uid: uid() });
  }, [form]);

  const removeSchedule = useCallback(
    (index: number) => {
      if (form.values.schedules.length <= 1) return;
      const scheduleToRemove = form.values.schedules[index];
      if (scheduleToRemove.id && !scheduleToRemove.isNew) {
        setDeletedScheduleIds((prev) => [...prev, scheduleToRemove.id!]);
      }
      form.removeListItem('schedules', index);
    },
    [form]
  );

  const handleDeletedSchedules = useCallback(async () => {
    if (!deletedScheduleIds.length) return;
    await Promise.all(
      deletedScheduleIds.map((scheduleId) =>
        scheduleApiClient.delete(String(scheduleId))
      )
    );
  }, [deletedScheduleIds]);

  const handleSchedules = useCallback(
    async (classId: string, schedules: ScheduleEntry[]) => {
      await handleDeletedSchedules();

      const createOrUpdate: Promise<unknown>[] = [];
      for (const s of schedules) {
        const time = s.time?.trim();
        if (!time) continue;

        if (s.isNew) {
          const payload: CreateScheduleRequest = {
            time,
            clazzId: Number(classId),
          };
          createOrUpdate.push(scheduleApiClient.create(payload));
        } else if (s.id) {
          const payload: UpdateScheduleRequest = {
            id: String(s.id),
            time,
            clazzId: Number(classId),
          };
          createOrUpdate.push(scheduleApiClient.update(String(s.id), payload));
        }
      }
      await Promise.all(createOrUpdate);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['classes', classId] }),
        queryClient.invalidateQueries({ queryKey: ['classes'] }),
        queryClient.invalidateQueries({ queryKey: ['schedules'] }),
        queryClient.invalidateQueries({
          queryKey: ['schedules', 'class', classId],
        }),
      ]);
    },
    [handleDeletedSchedules, queryClient]
  );

  const handleSubmit = wrapSubmit<ExtendedFormValues>(
    async (payload) => {
      const submitData: Partial<Class> = {
        ...payload,
        subjectIds: payload.subjectIds.map(Number),
        gradeIds: payload.gradeIds.map(Number),
        teacherId: Number(payload.teacherId),
      };

      const { ...classData } = submitData;

      if (keepExistingImage && initialValues?.image) {
        classData.image = extractImagePath(initialValues.image);
      }

      await onSubmit(classData);

      if (initialValues?.id) {
        await handleSchedules(String(initialValues.id), payload.schedules);
      }

      await queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    {
      imageField: 'image',
      setImage: (url) => form.setFieldValue('image', url),
    }
  );

  const onSubmitWrapper = useCallback(
    async (values: ExtendedFormValues) => {
      setIsSubmitting(true);
      try {
        await handleSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleSubmit]
  );

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

        <RichContentEditor
          label="Description"
          withAsterisk
          value={form.values.description}
          onChange={(html) => form.setFieldValue('description', html)}
          minHeight={300}
          placeholder="Write the full content here…"
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
              <ScheduleRow
                key={schedule.id ?? schedule.uid ?? index}
                index={index}
                getInputProps={form.getInputProps}
                onAdd={addSchedule}
                onRemove={removeSchedule}
                canRemove={form.values.schedules.length > 1}
              />
            ))}
          </Stack>
        </Box>

        <FileInput
          label="Image"
          placeholder={
            keepExistingImage
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

type GetInputProps = ReturnType<typeof useForm<unknown>>['getInputProps'];

const ScheduleRow = React.memo(function ScheduleRow(props: {
  index: number;
  getInputProps: GetInputProps;
  onAdd: () => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const { index, getInputProps, onAdd, onRemove, canRemove } = props;
  return (
    <Flex gap="xs" align="flex-end">
      <TextInput
        flex={1}
        placeholder="Enter schedule time (e.g., Tuesday - 8am to 9am)"
        {...getInputProps(`schedules.${index}.time`)}
        radius="md"
      />
      <ActionIcon
        variant="light"
        color="blue"
        size="lg"
        onClick={onAdd}
        radius="md"
      >
        <IconPlus size={16} />
      </ActionIcon>
      {canRemove && (
        <ActionIcon
          variant="light"
          color="red"
          size="lg"
          onClick={() => onRemove(index)}
          radius="md"
        >
          <IconTrash size={16} />
        </ActionIcon>
      )}
    </Flex>
  );
});
