// interface da leitura

export interface Leitura {
  id_leitura: number;
  id_sensor: number;
  valor?: number | null;
  valor_booleano?: boolean | null;
  movimento?: boolean | null;
  data_hora: string;
  sincronizado: boolean;
}