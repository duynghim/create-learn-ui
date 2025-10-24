/**
 * Utility functions for image manipulation in the rich text editor
 */

import { Editor } from '@tiptap/react';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';

/**
 * Information about an image node in the editor
 */
export interface ImageNodeInfo {
  /** Position of the image node */
  pos: number;
  /** The image node itself */
  node: ProseMirrorNode;
  /** Size of the node (including any marks) */
  size: number;
  /** Source URL of the image */
  src: string;
  /** Alt text of the image */
  alt?: string;
}

/**
 * Result of an image deletion operation
 */
export interface ImageDeletionResult {
  /** Whether the deletion was successful */
  success: boolean;
  /** Error message if deletion failed */
  error?: string;
  /** New cursor position after deletion */
  newCursorPos?: number;
  /** Whether this was the last image in the document */
  wasLastImage?: boolean;
}

/**
 * Finds all image nodes in the editor document
 * @param editor - The TipTap editor instance
 * @returns Array of image node information
 */
export const findAllImages = (editor: Editor): ImageNodeInfo[] => {
  if (!editor) return [];

  const images: ImageNodeInfo[] = [];
  const { state } = editor;

  state.doc.descendants((node, pos) => {
    if (node.type.name === 'image') {
      images.push({
        pos,
        node,
        size: node.nodeSize,
        src: node.attrs.src || '',
        alt: node.attrs.alt,
      });
    }
  });

  return images;
};

/**
 * Finds the image node at a specific position
 * @param editor - The TipTap editor instance
 * @param pos - Position to check
 * @returns Image node information or null if not found
 */
export const findImageAtPosition = (
  editor: Editor,
  pos: number
): ImageNodeInfo | null => {
  if (!editor) return null;

  const { state } = editor;
  const node = state.doc.nodeAt(pos);

  if (!node || node.type.name !== 'image') {
    return null;
  }

  return {
    pos,
    node,
    size: node.nodeSize,
    src: node.attrs.src || '',
    alt: node.attrs.alt,
  };
};

/**
 * Finds the image node that contains or is near the current selection
 * @param editor - The TipTap editor instance
 * @returns Image node information or null if not found
 */
export const findSelectedImage = (editor: Editor): ImageNodeInfo | null => {
  if (!editor) return null;

  const { state } = editor;
  const { selection } = state;

  // Check if selection is directly on an image
  const node = state.doc.nodeAt(selection.from);
  if (node && node.type.name === 'image') {
    return {
      pos: selection.from,
      node,
      size: node.nodeSize,
      src: node.attrs.src || '',
      alt: node.attrs.alt,
    };
  }

  // Check if there's an image near the selection
  let imageInfo: ImageNodeInfo | null = null;
  state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
    if (node.type.name === 'image' && !imageInfo) {
      imageInfo = {
        pos,
        node,
        size: node.nodeSize,
        src: node.attrs.src || '',
        alt: node.attrs.alt,
      };
    }
  });

  return imageInfo;
};

/**
 * Safely deletes an image node from the editor
 * @param editor - The TipTap editor instance
 * @param imageInfo - Information about the image to delete
 * @returns Result of the deletion operation
 */
export const deleteImage = (
  editor: Editor,
  imageInfo: ImageNodeInfo
): ImageDeletionResult => {
  if (!editor || !imageInfo) {
    return {
      success: false,
      error: 'Editor or image information not available',
    };
  }

  try {
    const { state } = editor;
    const { pos, size } = imageInfo;

    // Check if the image still exists at the specified position
    const currentNode = state.doc.nodeAt(pos);
    if (!currentNode || currentNode.type.name !== 'image') {
      return {
        success: false,
        error: 'Image no longer exists at the specified position',
      };
    }

    // Count total images before deletion
    const allImages = findAllImages(editor);
    const wasLastImage = allImages.length === 1;

    // Create transaction to delete the image
    const transaction = state.tr.delete(pos, pos + size);

    // Calculate new cursor position
    let newCursorPos = pos;

    // If we're deleting at the end of the document, move cursor back
    if (pos >= transaction.doc.content.size) {
      newCursorPos = Math.max(0, transaction.doc.content.size - 1);
    }

    // Set selection to a safe position
    const resolvedPos = transaction.doc.resolve(newCursorPos);
    transaction.setSelection(Selection.near(resolvedPos));

    // Apply the transaction
    editor.view.dispatch(transaction);

    return {
      success: true,
      newCursorPos,
      wasLastImage,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Deletes the currently selected image (if any)
 * @param editor - The TipTap editor instance
 * @returns Result of the deletion operation
 */
export const deleteSelectedImage = (editor: Editor): ImageDeletionResult => {
  const selectedImage = findSelectedImage(editor);

  if (!selectedImage) {
    return {
      success: false,
      error: 'No image is currently selected',
    };
  }

  return deleteImage(editor, selectedImage);
};

/**
 * Checks if the current selection contains or is adjacent to an image
 * @param editor - The TipTap editor instance
 * @returns True if an image is selected or nearby
 */
export const isImageSelected = (editor: Editor): boolean => {
  return findSelectedImage(editor) !== null;
};

/**
 * Gets the total number of images in the document
 * @param editor - The TipTap editor instance
 * @returns Number of images in the document
 */
export const getImageCount = (editor: Editor): number => {
  return findAllImages(editor).length;
};

/**
 * Validates if an image deletion operation is safe to perform
 * @param editor - The TipTap editor instance
 * @param imageInfo - Information about the image to delete
 * @returns Validation result with any warnings
 */
export const validateImageDeletion = (
  editor: Editor,
  imageInfo: ImageNodeInfo
): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  if (!editor) {
    return { isValid: false, warnings: ['Editor is not available'] };
  }

  if (!imageInfo) {
    return { isValid: false, warnings: ['Image information is not available'] };
  }

  // Check if image still exists
  const currentNode = editor.state.doc.nodeAt(imageInfo.pos);
  if (!currentNode || currentNode.type.name !== 'image') {
    return {
      isValid: false,
      warnings: ['Image no longer exists at the specified position'],
    };
  }

  // Check if this is the last image
  const imageCount = getImageCount(editor);
  if (imageCount === 1) {
    warnings.push('This is the last image in the document');
  }

  // Check if document will be empty after deletion
  const { state } = editor;
  const docSize = state.doc.content.size;
  if (docSize <= imageInfo.size + 2) {
    // +2 for potential paragraph wrapper
    warnings.push('Document may become empty after deletion');
  }

  return { isValid: true, warnings };
};
