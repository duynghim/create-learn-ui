'use client';

import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Image } from '@mantine/core';
import { useTeacherQuery, useEntityCrud } from '@/hooks';
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
      {
        header: 'Image',
        key: 'image',
        render: (newsItem) => (
          <Image
            src={newsItem.profileImageUrl}
            alt={newsItem.firstName}
            maw={50}
            mah={50}
            fit="contain"
          />
        ),
      },
    ],
    []
  );

  const caption = `Showing ${teachers.length} of total ${totalElements} items.`;

  const {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddNew,
    handleFormSubmit,
  } = useEntityCrud<Teacher, CreateTeacherRequest, UpdateTeacherRequest>({
    entities: teachers,
    onEdit: setSelectedTeacher,
    onDelete: (entity) => {
      setTeacherToDelete(entity);
      if (entity) {
        openDeleteModal();
      } else {
        closeDeleteModal();
      }
    },
    onAdd: open,
    onClose: close,
    createMutation: createTeacher,
    updateMutation: updateTeacher,
    deleteMutation: deleteTeacher,
    entityName: 'Teacher',
    getEntityId: (t) => t.id,
    getEntityLabel: (t) => `${t.firstName} ${t.lastName}`,
    createPayload: (data, isUpdate = false) => {
      if (isUpdate) {
        return {
          id: selectedTeacher!.id,
          ...selectedTeacher,
          ...data,
        } as UpdateTeacherRequest;
      }
      return data as CreateTeacherRequest;
    },
  });

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
        size="sm"
      >
        <TeacherForm
          initialValues={selectedTeacher}
          onCancel={() => {
            setSelectedTeacher(null);
            close();
          }}
          onSubmit={(data) => handleFormSubmit(data, selectedTeacher)}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setTeacherToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={() => handleConfirmDelete(teacherToDelete)}
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
