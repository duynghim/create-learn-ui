/**
 * ImageDeleteButton component for removing images from the rich text editor
 */

'use client';

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  memo,
} from 'react';
import { Button, Tooltip, Loader } from '@mantine/core';
import { IconTrash, IconX } from '@tabler/icons-react';
import type { Editor } from '@tiptap/react';
import { Selection } from 'prosemirror-state';

export type ImageDeleteButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ImageDeleteButtonProps {
  /** TipTap editor instance */
  editor: Editor | null;
  /** Position of the image node to delete (resolved in current doc) */
  imagePos?: number;
  /** Callback when deletion starts */
  onDeleteStart?: () => void;
  /** Callback when deletion completes */
  onDeleteEnd?: () => void;
  /** Callback when deletion fails */
  onDeleteError?: (error: string) => void;
  /** Whether the button should be visible */
  visible?: boolean;
  /** Custom styling for positioning */
  style?: React.CSSProperties;
  /** Size variant of the button */
  size?: ImageDeleteButtonSize;
  /** Whether to show confirmation before deletion */
  requireConfirmation?: boolean;
  /** Optional logger (defaults to console) */
  logger?: Pick<Console, 'error' | 'warn' | 'info' | 'debug'>;
}

/* ------------------------------ helpers ------------------------------ */

const getButtonPx = (size: ImageDeleteButtonSize): number => {
  switch (size) {
    case 'xs':
      return 24;
    case 'sm':
      return 28;
    case 'lg':
      return 36;
    case 'md':
    default:
      return 32;
  }
};

const isValidImageAtPos = (editor: Editor, pos: number): boolean => {
  const { state } = editor;
  if (pos < 0 || pos >= state.doc.content.size) return false;
  const node = state.doc.nodeAt(pos);
  return !!node && node.type.name === 'image';
};

const deleteImageAtPos = (
  editor: Editor,
  pos: number,
  logger: ImageDeleteButtonProps['logger']
) => {
  const { state, view } = editor;

  const node = state.doc.nodeAt(pos);
  if (!node) throw new Error('No node found at the specified position.');
  if (node.type.name !== 'image')
    throw new Error('Node at position is not an image.');

  // Delete the image node
  const tr = state.tr.delete(pos, pos + node.nodeSize);

  // Move cursor near where the image was
  const newPos = Math.min(pos, tr.doc.content.size);
  const $resolved = tr.doc.resolve(newPos);
  tr.setSelection(Selection.near($resolved));

  view.dispatch(tr);
  editor.commands.focus();
  logger?.debug?.('Image deleted at pos:', pos);
};

/* ------------------------------ component ------------------------------ */

const ImageDeleteButtonComponent: React.FC<ImageDeleteButtonProps> = ({
  editor,
  imagePos,
  onDeleteStart,
  onDeleteEnd,
  onDeleteError,
  visible = true,
  style,
  size = 'xs',
  requireConfirmation = false,
  logger = console,
}) => {
  // Hooks must always be called in the same order, so all hooks live before any conditional return.
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const widthPx = useMemo(() => getButtonPx(size), [size]);
  const heightPx = widthPx;

  const tooltipLabel = useMemo(
    () =>
      showConfirmation ? 'Click again to confirm deletion' : 'Delete image',
    [showConfirmation]
  );

  const ariaLabel = useMemo(
    () => (showConfirmation ? 'Confirm image deletion' : 'Delete image'),
    [showConfirmation]
  );

  const buttonColor = showConfirmation ? 'red' : 'gray';
  const canAttemptDelete = !!editor && typeof imagePos === 'number';

  const handleDelete = useCallback(async () => {
    if (!editor || typeof imagePos !== 'number') {
      onDeleteError?.('Editor or image position not available');
      logger?.error?.('Delete aborted: editor or imagePos missing.');
      return;
    }

    if (!isValidImageAtPos(editor, imagePos)) {
      const msg = 'No image found at the specified position';
      onDeleteError?.(msg);
      logger?.warn?.(msg, { imagePos });
      return;
    }

    try {
      setIsDeleting(true);
      onDeleteStart?.();
      deleteImageAtPos(editor, imagePos, logger);
      onDeleteEnd?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete image';
      onDeleteError?.(errorMessage);
      logger?.error?.('Image deletion failed:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  }, [editor, imagePos, logger, onDeleteEnd, onDeleteError, onDeleteStart]);

  const handleClick = useCallback(() => {
    if (!canAttemptDelete) return;
    if (requireConfirmation && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    void handleDelete();
  }, [canAttemptDelete, requireConfirmation, showConfirmation, handleDelete]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      } else if (event.key === 'Escape' && showConfirmation) {
        setShowConfirmation(false);
      }
    },
    [handleClick, showConfirmation]
  );

  // Cancel confirmation on outside click
  useEffect(() => {
    if (!showConfirmation) return;

    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!buttonRef.current || !target) return;
      if (!buttonRef.current.contains(target)) {
        setShowConfirmation(false);
      }
    };

    document.addEventListener('mousedown', onDocMouseDown, { capture: true });
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown, {
        capture: true,
      } as never);
    };
  }, [showConfirmation]);

  // All hooks are above. Now do the conditional render WITHOUT skipping hooks.
  if (!(visible && editor)) return null;

  let buttonContent;

  if (isDeleting) {
    buttonContent = <Loader size={12} color="white" />;
  } else if (showConfirmation) {
    buttonContent = <IconX size={14} />;
  } else {
    buttonContent = <IconTrash size={14} />;
  }

  return (
    <Tooltip
      label={tooltipLabel}
      position="top"
      withArrow
      openDelay={200}
      closeDelay={100}
    >
      <Button
        ref={buttonRef}
        size={size}
        variant="filled"
        color={buttonColor}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDeleting || !canAttemptDelete}
        style={{
          position: 'absolute',
          zIndex: 10,
          borderRadius: '50%',
          minWidth: 'auto',
          width: widthPx,
          height: heightPx,
          padding: 0,
          ...style,
        }}
        aria-label={ariaLabel}
        data-testid="image-delete-button"
      >
        {buttonContent}
      </Button>
    </Tooltip>
  );
};

const areEqual = (
  prev: Readonly<ImageDeleteButtonProps>,
  next: Readonly<ImageDeleteButtonProps>
) =>
  prev.editor === next.editor &&
  prev.imagePos === next.imagePos &&
  prev.visible === next.visible &&
  prev.size === next.size &&
  prev.requireConfirmation === next.requireConfirmation &&
  prev.style === next.style;

export default memo(ImageDeleteButtonComponent, areEqual);
