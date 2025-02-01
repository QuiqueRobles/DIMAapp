import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import CalendarScreen from '@/screens/CalendarScreen';
import { supabase } from '@/lib/supabase';

// Mock de Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [
            {
              id: '1',
              date: '2024-01-15',
              name: 'Test Event',
              price: 2000,
              description: 'Evento de prueba',
              image: null
            }
          ],
          error: null
        }))
      }))
    }))
  }
}));

// Función para renderizar la pantalla con navegación
const renderWithNavigation = () => {
  return render(
    <NavigationContainer>
      <CalendarScreen route={{ params: { clubId: '123', clubName: 'Test Club' } }} />
    </NavigationContainer>
  );
};

describe('CalendarScreen', () => {
  it('fetches and displays events', async () => {
    const { queryByText } = renderWithNavigation();

    await waitFor(() => {
      expect(queryByText('Test Event')).toBeTruthy();
    });
  });

  it('navigates to BuyTicket when an event is selected', async () => {
    const { getByText, getByTestId } = renderWithNavigation();

    await waitFor(() => {
      expect(getByText('Test Event')).toBeTruthy();
    });

    fireEvent.press(getByText('Test Event'));

    await waitFor(() => {
      expect(getByTestId('buy-ticket-button')).toBeTruthy();
    });
  });
});
