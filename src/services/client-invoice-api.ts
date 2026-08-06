import axiosClient from './api';
import { UUID } from 'crypto';
import { ClientInvoiceFilters, ClientInvoiceType } from '@/types/client-invoice-type';
import { ClientInvoicePayload } from './payload/client-invoice-payload';
import { ClientCreditNotePayload } from './payload/client-credit-note-payload';
import { ClientCreditNoteType } from '@/types/client-credit-note-type';

class ClientInvoiceApi {
  async search(filters: ClientInvoiceFilters = {}): Promise<ClientInvoiceType[]> {
    const response = await axiosClient.post('/client-invoice/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async add(invoice: ClientInvoiceType): Promise<void> {
    const payload: ClientInvoicePayload = {
      docNumber: invoice.docNumber!,
      clientId: invoice.client!.id!,
      workId: invoice.work!.id!,
      description: invoice.description!,
      valueWithoutTax: invoice.valueWithoutTax!,
      appliedTax: invoice.appliedTax!,
      registrationDate: invoice.registrationDate!,
      dueDate: invoice.dueDate!,
    };

    await axiosClient.post('/client-invoice/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async edit(invoice: ClientInvoiceType): Promise<void> {
    const payload: ClientInvoicePayload = {
      id: invoice.id!,
      docNumber: invoice.docNumber!,
      clientId: invoice.client!.id!,
      workId: invoice.work!.id!,
      description: invoice.description!,
      valueWithoutTax: invoice.valueWithoutTax!,
      appliedTax: invoice.appliedTax!,
      registrationDate: invoice.registrationDate!,
      dueDate: invoice.dueDate!,
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

  async createCreditNote(invoiceId: UUID, clientCreditNote: ClientCreditNoteType): Promise<void> {
    const payload: ClientCreditNotePayload = {
      docNumber: clientCreditNote.docNumber!,
      description: clientCreditNote.description!,
      valueWithoutTax: clientCreditNote.valueWithoutTax!,
      appliedTax: clientCreditNote.appliedTax!,
      registrationDate: clientCreditNote.registrationDate!,
      dueDate: clientCreditNote.dueDate!,
    };

    await axiosClient.post(`/client-invoice/${invoiceId}/credit-note`, payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async updateCreditNote(invoiceId: UUID, clientCreditNote: ClientCreditNoteType): Promise<void> {
    const payload: ClientCreditNotePayload = {
      id: clientCreditNote.id!,
      docNumber: clientCreditNote.docNumber!,
      description: clientCreditNote.description!,
      valueWithoutTax: clientCreditNote.valueWithoutTax!,
      appliedTax: clientCreditNote.appliedTax!,
      registrationDate: clientCreditNote.registrationDate!,
      dueDate: clientCreditNote.dueDate!,
    };

    await axiosClient.put(`/client-invoice/${invoiceId}/credit-note`, payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteCreditNote(invoiceId: string, creditNoteId: UUID): Promise<void> {
    await axiosClient.delete(`/client-invoice/${invoiceId}/credit-note/${creditNoteId}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new ClientInvoiceApi();
