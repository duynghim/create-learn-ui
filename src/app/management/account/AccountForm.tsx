'use client';

import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Group,
  Box,
  PasswordInput,
  Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Account } from '@/types';

interface AccountFormProps {
  initialValues?: Account | null;
  onSubmit: (data: Partial<Account>) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  email: string;
  password: string;
  username: string;
  phone: string;
  activated: boolean;
}

const AccountForm: React.FC<AccountFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      email: initialValues?.email || '',
      password: '', // Always start with empty password
      username: initialValues?.username || '',
      phone: initialValues?.phone || '',
      activated: initialValues?.activated || false,
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      password: (value) => {
        // For editing, password is optional (only validate if provided)
        if (initialValues) {
          // Editing mode - password is optional
          if (value && value.length < 6)
            return 'Password must be at least 6 characters';
          return null;
        } else {
          // Creating mode - password is required
          if (!value) return 'Password is required';
          if (value.length < 6) return 'Password must be at least 6 characters';
          return null;
        }
      },
      username: (value) => (value ? null : 'Username is required'),
      phone: (value) => {
        if (!value) return 'Phone is required';
        if (!/^\+?[\d\s\-()]+$/.test(value)) return 'Invalid phone format';
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const submitData: Partial<Account> = {
        email: values.email,
        username: values.username,
        phone: values.phone,
        activated: values.activated,
      };

      // Only include password if it's provided (for both create and update)
      if (values.password) {
        submitData.password = values.password;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Email"
        placeholder="Enter email address"
        {...form.getInputProps('email')}
        required
        mb="md"
        radius="md"
        type="email"
        autoComplete="off"
        data-form-type="other"
      />

      <TextInput
        label="Username"
        placeholder="Enter username"
        {...form.getInputProps('username')}
        required
        mb="md"
        radius="md"
        autoComplete="off"
        data-form-type="other"
      />

      <PasswordInput
        label="Password"
        placeholder={
          initialValues
            ? 'Leave empty to keep current password'
            : 'Enter password'
        }
        {...form.getInputProps('password')}
        required={!initialValues}
        mb="md"
        radius="md"
        autoComplete="new-password"
        data-form-type="other"
      />

      <TextInput
        label="Phone"
        placeholder="Enter phone number"
        {...form.getInputProps('phone')}
        required
        mb="md"
        radius="md"
        type="tel"
        autoComplete="off"
        data-form-type="other"
      />

      <Switch
        label="Activate this account"
        description="Toggle to make this account active"
        {...form.getInputProps('activated', { type: 'checkbox' })}
      />

      <Group justify="flex-end" mt="lg">
        <Button
          size="sm"
          radius="md"
          variant="subtle"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button radius="md" size="sm" type="submit" loading={isSubmitting}>
          {initialValues ? 'Update' : 'Create'} Account
        </Button>
      </Group>
    </Box>
  );
};

export default AccountForm;
