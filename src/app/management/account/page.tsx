'use client';

import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Text, Badge } from '@mantine/core';
import { useAccountQuery, useEntityCrud } from '@/hooks';
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/types';
import AccountForm from './AccountForm';

import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const AccountsPage = () => {
  const [page, setPage] = useState(0);

  const {
    accounts,
    totalElements,
    totalPages,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccountQuery({ page, size: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddNew,
    handleFormSubmit,
  } = useEntityCrud({
    entities: accounts,
    onEdit: setSelectedAccount,
    onDelete: (entity) => {
      setAccountToDelete(entity);
      if (entity) {
        openDeleteModal();
      } else {
        closeDeleteModal();
      }
    },
    onAdd: open,
    onClose: close,
    createMutation: createAccount,
    updateMutation: updateAccount,
    deleteMutation: deleteAccount,
    entityName: 'Account',
    getEntityId: (a) => a.id,
    getEntityLabel: (a) => a.username || a.email,
    createPayload: (data, isUpdate = false) => {
      if (isUpdate) {
        return {
          id: selectedAccount!.id,
          email: data.email!,
          username: data.username!,
          password: data.password!,
          phone: data.phone!,
          activated: data.activated!,
        } as UpdateAccountRequest;
      } else {
        return {
          email: data.email!,
          username: data.username!,
          password: data.password!,
          phone: data.phone!,
          activated: data.activated!,
        } as CreateAccountRequest;
      }
    },
  });

  const columns: ColumnDef<Account>[] = useMemo(
    () => [
      {
        header: 'Username',
        key: 'username',
        render: (account) => <Text fw={500}>{account.username}</Text>,
      },
      {
        header: 'Email',
        key: 'email',
        render: (account) => <Text c="blue">{account.email}</Text>,
      },
      {
        header: 'Phone',
        key: 'phone',
      },
      {
        header: 'Status',
        key: 'activated',
        render: (account) => (
          <Badge color={account.activated ? 'green' : 'red'} variant="light">
            {account.activated ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    []
  );

  const caption = `Showing ${accounts.length} of total ${totalElements} items.`;

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
      <AddNewButton label="Add New Account" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedAccount(null);
          close();
        }}
        title={selectedAccount ? 'Edit Account' : 'Add Account'}
        size="md"
      >
        <AccountForm
          initialValues={selectedAccount}
          onCancel={() => {
            setSelectedAccount(null);
            close();
          }}
          onSubmit={(data) => handleFormSubmit(data, selectedAccount)}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setAccountToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={() => handleConfirmDelete(accountToDelete)}
        entityLabel={accountToDelete?.username || accountToDelete?.email}
      />

      <EntityTable<Account>
        data={accounts}
        columns={columns}
        caption={caption}
        getRowId={(account) => String(account.id)}
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

export default AccountsPage;
