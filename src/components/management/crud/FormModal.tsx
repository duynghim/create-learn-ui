'use client';

import React from 'react';
import { Modal } from '@mantine/core';

type FormModalProps = {
  readonly opened: boolean;
  readonly title: string;
  readonly onCloseAction: () => void;
  readonly children: React.ReactNode;
  readonly size?: string | number;
};

export default function FormModal({
  opened,
  title,
  onCloseAction,
  children,
  size = 'auto',
}: FormModalProps) {
  return (
    <Modal opened={opened} onClose={onCloseAction} title={title} size={size}>
      {children}
    </Modal>
  );
}
