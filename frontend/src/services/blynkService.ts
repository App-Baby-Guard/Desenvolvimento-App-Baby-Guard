// Serviço para fazer chamadas diretas ao Blynk Cloud a partir do app.
// Isso permite enviar comandos para o ESP32 sem precisar passar pelo backend.

// Usa a URL pública do Blynk Cloud por padrão, mas permite sobrescrever via `EXPO_PUBLIC_BLYNK_BASE_URL` se necessário
const rawBlynkUrl = process.env.EXPO_PUBLIC_BLYNK_BASE_URL || "https://blynk.cloud/external/api";

function normalizeBlynkBaseUrl(rawUrl: string): string {
  return rawUrl
    .trim()
    .replace(/^['";]+|['";]+$/g, "")
    .replace(/\/+$/, "");
}

export const BLYNK_BASE_URL = normalizeBlynkBaseUrl(rawBlynkUrl);
export const BLYNK_STATIC_TOKEN = (process.env.EXPO_PUBLIC_BLYNK_TOKEN || "")
  .trim()
  .replace(/^['";]+|['";]+$/g, "");

function createBlynkUrl(path: string, token: string, query: string): string {
  if (!token) {
    throw new Error("Token do Blynk não está configurado");
  }
  const normalizedBase = BLYNK_BASE_URL.replace(/\/+$/, "");
  const url = `${normalizedBase}/${path}?token=${encodeURIComponent(token)}&${query}`;
  console.debug("[BLYNK SERVICE] Request URL:", url);
  return url;
}

async function fetchBlynkGet(token: string, query: string): Promise<any> {
  const url = createBlynkUrl("get", token, query);

  try {
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Falha Blynk GET: ${response.status} ${text}`);
    }
    return { v7: text.trim() };
  } catch (error: any) {
    console.error("[BLYNK SERVICE] Falha na requisição GET do Blynk:", url, error.message || error);
    throw error;
  }
}

async function fetchBlynkUpdate(token: string, query: string): Promise<string> {
  const url = createBlynkUrl("update", token, query);

  try {
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Falha Blynk UPDATE: ${response.status} ${text}`);
    }
    return text;
  } catch (error: any) {
    console.error("[BLYNK SERVICE] Falha na requisição UPDATE do Blynk:", url, error.message || error);
    throw error;
  }
}

export async function obterStatusBlynk(tokenBlynk: string): Promise<{ v7?: string } | null> {
  try {
    return await fetchBlynkGet(tokenBlynk, "v7");
  } catch (error: any) {
    console.error("[BLYNK SERVICE] Erro ao obter status do Blynk:", error.message || error);
    return null;
  }
}

export async function setValorBlynk(tokenBlynk: string, pino: string, valor: string | number): Promise<boolean> {
  try {
    await fetchBlynkUpdate(tokenBlynk, `${encodeURIComponent(pino)}=${encodeURIComponent(String(valor))}`);
    return true;
  } catch (error: any) {
    console.error("[BLYNK SERVICE] Erro ao enviar valor para o Blynk:", error.message || error);
    return false;
  }
}

export async function setStandbyBlynk(tokenBlynk: string, habilitar: boolean): Promise<boolean> {
  const valor = habilitar ? "1" : "0";
  return await setValorBlynk(tokenBlynk, "v7", valor);
}
