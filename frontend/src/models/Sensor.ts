// interface do sensor

export interface Sensor {
  id_sensor?: number;
  id_dispositivo: number;
  nome_sensor: string;
  tipo_sensor: string;
  unidade_medida?: string;        // Unidade: °C, %, hPa (opcional)
  criado_em?: string;
}

export type CreateSensorInput = Omit<Sensor, 'id_sensor' | 'criado_em'>;
export type UpdateSensorInput = Partial<CreateSensorInput>;