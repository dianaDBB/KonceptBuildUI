import { SortDirection } from './sort-direction';
import { EntityType } from './entity-configs';

export interface ClientType extends EntityType {
  companyName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  district?: string;
  nif?: string;
  contact?: string;
  email?: string;
  phoneCountryCode?: string;
  phone?: string;
  status?: string;
  note?: string;
}

export enum ClientSortField {
  CODE = 'CODE',
  COMPANY_NAME = 'COMPANY_NAME',
  ADDRESS = 'ADDRESS',
  POSTAL_CODE = 'POSTAL_CODE',
  CITY = 'CITY',
  DISTRICT = 'DISTRICT',
  NIF = 'NIF',
  CONTACT = 'CONTACT',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  STATUS = 'STATUS',
  NOTE = 'NOTE',
}

export interface ClientFilters {
  code?: string;
  companyName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  district?: string;
  nif?: string;
  contact?: string;
  email?: string;
  phone?: string;
  status?: string;
  note?: string;

  sortBy?: ClientSortField;
  sortDirection?: SortDirection;
}
