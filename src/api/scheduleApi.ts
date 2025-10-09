import { BaseApiClient } from './baseApiClient';
import type {
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ApiConfig,
} from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class ScheduleApiClient extends BaseApiClient<
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest
> {
  protected readonly endpoint = '/api/schedules';
}

export const scheduleApiClient = new ScheduleApiClient(config);
