import type { ApiFilters, BaseEntity } from './api.modes';

export interface Account extends BaseEntity {
  email: string;
  password: string;
  username: string;
  phone: string;
  activated: boolean;
}

export type CreateAccountRequest = Account;

export type UpdateAccountRequest = Account;

export type AccountApiFilters = ApiFilters;
