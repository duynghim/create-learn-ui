'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container } from '@mantine/core';
import { useTeacherQuery } from '@/hooks';
import type {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/types';
import { capitalizeFirstLetter } from '@/utils';
import TeacherForm from './TeacherForm';

import {
  PaginationBar,
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
} from '@/components';

const PAGE_SIZE = 10;

const TeachersPage = () => {
  const [page, setPage] = useState(0);
  const {
    teachers,
    totalElements,
    totalPages,
    isLoading,
    error,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  } = useTeacherQuery({ page, size: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const columns: ColumnDef<Teacher>[] = useMemo(
    () => [
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Introduction', key: 'introduction' },
      {
        header: 'Gender',
        key: 'gender',
        render: (t) => capitalizeFirstLetter(t.gender),
      },
    ],
    []
  );

  const caption = `Showing ${teachers.length} of total ${totalElements} items.`;

  const handleEdit = useCallback(
    (teacherId: string | number) => {
      const t =
        teachers.find((x) => String(x.id) === String(teacherId)) ?? null;
      setSelectedTeacher(t);
      open();
    },
    [teachers, open]
  );

  const handleDeleteClick = useCallback(
    (teacherId: string | number) => {
      const t =
        teachers.find((x) => String(x.id) === String(teacherId)) ?? null;
      setTeacherToDelete(t);
      openDeleteModal();
    },
    [teachers, openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!teacherToDelete) return;
    try {
      await deleteTeacher(String(teacherToDelete.id));
      closeDeleteModal();
      setTeacherToDelete(null);
    } catch (err) {
      console.error('Failed to delete teacher:', err);
    }
  }, [deleteTeacher, teacherToDelete, closeDeleteModal]);

  const handleAddNew = useCallback(() => {
    setSelectedTeacher(null);
    open();
  }, [open]);

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

  if (isLoading) {
    return (
      <Center h="100%">
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
    <Container fluid p={0} maw="100%">
      <AddNewButton label="Add New Teacher" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedTeacher(null);
          close();
        }}
        title={selectedTeacher ? 'Edit teacher' : 'Add teacher'}
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
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setTeacherToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        entityLabel={
          teacherToDelete
            ? `${teacherToDelete.firstName} ${teacherToDelete.lastName}`
            : undefined
        }
      />

      <EntityTable<Teacher>
        data={teachers}
        columns={columns}
        caption={caption}
        getRowId={(t) => String(t.id)}
        onEdit={(row) => handleEdit(row.id)}
        onDelete={(row) => handleDeleteClick(row.id)}
        stickyHeader
        minWidth={500}
      />

      <PaginationBar
        totalPages={totalPages}
        pageZeroBased={page}
        onChangeZeroBased={setPage}
      />
    </Container>
  );
};

export default TeachersPage;
