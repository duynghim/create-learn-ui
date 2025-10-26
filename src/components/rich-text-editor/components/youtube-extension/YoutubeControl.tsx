import { Tooltip } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useCallback } from 'react';
import { TOOLTIP_DELAYS } from '../../constants';
import { IconBrandYoutube } from '@tabler/icons-react';

interface YoutubeControlsProps {
  editor: any;
  disabled?: boolean;
}
export const YoutubeControls: React.FC<YoutubeControlsProps> = ({
  editor,
  disabled,
}) => {
  const handleYoutubeInsert = useCallback(() => {
    if (!editor) return;

    const url = prompt('Enter YouTube URL:');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        start: 'center',
      });
    }
  }, [editor]);

  return (
    <RichTextEditor.ControlsGroup>
      <Tooltip
        label="Insert YouTube video"
        openDelay={TOOLTIP_DELAYS.OPEN}
        closeDelay={TOOLTIP_DELAYS.CLOSE}
      >
        <RichTextEditor.Control
          onClick={handleYoutubeInsert}
          aria-label="Insert YouTube video"
          disabled={disabled || !editor}
        >
          <IconBrandYoutube size={16} />
        </RichTextEditor.Control>
      </Tooltip>
    </RichTextEditor.ControlsGroup>
  );
};
