import type { ApiFilters, BaseEntity } from './api.modes';

export interface Subject extends BaseEntity {
  name: string;
  description?: string;
  icon?: string;
}
