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
