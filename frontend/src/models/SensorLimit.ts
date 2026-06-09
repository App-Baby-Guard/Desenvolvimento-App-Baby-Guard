export interface SensorLimit {
  id_limite?: number;
  label: string;
  tipo_sensor: string;
  min: number;
  max: number;
  unidade_medida?: string;
}

export type SensorLimitInput = Omit<SensorLimit, 'id_limite'>;
