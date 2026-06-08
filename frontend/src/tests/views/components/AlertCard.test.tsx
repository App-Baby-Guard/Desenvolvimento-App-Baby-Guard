import React from 'react';
import AlertCard from '../../../views/components/AlertCard';
import { render, fireEvent } from '@testing-library/react-native';

describe('Componente AlertCard (UI Test)', () => {

  // TESTE DE UI
  // Verifica se o componente renderiza corretamente os dados do alerta na interface
  it('deve renderizar os detalhes do alerta e exibir corretamente as informações', async () => {
    const mockOnDismiss = jest.fn();

    const { getByText } = await render(
      <AlertCard
        iconName="notifications-outline"
        iconColor="#FF0000"
        title="Bebê Chorando"
        description="Áudio captado acima do limite de ruído."
        time="14:30"
        onDismiss={mockOnDismiss}
      />
    );

    expect(getByText('Bebê Chorando')).toBeTruthy();
    expect(getByText('Áudio captado acima do limite de ruído.')).toBeTruthy();
    expect(getByText('14:30')).toBeTruthy();
  });
});