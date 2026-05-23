// interface da leitura

export interface Leitura {
  id_leitura?: number;            
  id_sensor: number;              
  valor?: number;                 
  valor_booleano?: 0 | 1;         
  movimento?: 0 | 1;              // Especial para PIR
  data_hora?: string;             
  sincronizado: 0 | 1;            // 0=local, 1=sincronizado
}

export type CreateLeituraInput = Omit<Leitura, 'id_leitura' | 'data_hora'>;
export type UpdateLeituraInput = Partial<CreateLeituraInput>;