import type { ApiFilters, BaseEntity } from './api.modes';
import type { Subject } from './subbject.models';
import type { Grade } from './grade.models';
import type { Teacher } from './teacher.models';
import type { Schedule } from './schedule.models';

export interface Class extends BaseEntity {
  name: string;
  brief: string;
  description: string;
  image: string;
  requirement: string;
  guarantee: string;
  isDisplayed: boolean;
  subjects: Subject[];
  grades: Grade[];
  teacher: Teacher;
  price: number;
  scheduleResponses: Schedule[];
  subjectIds: number[];
  gradeIds: number[];
  teacherId: number;
}

export interface CreateClassRequest {
  name: string;
  brief: string;
  description: string;
  image: string;
  requirement: string;
  guarantee: string;
  isDisplayed: boolean;
  subjectIds: number[];
  gradeIds: number[];
  teacherId: number;
  price: number;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  id: string;
}

export interface ClassApiFilters extends ApiFilters {
  type?: string;
  gradeId?: number;
  subjectId?: number;
}
