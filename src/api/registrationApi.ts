import { BaseApiClient } from './baseApiClient';
import type {
  Registration,
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
  ApiConfig,
} from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class RegistrationApiClient extends BaseApiClient<
  Registration,
  CreateRegistrationRequest,
  UpdateRegistrationRequest
> {
  protected readonly endpoint = '/api/registrations';
}

export const registrationApiClient = new RegistrationApiClient(config);
