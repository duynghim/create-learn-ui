export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiListResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

export interface ApiSingleResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

export interface ApiFilters {
  id?: number;
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiClient<T, CreateT, UpdateT> {
  getAllPublicClasses(
    filters?: ApiFilters
  ): Promise<ApiListResponse<T> | undefined>;
  getById(id: string): Promise<ApiSingleResponse<T> | undefined>;
  create(data: CreateT): Promise<ApiSingleResponse<T> | undefined>;
  update(id: string, data: UpdateT): Promise<ApiSingleResponse<T> | undefined>;
  delete(id: string): Promise<void>;
}
