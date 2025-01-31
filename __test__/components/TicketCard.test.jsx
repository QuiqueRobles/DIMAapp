// __tests__/TicketCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native'; // Import render
import TicketCard from '../../src/components/TicketCard'; // Adjust the import path as needed

describe('TicketCard', () => {
  it('renders ticket details correctly', () => {
    const ticket = {
      event: { name: 'Concert' },
      club: { name: 'Club XYZ' },
      event_date: '2024-06-01T20:00:00Z',
      num_people: 2,
      total_price: 50.0,
    };
    const { getByText } = render(<TicketCard ticket={ticket} onPress={jest.fn()} />);
    expect(getByText('Concert')).toBeTruthy(); // Check if event name is rendered
    expect(getByText('Club XYZ')).toBeTruthy(); // Check if club name is rendered
  });
});