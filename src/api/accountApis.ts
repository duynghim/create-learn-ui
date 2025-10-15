import type {
  ApiConfig,
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/types';
import { BaseApiClient } from '@/api/baseApiClient';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class AccountApiClient extends BaseApiClient<
  Account,
  CreateAccountRequest,
  UpdateAccountRequest
> {
  protected readonly endpoint = '/api/accounts';
}

export const accountApiClient = new AccountApiClient(config);
