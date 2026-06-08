import React from 'react';
import DashboardScreen from '../../../views/screens/DashboardScreen';
import { render } from '@testing-library/react-native';

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: { nome: 'Thiago', email: 'thiago@test.com' }, 
  }),
}));

describe('Componente DashboardScreen (UI Test)', () => {

  // TESTE DE UI
  // Verifica se o layout do dashboard é renderizado corretamente
  it('deve renderizar o layout do dashboard', async () => {
    const { getByText } = await render(<DashboardScreen />);

    expect(getByText('BabyGuard')).toBeTruthy();
    expect(getByText('Monitoramento em tempo real')).toBeTruthy();
  });
});