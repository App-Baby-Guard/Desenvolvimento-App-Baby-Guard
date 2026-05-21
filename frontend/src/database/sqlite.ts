//Inicialização do SQLite

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('babyguard.db'); //cria o BD

// Executa SQL
db.transaction((tx) => {
  tx.executeSql('CREATE TABLE ...', [], 
    (_, result) => console.log('Sucesso'),  
    (_, error) => console.log('Erro')       
  );
});

export default db;

