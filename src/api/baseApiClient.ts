// src/api/baseApiClient.ts
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

  private buildRequestInit(options: RequestInit): RequestInit {
    const headers: Record<string, string> = {
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    };
    if (
      !(options.body instanceof FormData) &&
      !('Content-Type' in headers) &&
      options.body !== undefined
    ) {
      headers['Content-Type'] = 'application/json';
    }
    return { ...options, headers };
  }

  protected async request<TResponse>(
    endpoint: string,
    options: RequestInit = {}
  ) {
    const url = `${this.baseURL}${endpoint}`;
    return fetchJSON<TResponse>(url, this.buildRequestInit(options));
  }

  private serializeData(data: unknown): {
    body: BodyInit;
    headers?: Record<string, string>;
  } {
    if (data instanceof FormData) {
      return { body: data };
    }

    if (!data || typeof data !== 'object') {
      return {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const entries = Object.entries(data as Record<string, unknown>);
    const hasBinary = entries.some(([, value]) => this.isBinaryValue(value));

    if (!hasBinary) {
      return {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const form = new FormData();
    for (const [key, value] of entries) {
      this.appendToFormData(form, key, value);
    }

    return { body: form };
  }

  private isBinaryValue(value: unknown): boolean {
    if (value instanceof File || value instanceof Blob) return true;
    if (Array.isArray(value)) {
      return value.some((item) => item instanceof File || item instanceof Blob);
    }
    return false;
  }

  private normalizeValue(value: unknown): string {
    if (value == null) return '';
    if (value instanceof Date) return value.toISOString();
    switch (typeof value) {
      case 'string':
        return value;
      case 'number':
      case 'boolean':
      case 'bigint':
        return String(value);
      // symbol / function unlikely: stringify to avoid [object Object]
      default:
        return JSON.stringify(value);
    }
  }

  private isFileLike(value: unknown): value is File | Blob {
    return value instanceof File || value instanceof Blob;
  }

  private appendArrayToFormData(
    form: FormData,
    key: string,
    items: unknown[]
  ): void {
    for (const item of items) {
      if (item == null) continue;

      if (this.isFileLike(item)) {
        form.append(key, item);
        continue;
      }

      if (Array.isArray(item)) {
        // Support nested arrays
        this.appendArrayToFormData(form, key, item);
        continue;
      }

      if (typeof item === 'object' && !(item instanceof Date)) {
        form.append(key, JSON.stringify(item));
        continue;
      }

      form.append(key, this.normalizeValue(item));
    }
  }

  private appendObjectToFormData(
    form: FormData,
    key: string,
    obj: object
  ): void {
    if (obj instanceof Date) {
      form.append(key, obj.toISOString());
    } else {
      form.append(key, JSON.stringify(obj));
    }
  }

  private appendToFormData(form: FormData, key: string, value: unknown): void {
    if (value == null) return;

    if (this.isFileLike(value)) {
      form.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      this.appendArrayToFormData(form, key, value);
      return;
    }

    if (typeof value === 'object') {
      this.appendObjectToFormData(form, key, value);
      return;
    }

    form.append(key, this.normalizeValue(value));
  }

  async getAll(filters?: ApiFilters): Promise<ApiListResponse<T> | undefined> {
    const qs = buildQueryString(
      filters as
        | Record<string, string | number | boolean | object | Date>
        | undefined
    );
    return this.request<ApiListResponse<T>>(`${this.endpoint}${qs}`, {
      method: 'GET',
    });
  }

  async getById(id: string): Promise<ApiSingleResponse<T> | undefined> {
    return this.request<ApiSingleResponse<T>>(`${this.endpoint}/${id}`, {
      method: 'GET',
    });
  }

  async create(data: CreateT): Promise<ApiSingleResponse<T> | undefined> {
    const { body, headers } = this.serializeData(data);
    return this.request<ApiSingleResponse<T>>(this.endpoint, {
      method: 'POST',
      body,
      headers,
    });
  }

  async update(
    id: string,
    data: UpdateT
  ): Promise<ApiSingleResponse<T> | undefined> {
    const { body, headers } = this.serializeData(data);
    return this.request<ApiSingleResponse<T>>(`${this.endpoint}/${id}`, {
      method: 'PUT',
      body,
      headers,
    });
  }

  async delete(id: string): Promise<void> {
    return this.request<void>(`${this.endpoint}/${id}`, { method: 'DELETE' });
  }
}
