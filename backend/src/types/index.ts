export type ApiResponse<T = any> = {
  sucesso: boolean;
  mensagem: string;
  dados?: T | null;
  erro?: string | string[] | null;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
};
