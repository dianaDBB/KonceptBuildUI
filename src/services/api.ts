import { Worker } from '@/types/worker';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class KoncepBuildApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: false,
      headers: {
        Accept: 'application/octet-stream',
      },
    });

    // Add request interceptor for debugging
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for debugging
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('Response error:', error);
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error - API might not be reachable at', API_BASE_URL);
        }
        return Promise.reject(error);
      },
    );
  }

  //*********************************************************************************************************** WORKERS

  async getAllWorkers(): Promise<Worker[]> {
    const response = await this.client.get('/worker/all', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async addWorker(worker: Worker): Promise<void> {
    await this.client.post('/worker/', worker, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new KoncepBuildApiService();
