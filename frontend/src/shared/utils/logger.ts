// Esse arquivo serve pra padronizar os logs do app. Em vez de cada arquivo usar
// console.log do seu próprio jeito (cada um com um prefixo diferente), todo mundo
// passa a usar essas duas funções daqui. Assim fica mais fácil achar de onde veio
// o log e diferenciar uma informação normal de um erro.

// log de algo que aconteceu normalmente (sem erro), só pra acompanhar o fluxo
export function logInfo(origem: string, mensagem: string, dado?: any) {
  console.log(`[${origem}] ${mensagem}`, dado ?? '');
}

// log de erro, pra usar dentro dos catch e ajudar a depurar depois
export function logErro(origem: string, mensagem: string, erro?: any) {
  console.error(`[${origem}] ERRO: ${mensagem}`, erro ?? '');
}
