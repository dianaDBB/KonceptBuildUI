import axiosClient from './api';
import { UUID } from 'crypto';
import { ClientType } from '@/types/client-type';
import { ClientPayload } from './payload/client-payload';

class ClientApi {
  async searchClients(filters = {}): Promise<ClientType[]> {
    const response = await axiosClient.post('/client/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async addClient(client: ClientType): Promise<void> {
    const payload: ClientPayload = {
      companyName: client.companyName!,
      address: client.address,
      postalCode: client.postalCode,
      city: client.city,
      district: client.district,
      nif: client.nif!,
      contact: client.contact!,
      email: client.email!,
      phoneCountryCode: client.phoneCountryCode!,
      phone: client.phone!,
      status: client.status!,
      note: client.note,
    };

    await axiosClient.post('/client/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async editClient(client: ClientType): Promise<void> {
    const payload: ClientPayload = {
      id: client.id,
      companyName: client.companyName!,
      address: client.address,
      postalCode: client.postalCode,
      city: client.city,
      district: client.district,
      nif: client.nif!,
      contact: client.contact!,
      email: client.email!,
      phoneCountryCode: client.phoneCountryCode!,
      phone: client.phone!,
      status: client.status!,
      note: client.note,
    };

    await axiosClient.put('/client/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteClient(id: UUID): Promise<void> {
    await axiosClient.delete(`/client/${id}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new ClientApi();
