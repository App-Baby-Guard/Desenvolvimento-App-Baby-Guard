//aqui estamos importando as bibliotecas e componentes necessários para o funcionamento do app. O React é a biblioteca principal
//  para construir a interface, o Toast é usado para mostrar mensagens de feedback para o usuário, 
// os providers de contexto (AuthProvider) são usados para gerenciar o estado global de autenticação, 
// o RootNavigator é o componente que gerencia a navegação entre as telas do app, e as funções initDatabase e createTables são
//  usadas para configurar o banco de dados SQLite.
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./context/AuthContext";
import RootNavigator from "./routes/RootNavigator";
import { initDatabase } from "./database/sqlite";
import { createTables } from "./database/migrations/schema";
//exportando o componente principal do app, onde configuramos o contexto de autenticação, 
// além de inicializar o banco de dados SQLite e criar as tabelas necessárias. O RootNavigator é o componente que 
// gerencia a navegação entre as telas do app, e o Toast é usado para mostrar mensagens de feedback para o usuário.
export default function App() {
//usei isso para rodar a função de configuração do banco de dados apenas uma vez, 
// quando o app é iniciado. Dentro do useEffect,
  useEffect(() => {
    async function setupDatabase() {
      try {
        console.log('Iniciando configuração do banco de dados SQLite...');
        await initDatabase();
        const db = require('./database/sqlite').getDatabase();
        await createTables(db);
        console.log('Configuração do banco de dados SQLite concluída com sucesso!');
      }
      catch (error) {
        console.error('Erro durante configuração do banco de dados SQLite:', error);
      }
    }
    setupDatabase();
  }, []);
//aqui vai retornar a estrutura do app, com os providers de contexto e o navigator.
//  O AuthProvider envolve todo o app para fornecer acesso aos dados de autenticação em qualquer tela.
//  O RootNavigator gerencia as telas e a navegação, e o Toast é colocado no topo para mostrar mensagens de feedback em qualquer
//  lugar do app.
  return (
    <AuthProvider>
      <RootNavigator />
      <Toast />
    </AuthProvider>
  );
}