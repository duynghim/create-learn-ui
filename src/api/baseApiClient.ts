import type {
  ApiConfig,
  ApiClient,
  BaseEntity,
  ApiListResponse,
  ApiSingleResponse,
  ApiFilters,
} from '@/types';
import { fetchJSON, getAuthHeaders, buildQueryString } from '@/utils';

export abstract class BaseApiClient<
  T extends BaseEntity,
  CreateT = Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  UpdateT = Partial<CreateT>,
> implements ApiClient<T, CreateT, UpdateT>
{
  protected readonly baseURL: string;
  protected readonly timeout: number;
  protected abstract readonly endpoint: string;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  /**
   * Core request helper
   */
  protected request<TResponse>(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    return fetchJSON<TResponse>(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      timeout: this.timeout,
    });
  }

  // ============= CRUD =============
  async getAll(filters?: ApiFilters): Promise<ApiListResponse<T> | undefined> {
    const qs = buildQueryString(
      filters as
        | Record<string, string | number | boolean | object | Date>
        | undefined
    );
    return await this.request<ApiListResponse<T>>(`${this.endpoint}${qs}`, {
      method: 'GET',
    });
  }

  async getById(id: string): Promise<ApiSingleResponse<T>> {
    return await this.request<ApiSingleResponse<T>>(`${this.endpoint}/${id}`, {
      method: 'GET',
    });
  }

  async create(data: CreateT): Promise<ApiSingleResponse<T>> {
    return await this.request<ApiSingleResponse<T>>(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: UpdateT): Promise<ApiSingleResponse<T>> {
    return await this.request<ApiSingleResponse<T>>(`${this.endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    return await this.request<void>(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    });
  }
}
