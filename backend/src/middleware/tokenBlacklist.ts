const blacklist = new Set<string>();

export const adicionarTokenBlacklist = (token: string) => blacklist.add(token);
export const tokenEstaNaBlacklist = (token: string) => blacklist.has(token);
export const removerTokenBlacklist = (token: string) => blacklist.delete(token);
export const limparBlacklist = () => blacklist.clear();
export const totalTokensBlacklist = () => blacklist.size;
