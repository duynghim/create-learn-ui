import { BaseApiClient } from './baseApiClient';
import type {
  Consultation,
  CreateConsultationRequest,
  UpdateConsultationRequest,
  ApiConfig,
} from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class ConsultationApiClient extends BaseApiClient<
  Consultation,
  CreateConsultationRequest,
  UpdateConsultationRequest
> {
  protected readonly endpoint = '/api/consultations';
}

export const consultationApiClient = new ConsultationApiClient(config);
