// __tests__/ExpandedTicket.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ExpandedTicket from '../../src/components/ExpandedTicket';

describe('ExpandedTicket', () => {
  const mockTicket = {
    id: '12345',
    event: { name: 'Concert Night' },
    club: { name: 'Club XYZ' },
    event_date: '2024-05-10T20:00:00Z',
    num_people: 2,
    total_price: 100,
    purchase_date: '2024-04-01T15:00:00Z',
    profiles: { username: 'JohnDoe' },
  };
  const mockOnClose = jest.fn();

  it('renders ticket details correctly', () => {
    const { getByText } = render(<ExpandedTicket ticket={mockTicket} onClose={mockOnClose} />);
    expect(getByText('Concert Night')).toBeTruthy();
    expect(getByText('Club XYZ')).toBeTruthy();
    expect(getByText('JohnDoe')).toBeTruthy();
  });
});