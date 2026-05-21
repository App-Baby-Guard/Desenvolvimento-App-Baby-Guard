
export interface SincronizacaoStatus {
  id: number;
  ultima_sincronizacao?: string | null;
  pendente_sincronizacao: boolean;
  erro_ultima_sincronizacao?: string | null;
}