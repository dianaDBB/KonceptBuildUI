import { UUID } from 'node:crypto';

export type ClientPayload = {
  id?: UUID;
  companyName: string;
  address?: string;
  postalCode?: string;
  city?: string;
  district?: string;
  nif: string;
  contact: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  status: string;
  note?: string;
};
