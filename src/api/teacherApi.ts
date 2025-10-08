import { BaseApiClient } from './baseApiClient';
import type {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
  ApiConfig,
} from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class TeacherApiClient extends BaseApiClient<
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest
> {
  protected readonly endpoint = '/api/teachers';
}

export const teacherApiClient = new TeacherApiClient(config);
