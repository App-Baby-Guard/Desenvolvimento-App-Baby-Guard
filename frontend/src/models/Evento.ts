// interface para representar um evento

export interface Evento {
  id_evento?: number;             
  id_dispositivo: number;         
  id_sensor?: number;             
  tipo_evento: string;            // Tipo: TEMPERATURA_ALTA, etc
  nivel_criticidade: 'normal' | 'aviso' | 'crítico'; // Severidade
  data_evento?: string;           
  sincronizado: 0 | 1;            // 0=local, 1=sincronizado
}

export type CreateEventoInput = Omit<Evento, 'id_evento' | 'data_evento'>;
export type UpdateEventoInput = Partial<CreateEventoInput>;