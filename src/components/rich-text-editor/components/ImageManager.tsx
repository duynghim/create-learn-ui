/**
 * ImageManager component that handles all image-related functionality in the editor
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import ImageContextMenu from './ImageContextMenu';
import { findAllImages, findImageAtPosition } from '../utils/imageUtils';

interface ImageManagerProps {
  /** TipTap editor instance */
  editor: Editor | null;
  /** Whether image deletion is enabled */
  enableDeletion?: boolean;
  /** Whether to show visual feedback on hover */
  showHoverEffects?: boolean;
}

interface ContextMenuState {
  opened: boolean;
  position: { x: number; y: number };
  imagePos: number;
}

/**
 * ImageManager - Manages all image interactions in the editor
 */
const ImageManager: React.FC<ImageManagerProps> = ({
  editor,
  enableDeletion = true,
  showHoverEffects = true,
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    opened: false,
    position: { x: 0, y: 0 },
    imagePos: -1,
  });
  
  const editorRef = useRef<HTMLDivElement>(null);

  /**
   * Handle right-click on images to show context menu
   */
  const handleImageRightClick = useCallback((event: MouseEvent) => {
    if (!editor || !enableDeletion) return;

    const target = event.target as HTMLElement;
    
    // Check if the clicked element is an image
    if (target.tagName === 'IMG' && target.classList.contains('editor-image')) {
      event.preventDefault();
      
      // Find the image position in the document
      const images = findAllImages(editor);
      const imageElement = target;
      const imageSrc = imageElement.getAttribute('src');
      
      const imageInfo = images.find(img => img.src === imageSrc);
      
      if (imageInfo) {
        setContextMenu({
          opened: true,
          position: { x: event.clientX, y: event.clientY },
          imagePos: imageInfo.pos,
        });
      }
    }
  }, [editor, enableDeletion]);

  /**
   * Handle image hover effects
   */
  const handleImageHover = useCallback((event: MouseEvent) => {
    if (!showHoverEffects) return;

    const target = event.target as HTMLElement;
    
    if (target.tagName === 'IMG' && target.classList.contains('editor-image')) {
      target.style.outline = '2px solid var(--mantine-color-blue-5)';
      target.style.cursor = 'pointer';
    }
  }, [showHoverEffects]);

  /**
   * Handle image hover leave
   */
  const handleImageHoverLeave = useCallback((event: MouseEvent) => {
    if (!showHoverEffects) return;

    const target = event.target as HTMLElement;
    
    if (target.tagName === 'IMG' && target.classList.contains('editor-image')) {
      target.style.outline = 'none';
      target.style.cursor = 'default';
    }
  }, [showHoverEffects]);

  /**
   * Close context menu
   */
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, opened: false }));
  }, []);

  /**
   * Handle successful image deletion
   */
  const handleImageDeleted = useCallback((pos: number) => {
    notifications.show({
      title: 'Image Deleted',
      message: 'The image has been successfully removed from the document.',
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  }, []);

  /**
   * Handle image deletion error
   */
  const handleDeleteError = useCallback((error: string) => {
    notifications.show({
      title: 'Deletion Failed',
      message: error,
      color: 'red',
      icon: <IconX size={16} />,
      autoClose: 5000,
    });
  }, []);

  /**
   * Set up event listeners for image interactions
   */
  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;
    
    // Add event listeners
    editorElement.addEventListener('contextmenu', handleImageRightClick);
    editorElement.addEventListener('mouseover', handleImageHover);
    editorElement.addEventListener('mouseout', handleImageHoverLeave);

    // Cleanup
    return () => {
      editorElement.removeEventListener('contextmenu', handleImageRightClick);
      editorElement.removeEventListener('mouseover', handleImageHover);
      editorElement.removeEventListener('mouseout', handleImageHoverLeave);
    };
  }, [editor, handleImageRightClick, handleImageHover, handleImageHoverLeave]);

  /**
   * Close context menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.opened) {
        setContextMenu(prev => ({ ...prev, opened: false }));
      }
    };

    if (contextMenu.opened) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.opened]);

  if (!editor || !enableDeletion) {
    return null;
  }

  return (
    <>
      {/* Context Menu */}
      <ImageContextMenu
        editor={editor}
        imagePos={contextMenu.imagePos}
        opened={contextMenu.opened}
        onClose={handleCloseContextMenu}
        position={contextMenu.position}
        onImageDeleted={handleImageDeleted}
        onDeleteError={handleDeleteError}
      />
    </>
  );
};

export default React.memo(ImageManager);