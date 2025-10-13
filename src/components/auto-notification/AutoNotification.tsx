'use client';

import React, { useEffect } from 'react';
import { Notification, NotificationProps } from '@mantine/core';
import {
  IconX,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
} from '@tabler/icons-react';

interface AutoNotificationProps extends Omit<NotificationProps, 'onClose'> {
  type?: 'success' | 'error' | 'warning' | 'info';
  autoClose?: boolean;
  autoCloseDelay?: number;
  onClose?: () => void;
}

const NOTIFICATION_ICONS = {
  success: <IconCheck size={20} />,
  error: <IconX size={20} />,
  warning: <IconAlertCircle size={20} />,
  info: <IconInfoCircle size={20} />,
};

const NOTIFICATION_COLORS = {
  success: 'teal',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
};

const AutoNotification: React.FC<AutoNotificationProps> = ({
  type = 'info',
  autoClose = true,
  autoCloseDelay = 4000,
  onClose,
  color,
  icon,
  children,
  ...props
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const notificationIcon = icon || NOTIFICATION_ICONS[type];
  const notificationColor = color || NOTIFICATION_COLORS[type];

  return (
    <Notification
      icon={notificationIcon}
      color={notificationColor}
      onClose={onClose}
      withCloseButton
      radius="md"
      {...props}
    >
      {children}
    </Notification>
  );
};

export default AutoNotification;
