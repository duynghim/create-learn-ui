'use client';

import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Text, Image } from '@mantine/core';
import { useSubjectQuery, useEntityCrud } from '@/hooks';
import type {
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from '@/types';
import SubjectForm from './subject/SubjectForm';

import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const SubjectPage = () => {
  const [page, setPage] = useState(0);

  const {
    subjects,
    totalElements,
    totalPages,
    isLoading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjectQuery({ page, pageSize: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddNew,
    handleFormSubmit,
  } = useEntityCrud({
    entities: subjects,
    onEdit: setSelectedSubject,
    onDelete: (entity) => {
      setSubjectToDelete(entity);
      if (entity) {
        openDeleteModal();
      } else {
        closeDeleteModal();
      }
    },
    onAdd: open,
    onClose: close,
    createMutation: createSubject,
    updateMutation: updateSubject,
    deleteMutation: deleteSubject,
    entityName: 'Subject',
    getEntityId: (s) => s.id,
    getEntityLabel: (s) => s.name,
    createPayload: (data, isUpdate = false) => {
      if (isUpdate) {
        return {
          id: selectedSubject!.id,
          name: data.name!,
          description: data.description!,
          icon: data.icon ? (data.icon as unknown as File) : undefined,
          iconBase64: data.iconBase64,
        } as UpdateSubjectRequest;
      } else {
        return {
          name: data.name!,
          description: data.description!,
          icon: data.icon ? (data.icon as unknown as File) : undefined,
        } as CreateSubjectRequest;
      }
    },
  });

  const columns: ColumnDef<Subject>[] = useMemo(
    () => [
      {
        header: 'Icon',
        key: 'iconBase64',
        render: (subject) =>
          subject.iconBase64 ? (
            <Image
              src={`data:image/png;base64,${subject.iconBase64}`}
              alt={subject.name ?? 'icon'}
              maw={30}
              mah={30}
              fit="contain"
            />
          ) : (
            <Text size="sm">No icon</Text>
          ),
      },
      {
        header: 'Name',
        key: 'name',
        render: (s) => <Text fw={500}>{s.name}</Text>,
      },
      {
        header: 'Description',
        key: 'description',
        render: (s) => <Text size="sm">{s.description ?? ''}</Text>,
      },
    ],
    []
  );

  const caption = `Showing ${subjects.length} of total ${totalElements} items.`;

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
      <AddNewButton label="Add New Subject" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedSubject(null);
          close();
        }}
        title={selectedSubject ? 'Edit Subject' : 'Add Subject'}
        size="md"
      >
        <SubjectForm
          initialValues={selectedSubject}
          onCancel={() => {
            setSelectedSubject(null);
            close();
          }}
          onSubmit={(data) => handleFormSubmit(data, selectedSubject)}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setSubjectToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={() => handleConfirmDelete(subjectToDelete)}
        entityLabel={subjectToDelete ? subjectToDelete.name : undefined}
      />

      <EntityTable<Subject>
        data={subjects}
        columns={columns}
        caption={caption}
        getRowId={(s) => String(s.id)}
        onEdit={(row) => handleEdit(row.id)}
        onDelete={(row) => handleDeleteClick(row.id)}
        stickyHeader
        minWidth={700}
      />

      <PaginationBar
        totalPages={totalPages}
        pageZeroBased={page}
        onChangeZeroBased={setPage}
      />
    </Container>
  );
};

export default SubjectPage;
