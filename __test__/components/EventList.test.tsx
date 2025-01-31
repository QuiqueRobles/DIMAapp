import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import EventsList from '../../src/components/EventsList';

describe('EventsList', () => {
  const mockEvents = [
    {
      id: '1',
      created_at: '2023-01-01T00:00:00Z',
      club_id: 'abc123',
      date: '2023-12-31T00:00:00Z',
      name: 'New Year Party',
      price: 5000,
      description: 'Celebrate New Year with us!',
      image: 'https://example.com/image.jpg',
    },
  ];

  it('renders a list of events', () => {
    const { getByText } = render(
      <NavigationContainer>
        <EventsList events={mockEvents} clubName="Club XYZ" />
      </NavigationContainer>
    );

    expect(getByText('New Year Party')).toBeTruthy();
    expect(getByText('Dec 31, 2023')).toBeTruthy();
  });
});
