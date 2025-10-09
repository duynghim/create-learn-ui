'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Image } from '@mantine/core';
import { useSubjectQuery } from '@/hooks';
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

  const columns: ColumnDef<Subject>[] = useMemo(
    () => [
      {
        header: 'Icon',
        key: 'iconBase64',
        render: (subject) =>
          subject.iconBase64 ? (
            <Image
              src={`data:image/png;base64,${subject.iconBase64}`}
              alt={`${subject.name} icon`}
              maw={30}
              mah={30}
              fit="contain"
            />
          ) : (
            'No icon'
          ),
      },
      { header: 'Name', key: 'name' },
      { header: 'Description', key: 'description' },
    ],
    []
  );

  const caption = `Showing ${subjects.length} of total ${totalElements} items.`;

  const handleEdit = useCallback(
    (subjectId: string | number) => {
      const subject =
        subjects.find((x) => String(x.id) === String(subjectId)) ?? null;
      setSelectedSubject(subject);
      open();
    },
    [subjects, open]
  );

  const handleDeleteClick = useCallback(
    (subjectId: string | number) => {
      const subject =
        subjects.find((x) => String(x.id) === String(subjectId)) ?? null;
      setSubjectToDelete(subject);
      openDeleteModal();
    },
    [subjects, openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject(String(subjectToDelete.id));
      closeDeleteModal();
      setSubjectToDelete(null);
    } catch (err) {
      console.error('Failed to delete subject:', err);
    }
  }, [deleteSubject, subjectToDelete, closeDeleteModal]);

  const handleAddNew = useCallback(() => {
    setSelectedSubject(null);
    open();
  }, [open]);

  const handleFormSubmit = useCallback(
    async (data: Partial<Subject> & { icon?: File }) => {
      if (selectedSubject) {
        const payload: UpdateSubjectRequest = {
          id: selectedSubject.id,
          name: data.name!,
          description: data.description,
          icon: data.icon,
        };
        await updateSubject(String(selectedSubject.id), payload);
      } else {
        const payload: CreateSubjectRequest = {
          name: data.name!,
          description: data.description,
          icon: data.icon,
        };
        await createSubject(payload);
      }
      setSelectedSubject(null);
      close();
    },
    [selectedSubject, updateSubject, createSubject, close]
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
      <AddNewButton label="Add New Subject" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedSubject(null);
          close();
        }}
        title={selectedSubject ? 'Edit subject' : 'Add subject'}
        size="sm"
      >
        <SubjectForm
          initialValues={selectedSubject}
          onCancel={() => {
            setSelectedSubject(null);
            close();
          }}
          onSubmit={handleFormSubmit}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setSubjectToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        entityLabel={subjectToDelete?.name}
      />

      <EntityTable<Subject>
        data={subjects}
        columns={columns}
        caption={caption}
        getRowId={(subject) => String(subject.id)}
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

export default SubjectPage;
