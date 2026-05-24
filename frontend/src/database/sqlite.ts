//Inicialização do SQLite: gerencia o banco de dados, abre, inicializa e gerencia conexões com SQLite

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

// abre o arquivo do abnco de dados SQLite, se não existir, ele será criado automaticamente
export async function initDatabase(): Promise<void> {
  try {
    console.log('[DB] Inicializando banco de dados SQLite...');

    db = await SQLite.openDatabaseAsync('babyguard.db');

    console.log('[DB] Banco de dados SQLite inicializado com sucesso!');
    console.log('[DB] Arquivo: babyguard.db');

  } catch (error) {
    console.error('[DB] Erro ao inicializar o banco de dados SQLite:', error);
    throw error;
  }
}

// função para obter a conexão com o banco de dados
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Banco de dados SQLite não inicializado.');
  }
  return db;
}

// função para executar consultas SQL 
export async function executeSelect<T>(
  query: string,
  params?: any[]
): Promise<T[]> {
  try {
    const database = getDatabase();

    // Executa SELECT que retorna varias linhas
    // Retorna array (pode ser vazio)
    const result = await database.getAllAsync<T>(
      query,
      params ?? []
    );
    return result || [];
  } catch (error) {
    console.error('ERRO em SELECT:', {
      query,
      params,
      error
    });
    throw error;
  }
}

export async function executeSelectOne<T>(
  query: string,
  params?: any[]
): Promise<T | null> {
  try {
    const database = getDatabase();

    // Executa SELECT que retorna uma única linha
    // Retorna objeto ou null
    const result = await database.getFirstAsync<T>(
      query,
      params ?? []
    );
    return result || null;
  } catch (error) {
    console.error('ERRO em SELECT ONE:', {
      query,
      params,
      error
    });
    throw error;
  }
}

export async function executeUpdate(
  query: string,
  params?: any[]
): Promise<number> {
  try {
    const database = getDatabase();

    // Executa UPDATE/INSERT/DELETE
    const result = await database.runAsync(
      query,
      params ?? []
    );
    // Retorna o número de linhas afetadas
    return result.changes || 0;
  } catch (error) {
    console.error('ERRO em UPDATE/INSERT/DELETE:', {
      query,
      params,
      error
    });
    throw error;
  }
}

// função para executar um batch(várias consultas em sequência)
export async function executeBatch(
  queries: Array<{ sql: string; params?: any[] }>
): Promise<void> {
  try {
    const database = getDatabase();

    //executa cada consulta na ordem
    for (const { sql, params } of queries) {
      await database.runAsync(
        sql,
        params ?? []
      );
    }

    console.log('[DB] Batch de consultas executado (${queries.length}) com sucesso!');
  } catch (error) {
    console.error('[DB] Erro em BATCH:', error);
    throw error;
  }
}

// função para executar uma transação (várias consultas que são atômicas, ou seja, todas devem ser bem-sucedidas ou nenhuma é aplicada)
export async function executeTransaction(
  callback: () => Promise<void>
): Promise<void> {
  try {
    const database = getDatabase();

    //withTransactionAsync: gerencia automaticamente o BEGIN (transação), COMMIT (salva) e ROLLBACK (desfaz tudo)
    await database.withTransactionAsync(async () => {
      await callback();
    });

    console.log('[DB] Transação concluída com sucesso');
  } catch (error) {
    console.error('[DB] Erro em transação (ROLLBACK automático):', error);
    throw error;
  }
}

export async function listTables(): Promise<void> {
  try {
    const database = getDatabase();

    const tables = await database.getAllAsync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    );
    console.log('[DB] Tabelas no banco de dados:', tables.map((t: any) => t.name));
  } catch (error) {
    console.error('[DB] Erro ao listar tabelas:', error);
    throw error;
  }
}