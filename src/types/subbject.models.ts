import type { ApiFilters, BaseEntity } from './api.modes';

export interface Subject extends BaseEntity {
  name: string;
  description?: string;
  iconBase64?: string;
}

export interface CreateSubjectRequest {
  name: string;
  description?: string;
  icon?: File;
}

export interface UpdateSubjectRequest extends Partial<CreateSubjectRequest> {
  id: string;
}

export interface SubjectApiResponse {
  status: number;
  message: string;
  timestamp: string;
  data: Subject[];
}

export interface SubjectApiFilters extends ApiFilters {
  name?: string;
}
