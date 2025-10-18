import type {
  ApiConfig,
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  ApiSingleResponse,
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

  async getCurrentProfile(): Promise<ApiSingleResponse<Account> | undefined> {
    return this.request<ApiSingleResponse<Account>>(
      `${this.endpoint}/profile`,
      {
        method: 'GET',
      }
    );
  }
}

export const accountApiClient = new AccountApiClient(config);
