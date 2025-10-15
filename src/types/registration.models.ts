import type { ApiFilters, BaseEntity } from './api.modes';

export interface Registration extends BaseEntity {
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  clazzId: number;
  status: 'PROCESSING' | 'PROCESSED';
  classResponse: {
    id: number;
    name: string;
    brief: string;
    description: string;
    image: string;
    requirement: string;
    guarantee: string;
    isDisplayed: boolean;
    subjects: Array<{
      id: number;
      name: string;
      description: string;
      iconBase64: string;
    }>;
    grades: Array<{
      id: number;
      name: string;
      description: string;
      iconBase64: string | null;
    }>;
    teacher: {
      id: number;
      firstName: string;
      lastName: string;
      introduction: string;
      gender: 'MALE' | 'FEMALE';
      profileImageUrl: string;
    };
    price: number;
    scheduleResponses: any[];
  };
}

export interface CreateRegistrationRequest {
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  status: 'PROCESSING' | 'PROCESSED';
  clazzId: number; // Note: API expects clazzId in request
}

export interface UpdateRegistrationRequest
  extends Partial<CreateRegistrationRequest> {
  id: string;
}

export interface RegistrationApiResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    data: Registration[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

export interface RegistrationApiFilters extends ApiFilters {
  customerName?: string;
  status?: 'PROCESSING' | 'PROCESSED' | 'REJECTED';
  clazzId?: number;
}

export interface ClassOption {
  value: string;
  label: string;
}
