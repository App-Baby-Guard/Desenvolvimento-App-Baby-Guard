// Esse arquivo serve pra traduzir os códigos de erro HTTP (que vêm da API) em
// frases simples que o usuário entende. Em vez de mostrar "Error 500" ou algo
// técnico, a gente mostra uma mensagem amigável explicando o que aconteceu.

// recebe o status da resposta (401, 404, 500...) e, se o servidor já mandou uma
// mensagem pronta, ela tem prioridade. Senão, traduzimos pelo código.
export function obterMensagemErro(status?: number, mensagemDoServidor?: string): string {
  if (mensagemDoServidor) return mensagemDoServidor;

  switch (status) {
    case 400:
      return 'Dados inválidos. Verifique as informações e tente novamente.';
    case 401:
      return 'E-mail ou senha incorretos.';
    case 403:
      return 'Você não tem permissão para fazer isso.';
    case 404:
      return 'Não encontramos o que você está procurando.';
    case 500:
      return 'Erro no servidor. Tente novamente mais tarde.';
    default:
      // sem status conhecido = provavelmente caiu por falha de conexão
      return 'Não foi possível conectar ao servidor.';
  }
}
