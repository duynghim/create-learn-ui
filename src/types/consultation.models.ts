import type { ApiFilters, BaseEntity } from './api.modes';

export interface Consultation extends BaseEntity {
  customerName: string;
  phoneNumber: string;
  email: string;
  content: string;
  status: string;
}

export interface CreateConsultationRequest {
  customerName: string;
  phoneNumber: string;
  email: string;
  content: string;
}

export interface UpdateConsultationRequest extends Partial<CreateConsultationRequest> {
  id: string;
}

export interface ConsultationApiResponse {
  status: number;
  message: string;
  timestamp: string;
  data: Consultation[];
}

export interface ConsultationApiFilters extends ApiFilters {
  customerName?: string;
  email?: string;
}