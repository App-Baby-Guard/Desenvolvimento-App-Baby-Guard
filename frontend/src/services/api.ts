import axios, { InternalAxiosRequestConfig } from 'axios';

// URL base da sua API (Backend Node.js)
// Para testes no emulador do Android, use 10.0.2.2 ao invés de localhost
// Para Expo Go no celular físico, use o IP da sua máquina na rede local (ex: 192.168.1.X)
export const api = axios.create({
  baseURL: 'http://192.168.0.100:3000/api', // Altere para o IP correto quando tiver o backend rodando
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
