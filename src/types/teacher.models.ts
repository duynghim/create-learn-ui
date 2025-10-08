import type { BaseEntity } from './api.modes';

export interface Teacher extends BaseEntity {
  firstName: string;
  lastName: string;
  introduction: string;
  gender: 'MALE' | 'FEMALE';
  profileImageUrl: string;
}

export interface CreateTeacherRequest {
  firstName: string;
  lastName: string;
  introduction: string;
  gender: 'MALE' | 'FEMALE';
  profileImageUrl: string;
}

export interface UpdateTeacherRequest extends Partial<CreateTeacherRequest> {
  id?: string;
}

export interface TeacherFilters {
  page?: number;
  limit?: number;
  search?: string;
  gender?: 'MALE' | 'FEMALE';
}
