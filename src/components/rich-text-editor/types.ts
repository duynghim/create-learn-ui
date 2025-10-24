/**
 * Type definitions for RichTextEditor component
 */

import { Editor } from '@tiptap/react';

/**
 * Props for the main RichTextEditor component
 */
export interface RichTextEditorProps {
  /** Current HTML content value */
  value: string;
  /** Callback fired when content changes */
  onChange: (html: string) => void;
  /** Label for the editor */
  label?: string;
  /** Whether to show asterisk for required field */
  withAsterisk?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Minimum height of the editor content area */
  minHeight?: number;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Maximum file size for uploads in bytes */
  maxFileSize?: number;
  /** Accepted file types for image uploads */
  acceptedImageTypes?: string[];
}

/**
 * Props for ImageControls subcomponent
 */
export interface ImageControlsProps {
  /** TipTap editor instance */
  editor: Editor | null;
  /** Whether upload is in progress */
  loading: boolean;
  /** Callback when upload starts */
  onUploadStart: () => void;
  /** Callback when upload ends */
  onUploadEnd: () => void;
  /** Maximum file size in bytes */
  maxFileSize: number;
  /** Accepted image file types */
  acceptedTypes: string[];
  /** Error callback */
  onError: (error: string) => void;
}

/**
 * Props for EditorToolbar subcomponent
 */
export interface EditorToolbarProps {
  /** TipTap editor instance */
  editor: Editor | null;
  /** Image controls component */
  imageControls?: React.ReactNode;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  /** Base64 data URL */
  dataUrl: string;
  /** Original file name */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
}

/**
 * Editor configuration options
 */
export interface EditorConfig {
  /** Minimum height of editor content */
  minHeight: number;
  /** Maximum file size for uploads */
  maxFileSize: number;
  /** Accepted image MIME types */
  acceptedImageTypes: string[];
  /** Whether to allow base64 images */
  allowBase64: boolean;
}

/**
 * Error types for the editor
 */
export enum EditorErrorType {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  EDITOR_NOT_READY = 'EDITOR_NOT_READY',
}

/**
 * Editor error with type and message
 */
export interface EditorError {
  type: EditorErrorType;
  message: string;
  originalError?: Error;
}