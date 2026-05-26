
// O contexto é como uma variável global do React ,Aqui guardamos o token e os dados do usuário logado, e 
// disponibilizamos para qualquer tela do app usar.

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DadosUsuario } from '../services/authService';

// tipos e descrição do formato de dados que o contexto vai armazenar e fornecer para os componentes. O token é a string JWT,

interface AuthContextType {
  token: string | null;         // O token JWT recebido da API
  usuario: DadosUsuario | null; // Os dados do usuário logado
  estaLogado: boolean;          // Atalho para saber se tem usuário logado
  salvarSessao: (token: string, usuario: DadosUsuario) => void; // Salva login
  limparSessao: () => void;     // Limpa logout
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

  // Calcula se está logado baseado no token
  const estaLogado = token !== null;

  // Salva os dados da sessão após login ou cadastro
  function salvarSessao(novoToken: string, dadosUsuario: DadosUsuario) {
    setToken(novoToken);
    setUsuario(dadosUsuario);
  }

  // Limpa tudo após logout
  function limparSessao() {
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ token, usuario, estaLogado, salvarSessao, limparSessao }}>
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