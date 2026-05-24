import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { RoboProvider } from "./context/RoboContext";
import RootNavigator from "./routes/RootNavigator";
import { initDatabase } from "./database/sqlite";
import { createTables } from "./database/migrations/schema";

export default function App() {

  //inicializa o banco de dados quando abre o app
  useEffect(() => {
    async function setupDatabase() {
      try {
        console.log('Iniciando configuração do banco de dados SQLite...');

        //abre coneção do SQLite
        await initDatabase();

        //cria tabelas
        const db = require('./database/sqlite').getDatabase();
        await createTables(db);

        console.log('Configuração do banco de dados SQLite concluída com sucesso!');
      }
      catch (error) {
        console.error('Erro durante configuração do banco de dados SQLite:', error);
      }
    }
    setupDatabase();
  }, []); //vai executar so uma vez quando o app abre

  return (
    <RoboProvider>
      <RootNavigator />
    </RoboProvider>
  );
}