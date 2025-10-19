import { BaseApiClient } from './baseApiClient';
import type { ApiConfig } from '@/types';

interface FileUploadResponse {
  id: number;
  status: number;
  message: string;
  timestamp: string;
  data: string | null;
}

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class FileUploadApiClient extends BaseApiClient<
  FileUploadResponse,
  never,
  never
> {
  protected readonly endpoint = '/api/files/upload';

  async upload(file: File): Promise<FileUploadResponse | undefined> {
    const form = new FormData();
    form.append('file', file);
    return this.request<FileUploadResponse>(this.endpoint, {
      method: 'POST',
      body: form,
    });
  }
}

export const fileUploadApiClient = new FileUploadApiClient(config);
