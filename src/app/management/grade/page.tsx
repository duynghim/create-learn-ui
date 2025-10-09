'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Image } from '@mantine/core';
import { useGradeQuery } from '@/hooks';
import type { Grade, CreateGradeRequest, UpdateGradeRequest } from '@/types';
import GradeForm from './GradeForm';

import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const GradesPage = () => {
  const [page, setPage] = useState(0);

  const {
    grades,
    totalElements,
    totalPages,
    isLoading,
    error,
    createGrade,
    updateGrade,
    deleteGrade,
  } = useGradeQuery({ page, pageSize: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [gradeToDelete, setGradeToDelete] = useState<Grade | null>(null);

  const columns: ColumnDef<Grade>[] = useMemo(
    () => [
      {
        header: 'Icon',
        key: 'iconBase64',
        render: (grade) =>
          grade.iconBase64 ? (
            <Image
              src={`data:image/png;base64,${grade.iconBase64}`}
              alt={`${grade.name} icon`}
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

  const caption = `Showing ${grades.length} of total ${totalElements} items.`;

  const handleEdit = useCallback(
    (gradeId: string | number) => {
      const grade =
        grades.find((x) => String(x.id) === String(gradeId)) ?? null;
      setSelectedGrade(grade);
      open();
    },
    [grades, open]
  );

  const handleDeleteClick = useCallback(
    (gradeId: string | number) => {
      const grade =
        grades.find((x) => String(x.id) === String(gradeId)) ?? null;
      setGradeToDelete(grade);
      openDeleteModal();
    },
    [grades, openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!gradeToDelete) return;
    try {
      await deleteGrade(String(gradeToDelete.id));
      closeDeleteModal();
      setGradeToDelete(null);
    } catch (err) {
      console.error('Failed to delete grade:', err);
    }
  }, [deleteGrade, gradeToDelete, closeDeleteModal]);

  const handleAddNew = useCallback(() => {
    setSelectedGrade(null);
    open();
  }, [open]);

  const handleFormSubmit = useCallback(
    async (data: Partial<Grade> & { icon?: File }) => {
      if (selectedGrade) {
        const payload: UpdateGradeRequest = {
          id: selectedGrade.id,
          name: data.name!,
          description: data.description,
          icon: data.icon,
        };
        await updateGrade(String(selectedGrade.id), payload);
      } else {
        const payload: CreateGradeRequest = {
          name: data.name!,
          description: data.description,
          icon: data.icon,
        };
        await createGrade(payload);
      }
      setSelectedGrade(null);
      close();
    },
    [selectedGrade, updateGrade, createGrade, close]
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
      <AddNewButton label="Add New Grade" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedGrade(null);
          close();
        }}
        title={selectedGrade ? 'Edit grade' : 'Add grade'}
        size="sm"
      >
        <GradeForm
          initialValues={selectedGrade}
          onCancel={() => {
            setSelectedGrade(null);
            close();
          }}
          onSubmit={handleFormSubmit}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setGradeToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        entityLabel={gradeToDelete?.name}
      />

      <EntityTable<Grade>
        data={grades}
        columns={columns}
        caption={caption}
        getRowId={(grade) => String(grade.id)}
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

export default GradesPage;
