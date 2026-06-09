import AsyncStorage from '@react-native-async-storage/async-storage';
import * as sqlite from '../../database/sqlite';
import {
  fetchSensorLimitsFromDatabase,
  saveSensorLimitsToDatabase,
  loadPersistedSensorLimits,
} from '../../repositories/SensorLimitsRepository';

jest.mock('../../database/sqlite');

describe('SensorLimitsRepository', () => {
  const mockExecuteSelect = sqlite.executeSelect as jest.Mock;
  const mockExecuteUpdate = sqlite.executeUpdate as jest.Mock;
  const mockExecuteTransaction = sqlite.executeTransaction as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar limites de sensores do SQLite', async () => {
    mockExecuteSelect.mockResolvedValueOnce([
      {
        id_limite: 1,
        label: 'Limite de Temperatura',
        tipo_sensor: 'temperatura',
        min: 20,
        max: 26,
        unidade_medida: '°C',
      },
    ]);

    const result = await fetchSensorLimitsFromDatabase();

    expect(result).toEqual([
      {
        id_limite: 1,
        label: 'Limite de Temperatura',
        tipo_sensor: 'temperatura',
        min: 20,
        max: 26,
        unidade_medida: '°C',
      },
    ]);
    expect(mockExecuteSelect).toHaveBeenCalledWith(
      'SELECT id_limite, label, tipo_sensor, min, max, unidade_medida FROM limites_sensores ORDER BY label'
    );
  });

  it('deve salvar limites de sensores no SQLite usando transação', async () => {
    mockExecuteTransaction.mockImplementation(async (cb: any) => {
      await cb();
    });
    mockExecuteUpdate.mockResolvedValue(1);

    await saveSensorLimitsToDatabase([
      {
        label: 'Limite de Temperatura',
        tipo_sensor: 'temperatura',
        min: 20,
        max: 26,
        unidade_medida: '°C',
      },
      {
        label: 'Limite de Umidade',
        tipo_sensor: 'umidade',
        min: 40,
        max: 60,
        unidade_medida: '%',
      },
    ]);

    expect(mockExecuteTransaction).toHaveBeenCalled();
    expect(mockExecuteUpdate).toHaveBeenCalledWith('DELETE FROM limites_sensores');
    expect(mockExecuteUpdate).toHaveBeenCalledWith(
      'INSERT INTO limites_sensores (label, tipo_sensor, min, max, unidade_medida) VALUES (?, ?, ?, ?, ?)',
      ['Limite de Temperatura', 'temperatura', 20, 26, '°C']
    );
    expect(mockExecuteUpdate).toHaveBeenCalledWith(
      'INSERT INTO limites_sensores (label, tipo_sensor, min, max, unidade_medida) VALUES (?, ?, ?, ?, ?)',
      ['Limite de Umidade', 'umidade', 40, 60, '%']
    );
  });

  it('deve migrar limites legados do AsyncStorage quando não houver dados no SQLite', async () => {
    mockExecuteSelect.mockResolvedValueOnce([]); // Verifica se há dados no SQLite (retorna vazio)
    // O método migrateLimitsFromLegacyStorage faz uma segunda consulta de segurança antes de migrar.  simula vazio também.
    mockExecuteSelect.mockResolvedValueOnce([]);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([
        {
          label: 'Limite de Temperatura',
          min: 20,
          max: 26,
          unit: '°C',
        },
      ])
    );
    mockExecuteTransaction.mockImplementation(async (cb: any) => {
      await cb();
    });
    mockExecuteUpdate.mockResolvedValue(1);
    mockExecuteSelect.mockResolvedValueOnce([
      {
        id_limite: 1,
        label: 'Limite de Temperatura',
        tipo_sensor: 'temperatura',
        min: 20,
        max: 26,
        unidade_medida: '°C',
      },
    ]);

    const result = await loadPersistedSensorLimits();

    expect(result).toEqual([
      {
        id_limite: 1,
        label: 'Limite de Temperatura',
        tipo_sensor: 'temperatura',
        min: 20,
        max: 26,
        unidade_medida: '°C',
      },
    ]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('limites_sensores');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('limites_sensores');
  });
});
