export interface Dispositivo {
  id_dispositivo: number;
  uuid_dispositivo: string;
  id_usuario: number;
  nome_dispositivo: string;
  token_dispositivo?: string | null;
  status_dispositivo: "online" | "offline" | "manutencao";
  ativo: boolean;
  criado_em: Date;
}