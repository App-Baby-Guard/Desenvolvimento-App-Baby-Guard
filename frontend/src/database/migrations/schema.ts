// schema completo do banco de dados, incluindo as tabelas e suas relações
//Schema é o "desenho" do banco - quais tabelas, quais campos cada uma tem.

const SCHEMA = {
  // Tabela 1: DISPOSITIVOS
  // Guarda os robos registrados do usuario
  DISPOSITIVOS: `
    CREATE TABLE IF NOT EXISTS dispositivos (
      id_dispositivo INTEGER PRIMARY KEY,
      uuid_dispositivo TEXT UNIQUE NOT NULL,
      id_usuario INTEGER,
      nome_dispositivo TEXT NOT NULL,
      token_dispositivo TEXT,
      status_dispositivo TEXT DEFAULT 'offline',
      ativo INTEGER DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabela 2: SENSORES
  SENSORES: `
    CREATE TABLE IF NOT EXISTS sensores (
      id_sensor INTEGER PRIMARY KEY,
      id_dispositivo INTEGER NOT NULL,
      nome_sensor TEXT,
      tipo_sensor TEXT NOT NULL,
      unidade_medida TEXT,
      descricao TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_dispositivo) REFERENCES dispositivos(id_dispositivo)
    );
  `,

  // Tabela 3: LEITURAS
  LEITURAS: `
    CREATE TABLE IF NOT EXISTS leituras (
      id_leitura INTEGER PRIMARY KEY,
      id_sensor INTEGER NOT NULL,
      valor REAL,
      valor_booleano INTEGER,
      movimento INTEGER,
      data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (id_sensor) REFERENCES sensores(id_sensor)
    );
  `,

  // Tabela 4: EVENTOS
  EVENTOS: `
    CREATE TABLE IF NOT EXISTS eventos (
      id_evento INTEGER PRIMARY KEY,
      id_dispositivo INTEGER NOT NULL,
      id_sensor INTEGER,
      tipo_evento TEXT NOT NULL,
      nivel_criticidade TEXT DEFAULT 'baixo',
      data_evento DATETIME DEFAULT CURRENT_TIMESTAMP,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (id_dispositivo) REFERENCES dispositivos(id_dispositivo),
      FOREIGN KEY (id_sensor) REFERENCES sensores(id_sensor)
    );
  `,

  // Tabela 5: SINCRONIZACAO
  SINCRONIZACAO: `
    CREATE TABLE IF NOT EXISTS sincronizacao (
      id INTEGER PRIMARY KEY,
      ultima_sincronizacao DATETIME,
      pendente_sincronizacao INTEGER DEFAULT 1,
      erro_ultima_sincronizacao TEXT
    );
  `,
};

export default SCHEMA;