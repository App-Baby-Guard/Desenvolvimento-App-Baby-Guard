import { Robo } from "../context/RoboContext";

export function registrarRobo(
  nome: string,
  id: string,
  local: string | undefined,
  addRobo: (r: Robo) => void
) {
  if (!nome.trim()) throw new Error("O nome do robô é obrigatório.");
  if (!id.trim()) throw new Error("O ID do dispositivo é obrigatório.");

  const novoRobo: Robo = {
    id,
    nome,
    local: local || "",
    status: "config",
    ultimoSinal: "agora",
  };

  addRobo(novoRobo);
  return novoRobo;
}