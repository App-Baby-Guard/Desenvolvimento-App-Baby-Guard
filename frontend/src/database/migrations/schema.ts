// schema completo do banco de dados, incluindo as tabelas e suas relações
//Schema é o "desenho" do banco - quais tabelas, quais campos cada uma tem.

const SCHEMA = {
  // Tabela 1: DISPOSITIVOS
  // Guarda os robos registrados do usuario
  dispositivos: `
    CREATE TABLE IF NOT EXISTS dispositivos (
      id_dispositivo INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid_dispositivo TEXT UNIQUE NOT NULL,
      id_usuario INTEGER,
      nome_dispositivo TEXT NOT NULL,
      status_dispositivo TEXT DEFAULT 'offline',
      ativo INTEGER DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabela 2: SENSORES
  sensores: `
    CREATE TABLE IF NOT EXISTS sensores (
      id_sensor INTEGER PRIMARY KEY AUTOINCREMENT,
      id_dispositivo INTEGER NOT NULL,
      nome_sensor TEXT NOT NULL,
      tipo_sensor TEXT NOT NULL,
      unidade_medida TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(id_dispositivo) REFERENCES dispositivos(id_dispositivo)
    );
  `,

  // Tabela 3: LEITURAS
  leituras: `
    CREATE TABLE IF NOT EXISTS leituras (
      id_leitura INTEGER PRIMARY KEY AUTOINCREMENT,
      id_sensor INTEGER NOT NULL,
      valor REAL,
      valor_booleano INTEGER,
      movimento INTEGER,
      data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY(id_sensor) REFERENCES sensores(id_sensor)
    );
  `,

  // Tabela 4: EVENTOS
  eventos: `
    CREATE TABLE IF NOT EXISTS eventos (
      id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
      id_dispositivo INTEGER NOT NULL,
      id_sensor INTEGER,
      tipo_evento TEXT NOT NULL,
      nivel_criticidade TEXT DEFAULT 'normal',
      data_evento DATETIME DEFAULT CURRENT_TIMESTAMP,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY(id_dispositivo) REFERENCES dispositivos(id_dispositivo),
      FOREIGN KEY(id_sensor) REFERENCES sensores(id_sensor)
    );
  `,
};

export async function createTables(db: any): Promise<void> {
  try {
    console.log('Criando tabelas do banco de dados SQLite...');

    //cria tabela DISPOSITIVOS
    await db.executeSqlAsync(SCHEMA.dispositivos);
    console.log('Tabela "dispositivos" criada ou já existe.');

    //cria tabela SENSORES
    await db.executeSqlAsync(SCHEMA.sensores);
    console.log('Tabela "sensores" criada ou já existe.');

    //cria tabela LEITURAS
    await db.executeSqlAsync(SCHEMA.leituras);
    console.log('Tabela "leituras" criada ou já existe.');

    //cria tabela EVENTOS
    await db.executeSqlAsync(SCHEMA.eventos);
    console.log('Tabela "eventos" criada ou já existe.');

    console.log('4 Tabelas do banco de dados SQLite criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas do banco de dados SQLite:', error);
    throw error;
  }
}

export default SCHEMA;