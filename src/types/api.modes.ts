// src/types/api.types.ts
export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiListResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiSingleResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

export interface ApiFilters {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | undefined;
}

export interface ApiClient<T, CreateT, UpdateT> {
  getAll(filters?: ApiFilters): Promise<ApiListResponse<T> | undefined>;
  getById(id: string): Promise<ApiSingleResponse<T> | undefined>;
  create(data: CreateT): Promise<ApiSingleResponse<T> | undefined>;
  update(id: string, data: UpdateT): Promise<ApiSingleResponse<T> | undefined>;
  delete(id: string): Promise<void>;
}
