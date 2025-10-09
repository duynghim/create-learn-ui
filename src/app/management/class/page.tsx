'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Badge, Text } from '@mantine/core';
import {
  useClassQuery,
  useSubjectQuery,
  useGradeQuery,
  useTeacherQuery,
} from '@/hooks';
import type { Class, CreateClassRequest, UpdateClassRequest } from '@/types';
import ClassForm from './ClassForm';

import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const ClassesPage = () => {
  const [page, setPage] = useState(0);

  const {
    classes,
    totalElements,
    totalPages,
    isLoading,
    error,
    createClass,
    updateClass,
    deleteClass,
  } = useClassQuery({ page, pageSize: PAGE_SIZE });

  // Get data for form dropdowns
  const { subjects } = useSubjectQuery({ page: 0, size: 100 });
  const { grades } = useGradeQuery({ page: 0, size: 100 });
  const { teachers } = useTeacherQuery({ page: 0, size: 100 });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  const columns = useMemo<ColumnDef<Class>[]>(
    () => [
      {
        header: 'Name',
        key: 'name',
        render: (classItem) => (
          <Text fw={500} size="sm">
            {classItem.name}
          </Text>
        ),
      },
      {
        header: 'Brief',
        key: 'brief',
        render: (classItem) => (
          <Text size="sm" lineClamp={2}>
            {classItem.brief}
          </Text>
        ),
      },
      {
        header: 'Teacher',
        key: 'teacher',
        render: (classItem) => (
          <Text size="sm">
            {classItem.teacher
              ? `${classItem.teacher.firstName} ${classItem.teacher.lastName}`
              : '—'}
          </Text>
        ),
      },
      {
        header: 'Price',
        key: 'price',
        render: (classItem) => (
          <Text size="sm" fw={500}>
            ${classItem.price}
          </Text>
        ),
      },
      {
        header: 'Status',
        key: 'isDisplayed',
        render: (classItem) => (
          <Badge
            color={classItem.isDisplayed ? 'green' : 'red'}
            variant="light"
            size="sm"
          >
            {classItem.isDisplayed ? 'Active' : 'Hidden'}
          </Badge>
        ),
      },
      {
        header: 'Subjects',
        key: 'subjects',
        render: (classItem) => (
          <Text size="sm">{classItem.subjects?.length || 0} subject(s)</Text>
        ),
      },
    ],
    []
  );

  const caption = useMemo(() => {
    if (totalElements === 0) return 'No classes found.';
    return `Showing ${classes.length} of ${totalElements} classes.`;
  }, [classes.length, totalElements]);

  const handleEdit = useCallback(
    (classId: string | number) => {
      const classItem =
        classes.find((x) => String(x.id) === String(classId)) ?? null;
      setSelectedClass(classItem);
      open();
    },
    [classes, open]
  );

  const handleDeleteClick = useCallback(
    (classId: string | number) => {
      const classItem =
        classes.find((x) => String(x.id) === String(classId)) ?? null;
      setClassToDelete(classItem);
      openDeleteModal();
    },
    [classes, openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!classToDelete) return;
    try {
      await deleteClass(String(classToDelete.id));
      closeDeleteModal();
      setClassToDelete(null);
    } catch (err) {
      console.error('Failed to delete class:', err);
    }
  }, [deleteClass, classToDelete, closeDeleteModal]);

  const handleAddNew = useCallback(() => {
    setSelectedClass(null);
    open();
  }, [open]);

  const handleFormSubmit = useCallback(
    async (data: Partial<Class>) => {
      if (selectedClass) {
        const payload: UpdateClassRequest = {
          id: selectedClass.id,
          name: data.name!,
          brief: data.brief!,
          description: data.description!,
          image: data.image!,
          requirement: data.requirement!,
          guarantee: data.guarantee!,
          isDisplayed: data.isDisplayed!,
          subjectIds: data.subjectIds!,
          gradeIds: data.gradeIds!,
          teacherId: data.teacherId!,
          price: data.price!,
        };
        await updateClass(String(selectedClass.id), payload);
      } else {
        const payload: CreateClassRequest = {
          name: data.name!,
          brief: data.brief!,
          description: data.description!,
          image: data.image!,
          requirement: data.requirement!,
          guarantee: data.guarantee!,
          isDisplayed: data.isDisplayed!,
          subjectIds: data.subjectIds!,
          gradeIds: data.gradeIds!,
          teacherId: data.teacherId!,
          price: data.price!,
        };
        await createClass(payload);
      }
      setSelectedClass(null);
      close();
    },
    [selectedClass, updateClass, createClass, close]
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
      <AddNewButton label="Add New Class" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedClass(null);
          close();
        }}
        title={selectedClass ? 'Edit Class' : 'Add Class'}
        size="md"
      >
        <ClassForm
          initialValues={selectedClass}
          onCancel={() => {
            setSelectedClass(null);
            close();
          }}
          onSubmit={handleFormSubmit}
          subjects={subjects}
          grades={grades}
          teachers={teachers}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setClassToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        entityLabel={classToDelete?.name}
      />

      <EntityTable<Class>
        data={classes}
        columns={columns}
        caption={caption}
        getRowId={(classItem) => String(classItem.id)}
        onEdit={(row) => handleEdit(row.id)}
        onDelete={(row) => handleDeleteClick(row.id)}
        stickyHeader
        minWidth={800}
      />

      <PaginationBar
        totalPages={totalPages}
        pageZeroBased={page}
        onChangeZeroBased={setPage}
      />
    </Container>
  );
};

export default ClassesPage;
