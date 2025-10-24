/**
 * Constants for RichTextEditor component
 */

import { EditorConfig } from './types';

/**
 * Default configuration for the editor
 */
export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  minHeight: 220,
  maxFileSize: 4 * 1024 * 1024, // 4MB
  acceptedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  allowBase64: true,
};

/**
 * Default placeholder text
 */
export const DEFAULT_PLACEHOLDER = 'Write the full content here…';

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 4MB',
  INVALID_FILE_TYPE: 'Please select a valid image file (JPEG, PNG, GIF, WebP)',
  UPLOAD_FAILED: 'Failed to upload the image. Please try again.',
  EDITOR_NOT_READY: 'Editor is not ready. Please wait and try again.',
  NO_FILE_SELECTED: 'No file was selected',
} as const;

/**
 * File input accept attribute value
 */
export const IMAGE_ACCEPT_TYPES = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';

/**
 * Tooltip delays
 */
export const TOOLTIP_DELAYS = {
  OPEN: 200,
  CLOSE: 100,
} as const;