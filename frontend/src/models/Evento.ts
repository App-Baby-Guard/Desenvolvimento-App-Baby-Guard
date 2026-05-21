// interface para representar um evento

export interface Evento {
  id_evento: number;
  id_dispositivo: number;
  id_sensor?: number | null;
  tipo_evento: string;
  nivel_criticidade: 'baixo' | 'medio' | 'alto' | 'critico';
  data_evento: string;
  sincronizado: boolean;
}