
// O contexto é como uma variável global do React ,Aqui guardamos o token e os dados do usuário logado, e 
// disponibilizamos para qualquer tela do app usar.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DadosUsuario } from '../services/authService';

// tipos e descrição do formato de dados que o contexto vai armazenar e fornecer para os componentes. O token é a string JWT,

interface AuthContextType {
  token: string | null;         // O token JWT recebido da API
  usuario: DadosUsuario | null; // Os dados do usuário logado
  estaLogado: boolean;          // Atalho para saber se tem usuário logado
  carregandoSessao: boolean;    // true enquanto o app verifica se há sessão salva
  salvarSessao: (token: string, usuario: DadosUsuario) => void; // Salva login
  limparSessao: () => void;     // Limpa logout
  atualizarUsuario: (usuario: DadosUsuario) => void;
}

//criação do contexto

// Criamos o contexto com valor undefined ,será preenchido pelo Provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// O Provider é um componente que abraça o app e fornece os dados do contexto.

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<DadosUsuario | null>(null);
  // começa como true até terminar de verificar o AsyncStorage
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // Calcula se está logado baseado no token
  const estaLogado = token !== null;

  // ao abrir o app, verifica se já existe uma sessão salva e restaura automaticamente
  useEffect(() => {
    async function recuperarSessao() {
      try {
        const tokenSalvo = await AsyncStorage.getItem('token');
        const usuarioSalvo = await AsyncStorage.getItem('usuario');
        if (tokenSalvo && usuarioSalvo) {
          setToken(tokenSalvo);
          setUsuario(JSON.parse(usuarioSalvo));
        }
      } catch {
        // se der erro ao ler o storage, o usuário simplesmente não é restaurado
      } finally {
        setCarregandoSessao(false); // terminou de verificar, libera a navegação
      }
    }
    recuperarSessao();
  }, []);

  // Salva os dados da sessão após login ou cadastro
  function salvarSessao(novoToken: string, dadosUsuario: DadosUsuario) {
    // persiste no AsyncStorage para manter a sessão mesmo após fechar o app
    AsyncStorage.setItem('token', novoToken);
    AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    setToken(novoToken);
    setUsuario(dadosUsuario);
  }

  // Limpa tudo após logout
  function limparSessao() {
    // remove do AsyncStorage ao fazer logout
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }

  function atualizarUsuario(
  usuarioAtualizado: DadosUsuario,
) {
  setUsuario(usuarioAtualizado);

  AsyncStorage.setItem(
    "usuario",
    JSON.stringify(usuarioAtualizado),
  );
}

  return (
    <AuthContext.Provider value={{ token, usuario, estaLogado, carregandoSessao, salvarSessao, limparSessao, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook atalho para acessar o contexto de autenticação em qualquer componente do app. 
// Ele verifica se o contexto está disponível (ou seja, se o componente está dentro do AuthProvider) e retorna os 
// dados e funções de autenticação. Se alguém tentar usar esse hook fora do AuthProvider, ele lança um erro para ajudar a 
// identificar o problema.

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}