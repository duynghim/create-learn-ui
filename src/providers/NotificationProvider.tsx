'use client';

import React, { createContext, useState, useCallback } from 'react';
import { Portal, Stack } from '@mantine/core';
import { AutoNotification } from '@/components';

interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, 'id'>) => void;
  hideNotification: (id: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showNotification = useCallback(
    (notification: Omit<NotificationData, 'id'>) => {
      const id = generateId();
      const newNotification: NotificationData = {
        id,
        autoClose: true,
        autoCloseDelay: 4000,
        ...notification,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove if autoClose is enabled
      if (newNotification.autoClose) {
        setTimeout(() => {
          hideNotification(id);
        }, newNotification.autoCloseDelay);
      }
    },
    [generateId, hideNotification]
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      showNotification({
        type: 'success',
        title: title || 'Success',
        message,
      });
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      showNotification({
        type: 'error',
        title: title || 'Error',
        message,
        autoCloseDelay: 6000, // Longer delay for errors
      });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      showNotification({
        type: 'warning',
        title: title || 'Warning',
        message,
      });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      showNotification({
        type: 'info',
        title: title || 'Info',
        message,
      });
    },
    [showNotification]
  );

  const contextValue: NotificationContextType = React.useMemo(
    () => ({
      showNotification,
      hideNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [
      showNotification,
      hideNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Render notifications */}
      <Portal>
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: 400,
          }}
        >
          <Stack gap="sm">
            {notifications.map((notification) => (
              <AutoNotification
                key={notification.id}
                type={notification.type}
                title={notification.title}
                autoClose={notification.autoClose}
                autoCloseDelay={notification.autoCloseDelay}
                onClose={() => hideNotification(notification.id)}
              >
                {notification.message}
              </AutoNotification>
            ))}
          </Stack>
        </div>
      </Portal>
    </NotificationContext.Provider>
  );
};
