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

  async add(payment: ClientPaymentType): Promise<void> {
    const payload: ClientPaymentPayload = {
      type: payment.type!,
      clientId: payment.client!.id!,
      paymentDate: payment.paymentDate!,
      paymentMethod: payment.paymentMethod!,
      notes: payment.notes,
      paidInvoices: payment.paidInvoices!.map((paidInvoice) => ({
        invoiceId: paidInvoice.invoice!.id!,
        paidValue: paidInvoice.paidValue!,
      })),
    };

    await axiosClient.post('/client-payment/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async edit(payment: ClientPaymentType): Promise<void> {
    const payload: ClientPaymentPayload = {
      id: payment.id!,
      type: payment.type!,
      clientId: payment.client!.id!,
      paymentDate: payment.paymentDate!,
      paymentMethod: payment.paymentMethod!,
      notes: payment.notes,
      paidInvoices: payment.paidInvoices!.map((paidInvoice) => ({
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
