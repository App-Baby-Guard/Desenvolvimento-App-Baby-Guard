import { ApiResponse, PaginatedResponse } from "../types";

export class Respostas {
  static sucesso<T>(dados: T, mensagem = "Sucesso"): ApiResponse<T> {
    return { sucesso: true, mensagem, dados };
  }

  static criado<T>(dados: T, mensagem = "Criado com sucesso"): ApiResponse<T> {
    return { sucesso: true, mensagem, dados };
  }

  static erro(mensagem: string, erro?: string): ApiResponse {
    return { sucesso: false, mensagem, erro: erro || null };
  }

  static erroInterno(erro?: string): ApiResponse {
    return {
      sucesso: false,
      mensagem: "Erro interno do servidor",
      erro: erro || null,
    };
  }

  static validacaoFalhou(erros: string[]): ApiResponse {
    return {
      sucesso: false,
      mensagem: "Validação falhou",
      erro: erros.join(", "),
    };
  }

  static naoEncontrado(recurso: string): ApiResponse {
    return { sucesso: false, mensagem: `${recurso} não encontrado` };
  }

  static naoAutorizado(mensagem = "Não autorizado"): ApiResponse {
    return { sucesso: false, mensagem };
  }

  static proibido(mensagem = "Acesso proibido"): ApiResponse {
    return { sucesso: false, mensagem };
  }

  static conflito(mensagem: string): ApiResponse {
    return { sucesso: false, mensagem };
  }

  static paginado<T>(
    dados: T[],
    pagina: number,
    limite: number,
    total: number,
  ): PaginatedResponse<T> {
    return {
      sucesso: true,
      mensagem: "Dados paginados",
      dados,
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}
