'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Text, Anchor } from '@mantine/core';
import { useConsultationQuery } from '@/hooks';
import type {
  Consultation,
  CreateConsultationRequest,
  UpdateConsultationRequest,
} from '@/types';
import ConsultationForm from './ConsultationForm';

import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const ConsultationsPage = () => {
  const [page, setPage] = useState(0);

  const {
    consultations,
    totalElements,
    totalPages,
    isLoading,
    error,
    createConsultation,
    updateConsultation,
    deleteConsultation,
  } = useConsultationQuery({ page, pageSize: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [consultationToDelete, setConsultationToDelete] =
    useState<Consultation | null>(null);

  const columns = useMemo<ColumnDef<Consultation>[]>(
    () => [
      {
        header: 'Customer Name',
        key: 'customerName',
        render: (consultation) => (
          <Text fw={500} size="sm">
            {consultation.customerName}
          </Text>
        ),
      },
      {
        header: 'Phone Number',
        key: 'phoneNumber',
        render: (consultation) => (
          <Text size="sm">{consultation.phoneNumber}</Text>
        ),
      },
      {
        header: 'Email',
        key: 'email',
        render: (consultation) => (
          <Anchor href={`mailto:${consultation.email}`} size="sm">
            {consultation.email}
          </Anchor>
        ),
      },
      {
        header: 'Content',
        key: 'content',
        render: (consultation) => (
          <Text size="sm" lineClamp={2} maw={300}>
            {consultation.content}
          </Text>
        ),
      },
      {
        header: 'Status',
        key: 'status',
        render: (consultation) => (
          <Text size="sm" lineClamp={2} maw={300}>
            {consultation.status}
          </Text>
        ),
      },
    ],
    []
  );

  const caption = useMemo(() => {
    if (totalElements === 0) return 'No consultations found.';
    return `Showing ${consultations.length} of ${totalElements} consultations.`;
  }, [consultations.length, totalElements]);

  const handleEdit = useCallback(
    (consultationId: string | number) => {
      const consultation =
        consultations.find((x) => String(x.id) === String(consultationId)) ??
        null;
      setSelectedConsultation(consultation);
      open();
    },
    [consultations, open]
  );

  const handleDeleteClick = useCallback(
    (consultationId: string | number) => {
      const consultation =
        consultations.find((x) => String(x.id) === String(consultationId)) ??
        null;
      setConsultationToDelete(consultation);
      openDeleteModal();
    },
    [consultations, openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!consultationToDelete) return;
    try {
      await deleteConsultation(String(consultationToDelete.id));
      closeDeleteModal();
      setConsultationToDelete(null);
    } catch (err) {
      console.error('Failed to delete consultation:', err);
    }
  }, [deleteConsultation, consultationToDelete, closeDeleteModal]);

  const handleAddNew = useCallback(() => {
    setSelectedConsultation(null);
    open();
  }, [open]);

  const handleFormSubmit = useCallback(
    async (data: Partial<Consultation>) => {
      if (selectedConsultation) {
        const payload: UpdateConsultationRequest = {
          id: selectedConsultation.id,
          customerName: data.customerName!,
          phoneNumber: data.phoneNumber!,
          email: data.email!,
          content: data.content!,
        };
        await updateConsultation(String(selectedConsultation.id), payload);
      } else {
        const payload: CreateConsultationRequest = {
          customerName: data.customerName!,
          phoneNumber: data.phoneNumber!,
          email: data.email!,
          content: data.content!,
        };
        await createConsultation(payload);
      }
      setSelectedConsultation(null);
      close();
    },
    [selectedConsultation, updateConsultation, createConsultation, close]
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
      <AddNewButton label="Add New Consultation" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedConsultation(null);
          close();
        }}
        title={selectedConsultation ? 'Edit Consultation' : 'Add Consultation'}
        size="md"
      >
        <ConsultationForm
          initialValues={selectedConsultation}
          onCancel={() => {
            setSelectedConsultation(null);
            close();
          }}
          onSubmit={handleFormSubmit}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setConsultationToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        entityLabel={consultationToDelete?.customerName}
      />

      <EntityTable<Consultation>
        data={consultations}
        columns={columns}
        caption={caption}
        getRowId={(consultation) => String(consultation.id)}
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

export default ConsultationsPage;
