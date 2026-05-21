// interface do evento

export interface Sensor {
  id_sensor: number;
  id_dispositivo: number;
  nome_sensor?: string | null;
  tipo_sensor: 'temperatura' | 'umidade' | 'luminosidade' | 'proximidade' | 'movimento';
  unidade_medida?: string | null;
  descricao?: string | null;
  criado_em: string;
}