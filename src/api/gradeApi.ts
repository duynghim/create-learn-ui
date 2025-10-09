import { BaseApiClient } from './baseApiClient';
import {
  Grade,
  CreateGradeRequest,
  UpdateGradeRequest,
  ApiConfig,
} from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class GradeApiClient extends BaseApiClient<
  Grade,
  CreateGradeRequest,
  UpdateGradeRequest
> {
  protected readonly endpoint = '/api/grades';
}

export const gradeApiClient = new GradeApiClient(config);
