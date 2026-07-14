import { Worker, WorkerFilters } from '@/types/worker';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ACCESS_TOKEN_KEY = 'konceptbuild.accessToken';
const USERNAME_KEY = 'konceptbuild.username';

export interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  username: string;
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
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
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

  getUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
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
    localStorage.setItem(USERNAME_KEY, response.data.username || credentials.username);
  }

  private clearAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
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

  isTokenExpired(token: string | null): boolean {
    if (token == null) {
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  async checkAuthentication() {
    const token = this.getAccessToken();

    if (this.isTokenExpired(token)) {
      await this.logout();
    }
  }

  //*********************************************************************************************************** WORKERS

  async searchWorkers(filters: WorkerFilters = {}): Promise<Worker[]> {
    const response = await this.client.post('/worker/search', filters, {
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
