'use client';

import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Text, Badge, Group, Select, Button } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconX } from '@tabler/icons-react';
import { useConsultationQuery, useEntityCrud } from '@/hooks';
import type { Consultation, CreateConsultationRequest, UpdateConsultationRequest } from '@/types';
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
    sort: sortParam 
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [consultationToDelete, setConsultationToDelete] = useState<Consultation | null>(null);

  const {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddNew,
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
        } as UpdateConsultationRequest;
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

  const sortOptions = [
    { value: 'status', label: 'Status' },
    { value: 'createdDate', label: 'Created Date' }, // Changed from createdAt to createdDate
  ];

  const handleSortChange = (field: string | null) => {
    if (!field) {
      setSortField('');
      setSortDirection('ASC');
      setPage(0); // Reset to first page when clearing sort
      return;
    }

    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // New field, start with ASC
      setSortField(field);
      setSortDirection('ASC');
    }
    setPage(0); // Reset to first page when changing sort
  };

  const clearSort = () => {
    setSortField('');
    setSortDirection('ASC');
    setPage(0);
  };

  const columns: ColumnDef<Consultation>[] = useMemo(
    () => [
      { 
        header: 'Customer Name', 
        key: 'customerName',
        render: (consultation) => (
          <Text fw={500}>{consultation.customerName}</Text>
        )
      },
      { 
        header: 'Email', 
        key: 'email',
        render: (consultation) => (
          <Text c="blue">{consultation.email}</Text>
        )
      },
      { 
        header: 'Phone', 
        key: 'phoneNumber' 
      },
      {
        header: 'Status',
        key: 'status',
        render: (consultation) => (
          <Badge 
            color={consultation.status === 'PROCESSED' ? 'green' : 'orange'} 
            variant="light"
          >
            {consultation.status === 'PROCESSED' ? 'Processed' : 'Processing'}
          </Badge>
        ),
      },
      {
        header: 'Content',
        key: 'content',
        render: (consultation) => (
          <Text truncate maw={200}>
            {consultation.content}
          </Text>
        ),
      },
      {
        header: 'Created Date',
        key: 'createdDate',
        render: (consultation) => (
          <Text size="sm">
            {consultation.createdAt ? new Date(consultation.createdAt).toLocaleDateString() : '-'}
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
      <Group justify="space-between" mb="md">
        <AddNewButton label="Add New Consultation" onClick={handleAddNew} />
        
        <Group gap="sm">
          <Select
            placeholder="Sort by field"
            data={sortOptions}
            value={sortField || null}
            onChange={handleSortChange}
            clearable
            size="sm"
            w={150}
          />
          
          {sortField && (
            <Button
              variant="light"
              size="sm"
              leftSection={sortDirection === 'ASC' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />}
              onClick={() => setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')}
            >
              {sortDirection === 'ASC' ? 'Ascending' : 'Descending'}
            </Button>
          )}
          
          {sortField && (
            <Button
              variant="subtle"
              size="sm"
              leftSection={<IconX size={16} />}
              onClick={clearSort}
              color="red"
            >
              Clear
            </Button>
          )}
        </Group>
      </Group>

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
          onSubmit={(data) => handleFormSubmit(data, selectedConsultation, !!selectedConsultation)}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setConsultationToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={() => handleConfirmDelete(consultationToDelete)}
        entityLabel={consultationToDelete?.customerName || consultationToDelete?.email}
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