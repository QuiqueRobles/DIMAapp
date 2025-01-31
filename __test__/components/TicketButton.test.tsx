// __tests__/TicketButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TicketButton from '../../src/components/TicketButton';
import { useNavigation } from '@react-navigation/native';

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('TicketButton', () => {
  it('navigates to BuyTicket screen on press', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    const mockEvent = {
      id: '1',
      created_at: '2024-04-10T12:00:00Z',
      club_id: 'club456',
      date: '2024-05-15T20:00:00Z',
      name: 'Concert',
      price: 2000,
      description: 'Live Music Event',
      image: null,
    };

    const { getByText } = render(<TicketButton event={mockEvent} clubName="Club XYZ" />);
    fireEvent.press(getByText('Buy Ticket'));

    expect(mockNavigate).toHaveBeenCalledWith('BuyTicket', {
      eventId: mockEvent.id,
      eventName: mockEvent.name || 'Unnamed Event',
      eventDate: mockEvent.date,
      eventPrice: mockEvent.price !== null ? mockEvent.price / 100 : 0,
      clubName: 'Club XYZ',
      eventDescription: mockEvent.description,
      eventImage: mockEvent.image,
      clubId: mockEvent.club_id,
    });
  });
});