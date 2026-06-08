import React from 'react';
import LoginScreen from '../../../views/screens/LoginScreen';
import { render } from '@testing-library/react-native';

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    salvarSessao: jest.fn(),
  }),
}));

describe('Componente LoginScreen (UI Test)', () => {

  // TESTE DE UI
  // Verifica se o layout da tela de login é renderizado corretamente
  it('deve renderizar o layout de login', async () => {
    const { getByText, getByPlaceholderText } = await render(
      <LoginScreen navigation={{} as any} />
    );

    expect(getByText('BabyGuard')).toBeTruthy();
    expect(getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Sua senha')).toBeTruthy();
  });
});