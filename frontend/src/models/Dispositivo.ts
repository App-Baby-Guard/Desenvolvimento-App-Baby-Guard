// interface para representar a tabela do  dispositivo

export interface Dispositivo {
  id_dispositivo?: number;        
  uuid_dispositivo: string;       
  id_usuario?: number;            
  nome_dispositivo: string;       
  status_dispositivo: 'online' | 'offline'; 
  ativo: 0 | 1;                   // 0=inativo, 1=ativo
  criado_em?: string;            
  atualizado_em?: string;      
}

// Usado quando CRIAR um dispositivo (sem IDs auto-gerados)
export type CreateDispositivoInput = Omit<
  Dispositivo,
  'id_dispositivo' | 'criado_em' | 'atualizado_em'
>;

// Usado quando ATUALIZAR um dispositivo (campos opcionais)
export type UpdateDispositivoInput = Partial<CreateDispositivoInput>;