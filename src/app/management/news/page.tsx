'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Center, Alert, Loader, Container, Badge, Text } from '@mantine/core';
import { useNewsQuery } from '@/hooks';
import type { News, CreateNewsRequest, UpdateNewsRequest } from '@/types';
import NewsForm from './NewsForm';

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
        header: 'Has Image',
        key: 'image',
        render: (newsItem) => (
          <Text size="sm">{newsItem.image ? 'Yes' : 'No'}</Text>
        ),
      },
    ],
    []
  );

  const caption = `Showing ${news.length} of total ${totalElements} items.`;

  const handleEdit = useCallback(
    (newsId: string | number) => {
      const newsItem =
        news.find((x) => String(x.id) === String(newsId)) ?? null;
      setSelectedNews(newsItem);
      open();
    },
    [news, open]
  );

  const handleDeleteClick = useCallback(
    (newsId: string | number) => {
      const newsItem =
        news.find((x) => String(x.id) === String(newsId)) ?? null;
      setNewsToDelete(newsItem);
      openDeleteModal();
    },
    [news, openDeleteModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!newsToDelete) return;
    try {
      await deleteNews(String(newsToDelete.id));
      closeDeleteModal();
      setNewsToDelete(null);
    } catch (err) {
      console.error('Failed to delete news:', err);
    }
  }, [deleteNews, newsToDelete, closeDeleteModal]);

  const handleAddNew = useCallback(() => {
    setSelectedNews(null);
    open();
  }, [open]);

  const handleFormSubmit = useCallback(
    async (data: Partial<News>) => {
      if (selectedNews) {
        const payload: UpdateNewsRequest = {
          id: selectedNews.id,
          title: data.title!,
          brief: data.brief!,
          content: data.content!,
          isDisplay: data.isDisplay!,
          image: data.image!,
        };
        await updateNews(String(selectedNews.id), payload);
      } else {
        const payload: CreateNewsRequest = {
          title: data.title!,
          brief: data.brief!,
          content: data.content!,
          isDisplay: data.isDisplay!,
          image: data.image!,
        };
        await createNews(payload);
      }
      setSelectedNews(null);
      close();
    },
    [selectedNews, updateNews, createNews, close]
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
          onSubmit={handleFormSubmit}
        />
      </FormModal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onCancel={() => {
          setNewsToDelete(null);
          closeDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
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
