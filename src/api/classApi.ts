// src/api/classApi.ts
import { BaseApiClient } from './baseApiClient';
import type {
  Class,
  CreateClassRequest,
  UpdateClassRequest,
  ApiConfig,
  ClassApiFilters,
  ApiListResponse,
} from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class ClassApiClient extends BaseApiClient<
  Class,
  CreateClassRequest,
  UpdateClassRequest
> {
  protected readonly endpoint = '/api/classes';

  async getAll(
    filters?: ClassApiFilters
  ): Promise<ApiListResponse<Class> | undefined> {
    const { buildQueryString } = await import('@/utils');
    const qs = buildQueryString(
      filters as
        | Record<string, string | number | boolean | object | Date>
        | undefined
    );
    return this.request<ApiListResponse<Class>>(`/api/classes/public${qs}`, {
      method: 'GET',
    });
  }

  async getAllForAdmin(): Promise<ApiListResponse<Class> | undefined> {
    return this.request<ApiListResponse<Class>>('/api/classes/admin', {
      method: 'GET',
    });
  }

  /**
   * Fetch classes filtered by type (default 'FREE').
   * Use getAll({ type: 'FREE' }) instead if you prefer a single entrypoint.
   */
  async getFreeClasses(
    type: string = 'FREE'
  ): Promise<ApiListResponse<Class> | undefined> {
    const qs = `?type=${encodeURIComponent(type)}`;
    return this.request<ApiListResponse<Class>>(`/api/classes/public${qs}`, {
      method: 'GET',
    });
  }
}

export const classApiClient = new ClassApiClient(config);
