'use client';

import React from 'react';
import { Box, Flex, Button, ButtonProps } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

interface AddNewButtonProps extends Omit<ButtonProps, 'children'> {
  label?: string;
  onClick: () => void;
}

const AddNewButton: React.FC<AddNewButtonProps> = ({
  label = 'Add New',
  onClick,
  ...buttonProps
}) => {
  return (
    <Box mb="md">
      <Flex justify="flex-start">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={onClick}
          variant="outline"
          size="sm"
          radius="md"
          color="fresh-cyan"
          {...buttonProps}
        >
          {label}
        </Button>
      </Flex>
    </Box>
  );
};

export default AddNewButton;
