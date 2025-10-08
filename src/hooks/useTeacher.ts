// src/hooks/useTeacher.ts
'use client';

import { useState, useCallback } from 'react';
import { teacherApiClient } from '@/api';
import type {
  Teacher,
  CreateTeacherRequest,
  TeacherFilters,
  UpdateTeacherRequest,
} from '@/types';

interface UseTeacherState {
  teachers: Teacher[];
  currentTeacher: Teacher | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: UseTeacherState = {
  teachers: [],
  currentTeacher: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const useTeacher = () => {
  const [state, setState] = useState<UseTeacherState>(initialState);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const getAllTeachers = useCallback(
    async (filters?: TeacherFilters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await teacherApiClient.getAll(filters);

        if (response && response.status === 200) {
          // Handle the actual API response format
          let teachers: Teacher[] = [];
          let total = 0;
          let page = filters?.page || 1;
          let limit = filters?.limit || 10;

          // Check if response.data is an array (your current API format)
          if (Array.isArray(response.data)) {
            teachers = response.data;
            total = response.data.length;
          }
          // Check if response.data has the expected paginated format
          else if (response.data && typeof response.data === 'object') {
            if (
              'items' in response.data &&
              Array.isArray(response.data.items)
            ) {
              teachers = response.data.items;
              total = response.data.total || response.data.items.length;
              page = response.data.page || page;
              limit = response.data.limit || limit;
            } else {
              // Fallback: treat response.data as the teachers array
              teachers = [];
              total = 0;
            }
          }

          setState((prev) => ({
            ...prev,
            teachers,
            total,
            page,
            limit,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Get teachers failed:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch teachers';
        setError(errorMessage);
        setState((prev) => ({
          ...prev,
          teachers: [], // Ensure teachers is always an array
          isLoading: false,
        }));
      }
    },
    [setLoading, setError]
  );

  const getTeacherById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await teacherApiClient.getById(id);

        if (response && response.status === 200) {
          setState((prev) => ({
            ...prev,
            currentTeacher: response.data,
            isLoading: false,
          }));
          return response.data;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch teacher';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const createTeacher = useCallback(
    async (teacherData: CreateTeacherRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await teacherApiClient.create(teacherData);

        if (response && (response.status === 201 || response.status === 200)) {
          setState((prev) => ({
            ...prev,
            teachers: [...(prev.teachers || []), response.data],
            total: (prev.total || 0) + 1,
            isLoading: false,
          }));
          return response.data;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create teacher';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const updateTeacher = useCallback(
    async (id: string, teacherData: UpdateTeacherRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await teacherApiClient.update(id, teacherData);

        if (response && response.status === 200) {
          setState((prev) => ({
            ...prev,
            teachers: (prev.teachers || []).map((teacher) =>
              teacher.id === id ? response.data : teacher
            ),
            currentTeacher:
              prev.currentTeacher?.id === id
                ? response.data
                : prev.currentTeacher,
            isLoading: false,
          }));
          return response.data;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update teacher';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const deleteTeacher = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        await teacherApiClient.delete(id);

        setState((prev) => ({
          ...prev,
          teachers: (prev.teachers || []).filter(
            (teacher) => teacher.id !== id
          ),
          currentTeacher:
            prev.currentTeacher?.id === id ? null : prev.currentTeacher,
          total: Math.max((prev.total || 0) - 1, 0),
          isLoading: false,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete teacher';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const clearCurrentTeacher = useCallback(() => {
    setState((prev) => ({ ...prev, currentTeacher: null }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    ...state,
    // Ensure teachers is always an array
    teachers: state.teachers || [],
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    clearCurrentTeacher,
    clearError,
  };
};
