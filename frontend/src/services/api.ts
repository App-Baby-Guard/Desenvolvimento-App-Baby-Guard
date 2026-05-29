import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../config/apiUrl';

// URL base da sua API (Backend Node.js)
// Centralizamos a URL no arquivo apiUrl.ts para facilitar a troca entre local e produção
export const api = axios.create({
  baseURL: `${API_URL}/api`, 
  timeout: 5000, // Timeout de 5 segundos
});

// Interceptor para adicionar o Token JWT no cabeçalho das requisições (futuro)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // TODO: Buscar o token do AsyncStorage ou Context e adicionar aqui
    // const token = await AsyncStorage.getItem('@BabyGuard:token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
