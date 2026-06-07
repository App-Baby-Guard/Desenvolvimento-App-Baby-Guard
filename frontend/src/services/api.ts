import axios, { InternalAxiosRequestConfig } from 'axios';//importei para fazer comunicação com backend
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/apiUrl';

// URL base da sua API (Backend Node.js)
// Centralizamos a URL no arquivo apiUrl.ts para facilitar a troca entre local e produção
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 5000, // Timeout de 5 segundos
});

// interceptor de requisição: antes de cada chamada, busca o token salvo e coloca no cabeçalho
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// interceptor de resposta: se o servidor retornar 401 (token expirado ou inválido), limpa a sessão salva
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
    }
    return Promise.reject(error);
  }
);
