'use client';

import React from 'react';
import { Modal, Text, Group, Button } from '@mantine/core';

type DeleteConfirmModalProps = {
  opened: boolean;
  title?: string;
  entityLabel?: string; 
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function DeleteConfirmModal({
  opened,
  title = 'Confirm Delete',
  entityLabel,
  onCancel,
  onConfirm,
}: Readonly<DeleteConfirmModalProps>) {
  return (
    <Modal.Root opened={opened} onClose={onCancel} size="sm">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Text fz="1.2rem" fw={600}>
              {title}
            </Text>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Text mb="md">
            Are you sure you want to delete{' '}
            {entityLabel ? <strong>{entityLabel}</strong> : 'this item'}
            {'? This action cannot be undone.'}
          </Text>
          <Group justify="flex-end" gap="sm" mt={20}>
            <Button size="sm" radius="md" variant="subtle" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" radius="md" color="red" onClick={onConfirm}>
              Delete
            </Button>
          </Group>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
