// __tests__/OwnedEventList.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OwnedEventList from '../../src/components/OwnedEventList';

describe('OwnedEventList', () => {
  const mockEvents = [
    {
      event_id: '1',
      club_id: '123',
      name: 'Sample Event',
      date: '2024-06-01T20:00:00Z',
      created_at: '2024-05-01T10:00:00Z',
      price: 2000,
      description: 'This is a sample event.',
      image: 'https://example.com/event.jpg',
    },
  ];

  it('renders event details correctly', () => {
    const { getByText } = render(
      <OwnedEventList events={mockEvents} clubName="Sample Club" />
    );

    expect(getByText('Sample Event')).toBeTruthy();
    expect(getByText('$20.00')).toBeTruthy();
  });

  


});