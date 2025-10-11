import { BaseApiClient } from './baseApiClient';
import type {
  News,
  CreateNewsRequest,
  UpdateNewsRequest,
  ApiConfig,
  ApiListResponse,
  NewsApiFilters,
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
    filters?: NewsApiFilters
  ): Promise<ApiListResponse<News> | undefined> {
    const { buildQueryString } = await import('@/utils');
    buildQueryString(
      filters as
        | Record<string, string | number | boolean | object | Date>
        | undefined
    );
    return this.request<ApiListResponse<News>>(`/api/news/admin`, {
      method: 'GET',
    });
  }
}

export const newsApiClient = new NewsApiClient(config);
