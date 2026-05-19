import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Robo {
  id: string;
  nome: string;
  local?: string;
  status: string;
  ultimoSinal?: string;
}

interface RoboContextType {
  robos: Robo[];
  addRobo: (robo: Robo) => void;
  updateRobo: (id: string, data: Partial<Robo>) => void;
  removeRobo: (id: string) => void;
  getRoboById: (id: string) => Robo | undefined;
}

const RoboContext = createContext<RoboContextType | undefined>(undefined);

export function RoboProvider({ children }: { children: ReactNode }) {
  const [robos, setRobos] = useState<Robo[]>([]);

  function addRobo(robo: Robo) {
    setRobos((prev) => [...prev, robo]);
  }

  function updateRobo(id: string, data: Partial<Robo>) {
    setRobos((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }

  function removeRobo(id: string) {
    setRobos((prev) => prev.filter((r) => r.id !== id));
  }

  function getRoboById(id: string) {
    return robos.find((r) => r.id === id);
  }

  return (
    <RoboContext.Provider
      value={{ robos, addRobo, updateRobo, removeRobo, getRoboById }}
    >
      {children}
    </RoboContext.Provider>
  );
}

export function useRobos() {
  const ctx = useContext(RoboContext);
  if (!ctx) throw new Error("useRobos deve ser usado dentro de RoboProvider");
  return ctx;
}