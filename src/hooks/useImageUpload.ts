'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type UploaderFn = (file: File) => Promise<string>;

export interface UseImageUploadOptions {
  initialUrl?: string;
  maxSizeMB?: number;
  allowedTypes?: string[]; // e.g. ['image/jpeg','image/png','image/webp']
  uploader: UploaderFn; // must return the final URL
}

type KeyOfString<T> = Extract<keyof T, string>;

export interface EnsureWithImageOptions<TValues extends object> {
  imageField?: KeyOfString<TValues>;
  setImage?: (url: string) => void;
}

export interface UseImageUpload {
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  previewUrl: string;
  imageUrl: string; // last successful uploaded URL (or initialUrl)
  uploading: boolean;
  uploadError: string | null;
  onFileChange: (f: File | null) => void;
  validateFile: (f: File) => string | null;
  upload: () => Promise<string>; // uploads selectedFile -> URL
  reset: () => void;

  /**
   * Returns a new payload where the image field is guaranteed to be the final URL.
   * If a file is selected, it uploads first; otherwise it keeps the existing value.
   */
  ensureWithImage: <TValues extends object>(
    values: TValues,
    options?: EnsureWithImageOptions<TValues>
  ) => Promise<TValues>;

  /**
   * Wrap your submit function. It ensures the image URL is finalized before calling submitFn.
   */
  wrapSubmit: <TValues extends object>(
    submitFn: (data: TValues) => Promise<void>,
    options?: EnsureWithImageOptions<TValues>
  ) => (values: TValues) => Promise<void>;
}

/**
 * Reusable image upload hook
 * - Handles file selection, preview (ObjectURL), validation, upload status and error
 * - Accepts a caller-provided uploader that returns the final URL
 * - Cleans up ObjectURLs to avoid leaks
 * - Adds ensureWithImage + wrapSubmit to dedupe the common “upload then merge” pattern
 */
export function useImageUpload(options: UseImageUploadOptions): UseImageUpload {
  const {
    initialUrl = '',
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    uploader,
  } = options;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);
  const objectUrlRef = useRef<string>('');

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = '';
    }
  };

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      revokeObjectUrl();
      const url = URL.createObjectURL(selectedFile);
      objectUrlRef.current = url;
      return url;
    }
    return imageUrl || '';
  }, [selectedFile, imageUrl]);

  useEffect(() => () => revokeObjectUrl(), []);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!allowedTypes.includes(file.type)) {
        return 'Unsupported file type';
      }
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return `File too large. Max ${maxSizeMB}MB`;
      }
      return null;
    },
    [allowedTypes, maxSizeMB]
  );

  const onFileChange = useCallback((file: File | null) => {
    setUploadError(null);
    setSelectedFile(file);
  }, []);

  const upload = useCallback(async (): Promise<string> => {
    if (!selectedFile) throw new Error('No file selected');
    const validationMsg = validateFile(selectedFile);
    if (validationMsg) {
      setUploadError(validationMsg);
      throw new Error(validationMsg);
    }
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploader(selectedFile);
      if (!url) throw new Error('Upload returned empty URL');
      setImageUrl(url);
      return url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      setUploadError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [selectedFile, uploader, validateFile]);

  const ensureWithImage = useCallback(
    async <TValues extends object>(
      values: TValues,
      { imageField, setImage }: EnsureWithImageOptions<TValues> = {}
    ): Promise<TValues> => {
      const field = imageField ?? ('image' as KeyOfString<TValues>);

      // safely read potential current value
      let finalUrl = '';

      if (selectedFile) {
        finalUrl = await upload();
        if (setImage) setImage(finalUrl);
      }

      return { ...(values as object), [field]: finalUrl } as TValues;
    },
    [selectedFile, upload]
  );

  const wrapSubmit = useCallback(
    <TValues extends object>(
      submitFn: (data: TValues) => Promise<void>,
      options?: EnsureWithImageOptions<TValues>
    ) => {
      return async (values: TValues) => {
        const merged = await ensureWithImage(values, options);
        await submitFn(merged);
      };
    },
    [ensureWithImage]
  );

  const reset = useCallback(() => {
    setSelectedFile(null);
    setUploadError(null);
    setUploading(false);
    setImageUrl(initialUrl);
    revokeObjectUrl();
  }, [initialUrl]);

  return {
    selectedFile,
    setSelectedFile,
    previewUrl,
    imageUrl,
    uploading,
    uploadError,
    onFileChange,
    validateFile,
    upload,
    reset,
    ensureWithImage,
    wrapSubmit,
  };
}
