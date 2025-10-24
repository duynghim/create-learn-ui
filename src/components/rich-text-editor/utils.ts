/**
 * Utility functions for RichTextEditor component
 */

import { EditorErrorType, EditorError, FileUploadResult } from './types';
import { DEFAULT_EDITOR_CONFIG, ERROR_MESSAGES } from './constants';

// Re-export image utilities
export * from './utils/imageUtils';

/**
 * Converts a File object to a base64 data URL
 * @param file - The file to convert
 * @returns Promise that resolves to the base64 data URL
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Validates if a file is a valid image
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes
 * @param acceptedTypes - Array of accepted MIME types
 * @returns EditorError if validation fails, null if valid
 */
export const validateImageFile = (
  file: File,
  maxSize: number = DEFAULT_EDITOR_CONFIG.maxFileSize,
  acceptedTypes: string[] = DEFAULT_EDITOR_CONFIG.acceptedImageTypes
): EditorError | null => {
  if (!file) {
    return {
      type: EditorErrorType.INVALID_FILE_TYPE,
      message: ERROR_MESSAGES.NO_FILE_SELECTED,
    };
  }

  if (!acceptedTypes.includes(file.type)) {
    return {
      type: EditorErrorType.INVALID_FILE_TYPE,
      message: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  if (file.size > maxSize) {
    return {
      type: EditorErrorType.FILE_TOO_LARGE,
      message: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  return null;
};

/**
 * Processes a file upload and returns the result
 * @param file - The file to process
 * @param maxSize - Maximum file size in bytes
 * @param acceptedTypes - Array of accepted MIME types
 * @returns Promise that resolves to FileUploadResult or rejects with EditorError
 */
export const processFileUpload = async (
  file: File,
  maxSize?: number,
  acceptedTypes?: string[]
): Promise<FileUploadResult> => {
  const validationError = validateImageFile(file, maxSize, acceptedTypes);
  
  if (validationError) {
    throw validationError;
  }

  try {
    const dataUrl = await fileToBase64(file);
    
    return {
      dataUrl,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error) {
    throw {
      type: EditorErrorType.UPLOAD_FAILED,
      message: ERROR_MESSAGES.UPLOAD_FAILED,
      originalError: error instanceof Error ? error : new Error(String(error)),
    } as EditorError;
  }
};

/**
 * Validates image dimensions and quality to prevent distortion
 * @param file - The image file to validate
 * @param maxWidth - Maximum allowed width (default: 600px)
 * @param maxHeight - Maximum allowed height (default: 400px)
 * @returns Promise that resolves to validation result
 */
export const validateImageDimensions = (
  file: File,
  maxWidth: number = 600,
  maxHeight: number = 400
): Promise<{ isValid: boolean; actualWidth: number; actualHeight: number; message?: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const { naturalWidth, naturalHeight } = img;
      const aspectRatio = naturalWidth / naturalHeight;
      
      // Calculate optimal dimensions maintaining aspect ratio
      let targetWidth = Math.min(naturalWidth, maxWidth);
      let targetHeight = targetWidth / aspectRatio;
      
      if (targetHeight > maxHeight) {
        targetHeight = maxHeight;
        targetWidth = targetHeight * aspectRatio;
      }
      
      // Check if image is too small (might look pixelated when scaled up)
      const minDimension = 100;
      if (naturalWidth < minDimension || naturalHeight < minDimension) {
        resolve({
          isValid: false,
          actualWidth: naturalWidth,
          actualHeight: naturalHeight,
          message: `Image is too small (${naturalWidth}x${naturalHeight}). Minimum recommended size is ${minDimension}x${minDimension} pixels.`
        });
        return;
      }
      
      resolve({
        isValid: true,
        actualWidth: Math.round(targetWidth),
        actualHeight: Math.round(targetHeight)
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        actualWidth: 0,
        actualHeight: 0,
        message: 'Unable to load image for validation.'
      });
    };
    
    img.src = url;
  });
};

/**
 * Enhanced file upload processing with dimension validation
 * @param file - The file to process
 * @param maxSize - Maximum file size in bytes
 * @param acceptedTypes - Array of accepted MIME types
 * @returns Promise that resolves to FileUploadResult or rejects with EditorError
 */
export const processFileUploadWithValidation = async (
  file: File,
  maxSize?: number,
  acceptedTypes?: string[]
): Promise<FileUploadResult & { dimensions: { width: number; height: number } }> => {
  // Basic file validation
  const validationError = validateImageFile(file, maxSize, acceptedTypes);
  
  if (validationError) {
    throw validationError;
  }

  // Dimension validation
  const dimensionValidation = await validateImageDimensions(file);
  
  if (!dimensionValidation.isValid) {
    throw {
      type: EditorErrorType.INVALID_FILE_TYPE,
      message: dimensionValidation.message || 'Image dimensions are not suitable',
    } as EditorError;
  }

  try {
    const dataUrl = await fileToBase64(file);
    
    return {
      dataUrl,
      fileName: file.name,
      fileSize: file.size,
      dimensions: {
        width: dimensionValidation.actualWidth,
        height: dimensionValidation.actualHeight
      }
    };
  } catch (error) {
    throw {
      type: EditorErrorType.UPLOAD_FAILED,
      message: ERROR_MESSAGES.UPLOAD_FAILED,
      originalError: error instanceof Error ? error : new Error(String(error)),
    } as EditorError;
  }
};

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: never[]) => never>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};