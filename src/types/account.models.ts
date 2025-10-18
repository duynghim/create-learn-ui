import type { ApiFilters, BaseEntity } from './api.modes';

export interface Account extends BaseEntity {
  email: string;
  password: string;
  username: string;
  phone: string;
  activated: boolean;
}

export interface CreateAccountRequest extends Partial<Account> {}

export interface UpdateAccountRequest extends Partial<Account> {}

export interface AccountApiFilters extends ApiFilters {}
