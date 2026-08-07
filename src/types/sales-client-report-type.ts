import { ClientInvoiceType } from './client-invoice-type';

export interface SalesClientReportType {
  invoices?: ClientInvoiceType[];
  totalValueWithTax?: number;
  totalValueGross?: number;
  totalAmountDueWithTax?: number;
}
