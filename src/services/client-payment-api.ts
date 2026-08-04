import axiosClient from './api';
import { UUID } from 'crypto';
import { ClientPaymentFilters, ClientPaymentType } from '@/types/client-payment-type';
import { ClientPaymentPayload } from './payload/client-payment-payload';

class ClientPaymentApi {
  async search(filters: ClientPaymentFilters = {}): Promise<ClientPaymentType[]> {
    const response = await axiosClient.post('/client-payment/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async add(clientPayment: ClientPaymentType): Promise<void> {
    const payload: ClientPaymentPayload = {
      type: clientPayment.type!,
      clientId: clientPayment.client!.id!,
      paymentDate: clientPayment.paymentDate!,
      paymentMethod: clientPayment.paymentMethod!,
      notes: clientPayment.notes,
      paidInvoices: clientPayment.paidInvoices!.map((paidInvoice) => ({
        invoiceId: paidInvoice.invoice!.id!,
        paidValue: clientPayment.totalPaidValue!,
      })),
    };

    await axiosClient.post('/client-payment/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async edit(clientPayment: ClientPaymentType): Promise<void> {
    const payload: ClientPaymentPayload = {
      id: clientPayment.id!,
      type: clientPayment.type!,
      clientId: clientPayment.client!.id!,
      paymentDate: clientPayment.paymentDate!,
      paymentMethod: clientPayment.paymentMethod!,
      notes: clientPayment.notes,
      paidInvoices: clientPayment.paidInvoices!.map((paidInvoice) => ({
        invoiceId: paidInvoice.invoice!.id!,
        paidValue: paidInvoice.paidValue!,
      })),
    };

    await axiosClient.put('/client-payment/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async delete(id: UUID): Promise<void> {
    await axiosClient.delete(`/client-payment/${id}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new ClientPaymentApi();
