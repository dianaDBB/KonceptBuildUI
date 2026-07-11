import { Worker } from '@/types/worker';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ACCESS_TOKEN_KEY = 'konceptbuild.accessToken';

export interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

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

    this.client.interceptors.request.use(
      (config) => {
        const accessToken = this.getAccessToken();
        const isLoginRequest = config.url?.replace(/^\/+/, '') === 'auth/login';

        if (accessToken && !isLoginRequest) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('Response error:', error);
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error - API might not be reachable at', API_BASE_URL);
        }

        if (error.response?.status === 401) {
          this.clearAccessToken();

          if (window.location.pathname !== '/login') {
            window.location.assign('/login');
          }
        }
        return Promise.reject(error);
      },
    );
  }

  //************************************************************************************************************* LOGIN

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }

  private clearAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout', undefined, {
        headers: { Accept: 'application/json' },
      });
    } finally {
      this.clearAccessToken();
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    const accessToken = response.data.accessToken;
    if (!accessToken) {
      throw new Error('Login response did not include an access token.');
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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
