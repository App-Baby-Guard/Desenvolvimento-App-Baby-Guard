export interface Evento {
  id_evento: number;
  id_dispositivo: number;
  id_sensor?: number | null;
  tipo_evento: string;
  nivel_criticidade?: "baixo" | "medio" | "alto" | "critico" | null;
  data_evento: Date;
}