//aqui estamos importando as bibliotecas e componentes necessários para o funcionamento do app. O React é a biblioteca principal
//  para construir a interface, o Toast é usado para mostrar mensagens de feedback para o usuário, 
// os providers de contexto (AuthProvider) são usados para gerenciar o estado global de autenticação, 
// o RootNavigator é o componente que gerencia a navegação entre as telas do app, e as funções initDatabase e createTables são
//  usadas para configurar o banco de dados SQLite.

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
} from "react-native-paper";

import { AuthProvider } from "./context/AuthContext";

import {
  ThemeProvider,
  useTheme,
} from "./context/ThemeContext";

import RootNavigator from "./routes/RootNavigator";

import { initDatabase, listTables } from "./database/sqlite";
import { createTables } from "./database/migrations/schema";
import { getDatabase } from "./database/sqlite";

//exportando o componente principal do app, onde configuramos o contexto de autenticação, 
// além de inicializar o banco de dados SQLite e criar as tabelas necessárias. O RootNavigator é o componente que 
// gerencia a navegação entre as telas do app, e o Toast é usado para mostrar mensagens de feedback para o usuário.
function AppContent() {

  const { isDarkMode } = useTheme();

  const paperTheme = isDarkMode
    ? MD3DarkTheme
    : MD3LightTheme;

  const [isDbReady, setIsDbReady] = useState(false); //vê se o banco de dados está pronto

  //usei isso para rodar a função de configuração do banco de dados apenas uma vez, 
  // quando o app é iniciado. Dentro do useEffect,
  useEffect(() => {

    async function setupDatabase() {

      try {

        console.log('[APP] Iniciando configuração do banco de dados SQLite...');

        await initDatabase();

        const db = getDatabase();

        await createTables(db);

        console.log('[APP] Configuração do banco de dados SQLite concluída com sucesso!');

        console.log('[App] Verificando as tabelas estruturais...');//LISTA as tabelas para garantir que foram criadas 

        await listTables();

      }
      catch (error) {

        console.error('[APP]Erro durante configuração do banco de dados SQLite:', error);

      }
      finally {

        setIsDbReady(true); //indica que o banco de dados está pronto, mesmo que tenha dado erro

      }
    }

    setupDatabase();

  }, []);

  if (!isDbReady) { //enquanto o banco de dados não estiver pronto, mostra na tela q vai com os locais

    return (
      <PaperProvider theme={paperTheme}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? "#121212" : "#FFFFFF",
          }}
        >
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#FFFFFF" : "#2ECC71"}
          />

          <Text
            style={{
              marginTop: 10,
              color: isDarkMode ? "#FFFFFF" : "#000000",
            }}
          >
            Iniciando serviços locais...
          </Text>
        </View>
      </PaperProvider>
    );
  }

  //aqui vai retornar a estrutura do app, com os providers de contexto e o navigator.
  //  O AuthProvider envolve todo o app para fornecer acesso aos dados de autenticação em qualquer tela.
  //  O RootNavigator gerencia as telas e a navegação, e o Toast é colocado no topo para mostrar mensagens de feedback em qualquer
  //  lugar do app.
  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <RootNavigator />
        <Toast />
      </AuthProvider>
    </PaperProvider>
  );
}

//exportando o componente principal do app, onde configuramos o contexto de autenticação, 
// além de inicializar o banco de dados SQLite e criar as tabelas necessárias. O RootNavigator é o componente que 
// gerencia a navegação entre as telas do app, e o Toast é usado para mostrar mensagens de feedback para o usuário.
export default function App() {

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}