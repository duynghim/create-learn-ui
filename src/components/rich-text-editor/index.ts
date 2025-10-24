/**
 * Main barrel export for RichTextEditor module
 */

// Main component
export { default as RichTextEditor } from './RichTextEditor';
export { default } from './RichTextEditor';

// Types
export type {
  RichTextEditorProps,
  ImageControlsProps,
  EditorToolbarProps,
  FileUploadResult,
  EditorConfig,
  EditorError,
} from './types';
export { EditorErrorType } from './types';

// Constants
export {
  DEFAULT_EDITOR_CONFIG,
  DEFAULT_PLACEHOLDER,
  ERROR_MESSAGES,
  IMAGE_ACCEPT_TYPES,
  TOOLTIP_DELAYS,
} from './constants';

// Utilities
export {
  fileToBase64,
  validateImageFile,
  processFileUpload,
  formatFileSize,
  debounce,
} from './utils';

// Hooks
export { useEditorConfig, useImageUpload } from './hooks';

// Components
export { ImageControls, EditorToolbar } from './components';