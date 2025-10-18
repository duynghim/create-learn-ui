import type { ApiFilters, BaseEntity } from './api.modes';

export interface Schedule extends BaseEntity {
  time: string;
  clazzId: number;
}

export interface CreateScheduleRequest {
  time: string;
  clazzId: number;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  id: string;
}

export interface ScheduleApiResponse {
  status: number;
  message: string;
  timestamp: string;
  data: Schedule[];
}

export interface ScheduleApiFilters extends ApiFilters {
  clazzId?: number;
}
