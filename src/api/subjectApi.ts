import {
  ApiConfig,
  CreateSubjectRequest,
  Subject,
  UpdateSubjectRequest,
} from '@/types';
import { BaseApiClient } from '@/api/baseApiClient';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class SubjectApiClient extends BaseApiClient<
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest
> {
  protected readonly endpoint = '/api/subjects';
}

export const subjectApiClient = new SubjectApiClient(config);
