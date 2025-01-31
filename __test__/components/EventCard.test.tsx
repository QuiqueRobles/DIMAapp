// __tests__/EventCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventCard from '../../src/components/EventCard';
import { LinearGradient } from 'expo-linear-gradient';

jest.mock('expo-linear-gradient', () => ({ LinearGradient: ({ children }) => children }));

describe('EventCard', () => {
  const mockEvent = {
    id: '1',
    date: '2023-12-31T00:00:00Z',
    name: 'New Year Party',
    price: 5000,
    description: 'Celebrate New Year with us!',
    image: 'https://example.com/image.jpg',
  };
  const mockOnBuyTicket = jest.fn();

  it('renders event details correctly', () => {
    const { getByText } = render(
      <EventCard event={mockEvent} clubName="Club XYZ" onBuyTicket={mockOnBuyTicket} />
    );

    expect(getByText('New Year Party')).toBeTruthy();
    expect(getByText('December 31, 2023')).toBeTruthy();
    expect(getByText('Club XYZ')).toBeTruthy();
    expect(getByText('$50.00')).toBeTruthy();
  });

  it('triggers onBuyTicket when button is pressed', () => {
    const { getByText } = render(
      <EventCard event={mockEvent} clubName="Club XYZ" onBuyTicket={mockOnBuyTicket} />
    );

    fireEvent.press(getByText('Buy Ticket'));
    expect(mockOnBuyTicket).toHaveBeenCalled();
  });
});
