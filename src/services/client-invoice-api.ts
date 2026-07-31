import axiosClient from './api';
import { UUID } from 'crypto';
import { ClientInvoiceFilters, ClientInvoiceType } from '@/types/client-invoice-type';
import { ClientInvoicePayload } from './payload/client-invoice-payload';

class ClientInvoiceApi {
  async search(filters: ClientInvoiceFilters = {}): Promise<ClientInvoiceType[]> {
    const response = await axiosClient.post('/client-invoice/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async add(clientInvoice: ClientInvoiceType): Promise<void> {
    const payload: ClientInvoicePayload = {
      docNumber: clientInvoice.docNumber!,
      clientId: clientInvoice.client!.id!,
      workId: clientInvoice.work!.id!,
      description: clientInvoice.description!,
      valueWithoutTax: clientInvoice.valueWithoutTax!,
      appliedTax: clientInvoice.appliedTax!,
      registrationDate: clientInvoice.registrationDate!,
      dueDate: clientInvoice.dueDate!,
    };

    await axiosClient.post('/client-invoice/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async edit(clientInvoice: ClientInvoiceType): Promise<void> {
    const payload: ClientInvoicePayload = {
      id: clientInvoice.id!,
      docNumber: clientInvoice.docNumber!,
      clientId: clientInvoice.client!.id!,
      workId: clientInvoice.work!.id!,
      description: clientInvoice.description!,
      valueWithoutTax: clientInvoice.valueWithoutTax!,
      appliedTax: clientInvoice.appliedTax!,
      registrationDate: clientInvoice.registrationDate!,
      dueDate: clientInvoice.dueDate!,
    };

    await axiosClient.put('/client-invoice/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async delete(id: UUID): Promise<void> {
    await axiosClient.delete(`/client-invoice/${id}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new ClientInvoiceApi();
