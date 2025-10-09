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

  // Override getAll to use the public endpoint for fetching classes
  async getAll(filters?: ClassApiFilters): Promise<ApiListResponse<Class> | undefined> {
    const { buildQueryString } = await import('@/utils');
    const qs = buildQueryString(filters as Record<string, string | number | boolean | object | Date> | undefined);
    
    // Use the public endpoint that returns the data structure you mentioned
    return this.request<ApiListResponse<Class>>(`/api/classes/public${qs}`, {
      method: 'GET',
    });
  }

  // Add method to get all classes for admin (if needed)
  async getAllForAdmin(): Promise<ApiListResponse<Class> | undefined> {
    return this.request<ApiListResponse<Class>>('/api/classes/admin', {
      method: 'GET',
    });
  }
}

export const classApiClient = new ClassApiClient(config);