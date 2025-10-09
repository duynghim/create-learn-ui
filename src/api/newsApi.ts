import { BaseApiClient } from './baseApiClient';
import type {
  News,
  CreateNewsRequest,
  UpdateNewsRequest,
  ApiConfig,
  ApiFilters,
  ApiListResponse,
} from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class NewsApiClient extends BaseApiClient<
  News,
  CreateNewsRequest,
  UpdateNewsRequest
> {
  protected readonly endpoint = '/api/news';

 async getAll(
    filters?: ClassApiFilters
  ): Promise<ApiListResponse<Class> | undefined> {
    const { buildQueryString } = await import('@/utils');
    const qs = buildQueryString(
      filters as
        | Record<string, string | number | boolean | object | Date>
        | undefined
    );
    return this.request<ApiListResponse<Class>>(`/api/news/admin`, {
      method: 'GET',
    });
  }
}

export const newsApiClient = new NewsApiClient(config);