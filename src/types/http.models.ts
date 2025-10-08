export type ApiError = {
  message: string;
  status?: number;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
