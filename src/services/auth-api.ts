import axiosClient from './api';
import { LoginCredentials, LoginResponse } from '@/types/authentication';

const ACCESS_TOKEN_KEY = 'konceptbuild.accessToken';
const USERNAME_KEY = 'konceptbuild.username';

class AuthApi {
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
    const response = await axiosClient.post<LoginResponse>('/auth/login', credentials, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    const accessToken = response.data.accessToken;
    if (!accessToken) {
      throw new Error('Login response did not include an access token.');
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USERNAME_KEY, response.data.username || credentials.username);
  }

  public clearAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }

  async logout(): Promise<void> {
    try {
      await axiosClient.post('/auth/logout', undefined, {
        headers: { Accept: 'application/json' },
      });
    } catch {
      this.clearAccessToken();
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
}

export default new AuthApi();
