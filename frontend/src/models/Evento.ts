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

// Usado quando CRIAR um evento (sem IDs auto-gerados)
export type CreateEventoInput = Omit<Evento, 'id_evento' | 'data_evento'>;

// Usado quando ATUALIZAR um evento (campos opcionais). Partial torna todos os campos opcionais, menos o ID
export type UpdateEventoInput = Partial<CreateEventoInput>;