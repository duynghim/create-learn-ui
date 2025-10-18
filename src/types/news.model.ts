import type { ApiFilters, BaseEntity } from './api.modes';

export interface News extends BaseEntity {
  title: string;
  brief: string;
  content: string;
  isDisplay: boolean;
  image: string;
}

export interface CreateNewsRequest {
  title: string;
  brief: string;
  content: string;
  isDisplay: boolean;
  image: string;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: string;
}

export interface NewsApiFilters extends ApiFilters {
  title?: string;
  isDisplay?: boolean;
}
