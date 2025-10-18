'use client';

import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Badge, Text } from '@mantine/core';
import { useRegistrationQuery, useEntityCrud } from '@/hooks';
import type {
  Registration,
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
} from '@/types';
import RegistrationForm from './RegistrationForm';

import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const RegistrationsPage = () => {
  const [page, setPage] = useState(0);

  const {
    registrations,
    totalElements,
    totalPages,
    isLoading,
    error,
    classOptions,
    isLoadingClassOptions,
    createRegistration,
    updateRegistration,
    deleteRegistration,
  } = useRegistrationQuery({ page, size: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [registrationToDelete, setRegistrationToDelete] =
    useState<Registration | null>(null);

  const {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddNew,
    handleFormSubmit,
  } = useEntityCrud({
    entities: registrations,
    onEdit: setSelectedRegistration,
    onDelete: (entity) => {
      setRegistrationToDelete(entity);
      if (entity) {
        openDeleteModal();
      } else {
        closeDeleteModal();
      }
    },
    onAdd: open,
    onClose: close,
    createMutation: createRegistration,
    updateMutation: updateRegistration,
    deleteMutation: deleteRegistration,
    entityName: 'Registration',
    getEntityId: (r) => r.id,
    getEntityLabel: (r) => r.customerName || r.customerEmail,
    createPayload: (data, isUpdate = false) => {
      if (isUpdate) {
        return {
          id: selectedRegistration!.id,
          customerName: data.customerName!,
          customerEmail: data.customerEmail!,
          phoneNumber: data.phoneNumber!,
          status: data.status!,
          clazzId: data.clazzId!,
        } as UpdateRegistrationRequest;
      } else {
        return {
          customerName: data.customerName!,
          customerEmail: data.customerEmail!,
          phoneNumber: data.phoneNumber!,
          status: data.status || 'PROCESSING',
          clazzId: data.clazzId!,
        } as CreateRegistrationRequest;
      }
    },
  });

  const columns: ColumnDef<Registration>[] = useMemo(
    () => [
      {
        header: 'Customer Name',
        key: 'customerName',
        render: (registration) => <Text>{registration.customerName}</Text>,
      },
      {
        header: 'Email',
        key: 'customerEmail',
        render: (registration) => (
          <Text c="blue">{registration.customerEmail}</Text>
        ),
      },
      {
        header: 'Phone',
        key: 'phoneNumber',
      },
      {
        header: 'Class',
        key: 'classResponse',
        render: (registration) => (
          <Text size="sm" fw={500}>
            {registration.classResponse?.name || 'No class assigned'}
          </Text>
        ),
      },
      {
        header: 'Teacher',
        key: 'teacher',
        render: (registration) => (
          <Text size="sm">
            {registration.classResponse?.teacher
              ? `${registration.classResponse.teacher.firstName} ${registration.classResponse.teacher.lastName}`
              : 'No teacher assigned'}
          </Text>
        ),
      },
      {
        header: 'Price',
        key: 'price',
        render: (registration) => (
          <Text size="sm" fw={500} c="green">
            {registration.classResponse?.price
              ? `$${registration.classResponse.price.toLocaleString()}`
              : 'No price set'}
          </Text>
        ),
      },
      {
        header: 'Status',
        key: 'status',
        render: (registration) => (
          <Badge
            color={
              registration.status === 'PROCESSING'
                ? 'green'
                : registration.status === 'PROCESSED'
                  ? 'red'
                  : 'orange'
            }
            variant="light"
          >
            {registration.status === 'PROCESSING'
              ? 'Processing'
              : registration.status === 'PROCESSED'
                ? 'Processed'
                : 'Processing'}
          </Badge>
        ),
      },
      {
        header: 'Created Date',
        key: 'createdAt',
        render: (registration) => (
          <Text size="sm">
            {registration.createdAt
              ? new Date(registration.createdAt).toLocaleDateString()
              : '-'}
          </Text>
        ),
      },
    ],
    []
  );

  const caption = `Showing ${registrations.length} of total ${totalElements} items.`;

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
      <AddNewButton label="Add New Registration" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedRegistration(null);
          close();
        }}
        title={selectedRegistration ? 'Edit Registration' : 'Add Registration'}
        size="md"
      >
        <RegistrationForm
          initialValues={selectedRegistration}
          onCancel={() => {
            setSelectedRegistration(null);
            close();
          }}
          onSubmit={(data) => handleFormSubmit(data, selectedRegistration)}
          classOptions={classOptions}
          isLoadingClassOptions={isLoadingClassOptions}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setRegistrationToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={() => handleConfirmDelete(registrationToDelete)}
        entityLabel={
          registrationToDelete?.customerName ||
          registrationToDelete?.customerEmail
        }
      />

      <EntityTable<Registration>
        data={registrations}
        columns={columns}
        caption={caption}
        getRowId={(registration) => String(registration.id)}
        onEdit={(row) => handleEdit(row.id)}
        onDelete={(row) => handleDeleteClick(row.id)}
        stickyHeader
        minWidth={900}
      />

      <PaginationBar
        totalPages={totalPages}
        pageZeroBased={page}
        onChangeZeroBased={setPage}
      />
    </Container>
  );
};

export default RegistrationsPage;
