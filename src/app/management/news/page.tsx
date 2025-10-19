'use client';

import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Center,
  Alert,
  Loader,
  Container,
  Badge,
  Text,
  Image,
} from '@mantine/core';
import { useNewsQuery, useEntityCrud } from '@/hooks';
import type { News, CreateNewsRequest, UpdateNewsRequest } from '@/types';
import NewsForm from './NewsForm';
import { truncate } from '@/utils';
import {
  FormModal,
  DeleteConfirmModal,
  ColumnDef,
  EntityTable,
  AddNewButton,
  PaginationBar,
} from '@/components';

const PAGE_SIZE = 10;

const NewsManagementPage = () => {
  const [page, setPage] = useState(0);

  const {
    news,
    totalElements,
    totalPages,
    isLoading,
    error,
    createNews,
    updateNews,
    deleteNews,
  } = useNewsQuery({ page, pageSize: PAGE_SIZE });

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

  const {
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddNew,
    handleFormSubmit,
  } = useEntityCrud({
    entities: news,
    onEdit: setSelectedNews,
    onDelete: (entity) => {
      setNewsToDelete(entity);
      if (entity) {
        openDeleteModal();
      } else {
        closeDeleteModal();
      }
    },
    onAdd: open,
    onClose: close,
    createMutation: createNews,
    updateMutation: updateNews,
    deleteMutation: deleteNews,
    entityName: 'News article',
    getEntityId: (news) => news.id,
    getEntityLabel: (news) => news.title,
    createPayload: (data, isUpdate = false) => {
      if (isUpdate) {
        return {
          id: selectedNews!.id,
          title: data.title!,
          brief: data.brief!,
          content: data.content!,
          isDisplay: data.isDisplay!,
          image: data.image!,
        } as unknown as UpdateNewsRequest;
      } else {
        return {
          title: data.title!,
          brief: data.brief!,
          content: data.content!,
          isDisplay: data.isDisplay!,
          image: data.image!,
        } as CreateNewsRequest;
      }
    },
  });

  const columns: ColumnDef<News>[] = useMemo(
    () => [
      {
        header: 'Title',
        key: 'title',
        render: (newsItem) => (
          <Text fw={500} size="sm">
            {newsItem.title}
          </Text>
        ),
      },
      {
        header: 'Brief',
        key: 'brief',
        render: (newsItem) => (
          <Text size="sm" lineClamp={2}>
            {newsItem.brief}
          </Text>
        ),
      },
      {
        header: 'Status',
        key: 'isDisplay',
        render: (newsItem) => (
          <Badge
            color={newsItem.isDisplay ? 'green' : 'red'}
            variant="light"
            size="sm"
          >
            {newsItem.isDisplay ? 'Published' : 'Draft'}
          </Badge>
        ),
      },

      {
        header: 'Content',
        key: 'content',
        render: (newsItem) => (
          <Text size="sm">{truncate(newsItem.content ?? '', 50)}</Text>
        ),
      },
      {
        header: 'Image',
        key: 'image',
        render: (newsItem) => (
          <Image
            src={newsItem.image}
            alt={newsItem.title}
            maw={50}
            mah={50}
            fit="contain"
          />
        ),
      },
    ],
    []
  );

  const caption = `Showing ${news.length} of total ${totalElements} items.`;

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
      <AddNewButton label="Add New News" onClick={handleAddNew} />

      <FormModal
        opened={opened}
        onCloseAction={() => {
          setSelectedNews(null);
          close();
        }}
        title={selectedNews ? 'Edit News' : 'Add News'}
        size="lg"
      >
        <NewsForm
          initialValues={selectedNews}
          onCancel={() => {
            setSelectedNews(null);
            close();
          }}
          onSubmit={(data) => handleFormSubmit(data, selectedNews)}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setNewsToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={() => handleConfirmDelete(newsToDelete)}
        entityLabel={newsToDelete?.title}
      />

      <EntityTable<News>
        data={news}
        columns={columns}
        caption={caption}
        getRowId={(newsItem) => String(newsItem.id)}
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

export default NewsManagementPage;
