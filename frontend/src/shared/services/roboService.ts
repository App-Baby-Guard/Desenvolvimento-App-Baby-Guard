import { Robo } from "../../context/RoboContext";

class RoboService {
  async registrarRobo(robo: Robo): Promise<Robo> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return robo; // mock
  }

  async listarRobos(): Promise<Robo[]> {
    return []; // mock
  }
}

export const roboService = new RoboService();