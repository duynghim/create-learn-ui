/**
 * Custom hook for managing image upload functionality
 */

'use client';

import { useState, useCallback } from 'react';
import { EditorError } from '../types';

interface UseImageUploadReturn {
  loading: boolean;
  error: string | null;
  onUploadStart: () => void;
  onUploadEnd: () => void;
  onError: (error: string) => void;
  clearError: () => void;
}

/**
 * Custom hook for managing image upload state
 */
export const useImageUpload = (): UseImageUploadReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onUploadStart = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const onUploadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const onError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    onUploadStart,
    onUploadEnd,
    onError,
    clearError,
  };
};