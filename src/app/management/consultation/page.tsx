'use client';

import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Center,
  Alert,
  Loader,
  Container,
  Text,
  Badge,
} from '@mantine/core';
import { useConsultationQuery, useEntityCrud } from '@/hooks';
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
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const ConsultationsPage = () => {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

  // Construct sort parameter in the format "field,direction"
  const sortParam = sortField ? `${sortField},${sortDirection}` : undefined;

  const {
    consultations,
    totalElements,
    totalPages,
    isLoading,
    error,
    createConsultation,
    updateConsultation,
    deleteConsultation,
  } = useConsultationQuery({
    page,
    size: PAGE_SIZE,
    sort: sortParam,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [consultationToDelete, setConsultationToDelete] =
    useState<Consultation | null>(null);

  const {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleFormSubmit,
  } = useEntityCrud({
    entities: consultations,
    onEdit: setSelectedConsultation,
    onDelete: (entity) => {
      setConsultationToDelete(entity);
      if (entity) {
        openDeleteModal();
      } else {
        closeDeleteModal();
      }
    },
    onAdd: open,
    onClose: close,
    createMutation: createConsultation,
    updateMutation: updateConsultation,
    deleteMutation: deleteConsultation,
    entityName: 'Consultation',
    getEntityId: (c) => c.id,
    getEntityLabel: (c) => c.customerName || c.email,
    createPayload: (data, isUpdate = false) => {
      if (isUpdate) {
        return {
          id: selectedConsultation!.id,
          customerName: data.customerName!,
          phoneNumber: data.phoneNumber!,
          email: data.email!,
          content: data.content!,
          status: data.status!,
        } as unknown as UpdateConsultationRequest;
      } else {
        return {
          customerName: data.customerName!,
          phoneNumber: data.phoneNumber!,
          email: data.email!,
          content: data.content!,
          status: data.status || 'PROCESSING',
        } as CreateConsultationRequest;
      }
    },
  });

  const columns: ColumnDef<Consultation>[] = useMemo(
    () => [
      {
        header: 'Customer Name',
        key: 'customerName',
        render: (consultation) => (
          <Text fw={500} size="0.875rem">
            {consultation.customerName}
          </Text>
        ),
      },
      {
        header: 'Email',
        key: 'email',
        render: (consultation) => (
          <Text
            c="#00b0ff"
            size="0.875rem"
            style={{
              textDecoration: 'none',
              transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {consultation.email}
          </Text>
        ),
      },
      {
        header: 'Phone',
        key: 'phoneNumber',
        render: (consultation) => (
          <Text size="0.875rem">{consultation.phoneNumber}</Text>
        ),
      },
      {
        header: 'Status',
        key: 'status',
        render: (consultation) => (
          <Badge
            color={
              consultation.status === 'PROCESSED' ? 'fresh-green' : 'error-red'
            }
            variant="light"
            size="md"
            styles={{
              root: {
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'none',
              },
            }}
          >
            {consultation.status === 'PROCESSED' ? 'Processed' : 'Processing'}
          </Badge>
        ),
      },
      {
        header: 'Content',
        key: 'content',
        render: (consultation) => (
          <Text truncate maw={200} size="0.875rem">
            {consultation.content}
          </Text>
        ),
      },
      {
        header: 'Created Date',
        key: 'createdDate',
        render: (consultation) => (
          <Text size="0.875rem">
            {consultation.createdAt
              ? new Date(consultation.createdAt).toLocaleDateString()
              : '-'}
          </Text>
        ),
      },
    ],
    []
  );

  const caption = `Showing ${consultations.length} of total ${totalElements} items.`;

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
          onSubmit={(data) => handleFormSubmit(data, selectedConsultation)}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setConsultationToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={() => handleConfirmDelete(consultationToDelete)}
        entityLabel={
          consultationToDelete?.customerName || consultationToDelete?.email
        }
      />

      <EntityTable<Consultation>
        data={consultations}
        columns={columns}
        caption={caption}
        getRowId={(consultation) => String(consultation.id)}
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

export default ConsultationsPage;
