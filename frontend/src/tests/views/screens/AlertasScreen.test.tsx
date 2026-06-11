import React from 'react';
import AlertasScreen from '../../../views/screens/AlertasScreen';
import { render } from '@testing-library/react-native';

// Mocks para evitar requisições reais e banco de dados SQLite não inicializado
jest.mock('../../../services/blynkService', () => ({
  BLYNK_STATIC_TOKEN: 'mock-token',
  obterStatusBlynk: jest.fn().mockResolvedValue({ v7: '1' }),
}));

jest.mock('../../../services/leiturasService', () => ({
  limparHistoricoGeral: jest.fn().mockResolvedValue(undefined),
  buscarHistoricoLeituras: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../../repositories/SensorLimitsRepository', () => ({
  loadPersistedSensorLimits: jest.fn().mockResolvedValue([]),
}));

describe('Componente AlertasScreen (UI Test)', () => {

  // TESTE DE UI
  // Verifica se o layout da tela de alertas é renderizado corretamente
  it('deve renderizar o layout da tela de alertas', async () => {
    const { getAllByText, getByText } = await render(<AlertasScreen />);

    // 'Alertas' aparece no título e no botão de filtro — usamos getAllByText
    expect(getAllByText('Alertas').length).toBeGreaterThan(0);
    expect(getByText('Leituras')).toBeTruthy();
  });
});