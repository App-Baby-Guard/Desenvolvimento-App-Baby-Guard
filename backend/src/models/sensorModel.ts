export interface Sensor {
  id_sensor: number;
  id_dispositivo: number;
  nome_sensor?: string | null;
  tipo_sensor: string;
  unidade_medida?: string | null;
  descricao?: string | null;
}