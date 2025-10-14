import type { ApiFilters, BaseEntity } from './api.modes';

export interface Grade extends BaseEntity {
  name: string;
  description?: string;
  iconBase64?: string;
  icon?: string | File;
}

export interface CreateGradeRequest {
  name: string;
  description?: string;
  icon?: File;
}

export interface UpdateGradeRequest extends Partial<CreateGradeRequest> {
  id: string;
}

export interface GradeApiResponse {
  status: number;
  message: string;
  timestamp: string;
  data: Grade[];
}

export interface GradeApiFilters extends ApiFilters {
  name?: string;
}
