'use client';

import React, { useState, useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Center,
  Table,
  TableData,
  Alert,
  Loader,
  ActionIcon,
  Group,
  Modal,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTeacherQuery } from '@/hooks';
import type {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/types';
import TeacherForm from './TeacherForm';

const TeachersPage = () => {
  const {
    teachers,
    isLoading,
    error,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  } = useTeacherQuery();

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleEdit = useCallback(
    (teacherId: string) => {
      const t =
        teachers.find((x) => String(x.id) === String(teacherId)) ?? null;
      setSelectedTeacher(t);
      open();
    },
    [teachers, open]
  );

  const handleDelete = useCallback(
    async (teacherId: string) => {
      try {
        await deleteTeacher(teacherId);
      } catch (err) {
        console.error('Failed to delete teacher:', err);
      }
    },
    [deleteTeacher]
  );

  const handleFormSubmit = useCallback(
    async (data: Partial<Teacher>) => {
      if (selectedTeacher) {
        const payload: UpdateTeacherRequest = {
          ...selectedTeacher,
          ...data,
        } as UpdateTeacherRequest;

        await updateTeacher(String(selectedTeacher.id), payload);
      } else {
        const payload: CreateTeacherRequest = data as CreateTeacherRequest;
        await createTeacher(payload);
      }

      setSelectedTeacher(null);
      close();
    },
    [selectedTeacher, updateTeacher, createTeacher, close]
  );

  const tableData: TableData = {
    caption: `${teachers.length} teachers`,
    head: ['First Name', 'Last Name', 'Introduction', 'Gender', 'Actions'],
    body: teachers.map((teacher) => [
      teacher.firstName,
      teacher.lastName,
      teacher.introduction,
      teacher.gender,
      <Group gap="xs" key={teacher.id}>
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => handleEdit(teacher.id)}
          aria-label={`Edit ${teacher.firstName} ${teacher.lastName}`}
        >
          <IconEdit size={16} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => handleDelete(teacher.id)}
          aria-label={`Delete ${teacher.firstName} ${teacher.lastName}`}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>,
    ]),
  };

  if (isLoading) {
    return (
      <Center>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert variant="light" color="red" mt="md">
        Error: {error}
      </Alert>
    );
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setSelectedTeacher(null);
          close();
        }}
        title={selectedTeacher ? 'Edit teacher' : 'Add teacher'}
        centered
        size="auto"
      >
        <TeacherForm
          initialValues={selectedTeacher}
          onCancel={() => {
            setSelectedTeacher(null);
            close();
          }}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <Table.ScrollContainer minWidth={500}>
        <Table stickyHeader data={tableData} />
      </Table.ScrollContainer>
    </>
  );
};

export default TeachersPage;
