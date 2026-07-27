import axios from 'axios';
import AuthApi from './auth-api';
import { ApiResponseStatus } from '@/types/api-response-status';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

axiosClient.interceptors.request.use((config) => {
  const token = AuthApi.getAccessToken();

  if (token && config.url !== '/auth/login') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      AuthApi.clearAccessToken();

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export function apiError(error: unknown, defaultMessage: string): ApiResponseStatus {
  let message: string = defaultMessage;

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message ?? error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return {
    isLoading: false,
    isSuccess: false,
    isError: true,
    message,
  };
}

export default axiosClient;
