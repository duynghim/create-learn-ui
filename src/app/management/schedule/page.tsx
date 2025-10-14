'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container } from '@mantine/core';
import { useScheduleQuery } from '@/hooks';
import type {
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from '@/types';
import ScheduleForm from './ScheduleForm';

import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const SchedulePage = () => {
  const [page, setPage] = useState(0);

  const {
    schedules,
    totalElements,
    totalPages,
    isLoading,
    error,
    classOptions,
    isLoadingClassOptions,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useScheduleQuery({ page, pageSize: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null
  );

  const columns = useMemo<ColumnDef<Schedule>[]>(
    () => [
      {
        header: 'ID',
        key: 'id',
        width: 80,
      },
      {
        header: 'Time',
        key: 'time',
        render: (schedule) => schedule.time || '—',
      },
      {
        header: 'Class ID',
        key: 'clazzId',
        render: (schedule) => schedule.clazzId || '—',
      },
    ],
    []
  );

  const caption = useMemo(() => {
    if (totalElements === 0) return 'No schedules found.';
    return `Showing ${schedules.length} of ${totalElements} schedules.`;
  }, [schedules.length, totalElements]);

  const handleEdit = useCallback(
    (scheduleId: string | number) => {
      const schedule =
        schedules.find((x) => String(x.id) === String(scheduleId)) ?? null;
      setSelectedSchedule(schedule);
      open();
    },
    [schedules, open]
  );

  const handleDeleteClick = useCallback(
    (scheduleId: string | number) => {
      const schedule =
        schedules.find((x) => String(x.id) === String(scheduleId)) ?? null;
      setScheduleToDelete(schedule);
      openDeleteModal();
    },
    [schedules, openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!scheduleToDelete) return;
    try {
      await deleteSchedule(String(scheduleToDelete.id));
      closeDeleteModal();
      setScheduleToDelete(null);
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  }, [deleteSchedule, scheduleToDelete, closeDeleteModal]);

  const handleAddNew = useCallback(() => {
    setSelectedSchedule(null);
    open();
  }, [open]);

  const handleFormSubmit = useCallback(
    async (data: Partial<Schedule>) => {
      if (selectedSchedule) {
        const payload: UpdateScheduleRequest = {
          id: selectedSchedule.id,
          time: data.time!,
          clazzId: data.clazzId!,
        };
        await updateSchedule(String(selectedSchedule.id), payload);
      } else {
        const payload: CreateScheduleRequest = {
          time: data.time!,
          clazzId: data.clazzId!,
        };
        await createSchedule(payload);
      }
      setSelectedSchedule(null);
      close();
    },
    [selectedSchedule, updateSchedule, createSchedule, close]
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
      <AddNewButton label="Add New Schedule" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedSchedule(null);
          close();
        }}
        title={selectedSchedule ? 'Edit Schedule' : 'Add Schedule'}
        size="md"
      >
        <ScheduleForm
          initialValues={selectedSchedule}
          onCancel={() => {
            setSelectedSchedule(null);
            close();
          }}
          onSubmit={handleFormSubmit}
          classOptions={classOptions}
          isLoadingClassOptions={isLoadingClassOptions}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setScheduleToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        entityLabel={scheduleToDelete?.time}
      />

      <EntityTable<Schedule>
        data={schedules}
        columns={columns}
        caption={caption}
        getRowId={(schedule) => String(schedule.id)}
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

export default SchedulePage;
