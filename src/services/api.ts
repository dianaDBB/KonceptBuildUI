import axios from 'axios';
import AuthApi from './auth-api';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

client.interceptors.request.use((config) => {
  const token = AuthApi.getAccessToken();

  if (token && config.url !== '/auth/login') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
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

export default client;
