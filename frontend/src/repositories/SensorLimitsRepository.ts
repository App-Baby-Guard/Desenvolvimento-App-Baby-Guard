import AsyncStorage from '@react-native-async-storage/async-storage';
import { executeSelect, executeTransaction, executeUpdate } from '../database/sqlite';
import { SensorLimit, SensorLimitInput } from '../models/SensorLimit';

// Chave usada para ler dados antigos de limites de sensor salvos em AsyncStorage- armazenamento "legacy" (legado)
const LEGACY_SENSOR_LIMITS_KEY = 'limites_sensores';

// Busca todos os limites de sensor que já estão salvos no banco SQLite.
export async function fetchSensorLimitsFromDatabase(): Promise<SensorLimit[]> {
  const query = `SELECT id_limite, label, tipo_sensor, min, max, unidade_medida FROM limites_sensores ORDER BY label`;
  return await executeSelect<SensorLimit>(query);
}

// Sobrescreve todos os limites de sensor no SQLite.
export async function saveSensorLimitsToDatabase(limits: SensorLimitInput[]): Promise<void> {
  await executeTransaction(async () => {
    await executeUpdate('DELETE FROM limites_sensores');

    for (const limit of limits) {
      await executeUpdate(
        `INSERT INTO limites_sensores (label, tipo_sensor, min, max, unidade_medida) VALUES (?, ?, ?, ?, ?)`,
        [limit.label, limit.tipo_sensor, limit.min, limit.max, limit.unidade_medida ?? null]
      );
    }
  });
}

// Se não houver nada no SQLite, tenta migrar dados antigos do AsyncStorage.
export async function migrateLimitsFromLegacyStorage(): Promise<SensorLimit[]> {
  const persistedLimits = await fetchSensorLimitsFromDatabase();
  if (persistedLimits.length > 0) {
    return persistedLimits;
  }

  const storedLegacyValue = await AsyncStorage.getItem(LEGACY_SENSOR_LIMITS_KEY);
  if (!storedLegacyValue) {
    return [];
  }

  try {
    const legacySensorLimits = JSON.parse(storedLegacyValue) as Array<{
      label: string;
      min: number;
      max: number;
      unit: string;
    }>;

    const sensorLimitsToSave: SensorLimitInput[] = legacySensorLimits.map((item) => ({
      label: item.label,
      // o limite é de temperatura ou umidade a partir do texto do rótulo.
      tipo_sensor: item.label.toLowerCase().includes('temperatura') ? 'temperatura' : 'umidade',
      min: Number(item.min),
      max: Number(item.max),
      unidade_medida: item.unit,
    }));

    await saveSensorLimitsToDatabase(sensorLimitsToSave);
    await AsyncStorage.removeItem(LEGACY_SENSOR_LIMITS_KEY);

    // Retorna os limites agora gravados no SQLite.
    return await fetchSensorLimitsFromDatabase();
  } catch (error) {
    console.log('[REPO] Falha ao migrar limites legados', error);
    return [];
  }
}

// Carrega os limites persistidos usando SQLite sempre que possível.
// Se não existir nada no SQLite, faz a migração dos dados legados.
export async function loadPersistedSensorLimits(): Promise<SensorLimit[]> {
  const savedLimits = await fetchSensorLimitsFromDatabase();
  if (savedLimits.length > 0) {
    return savedLimits;
  }

  return await migrateLimitsFromLegacyStorage();
}
