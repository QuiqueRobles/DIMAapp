// __tests__/ClubEdit.test.tsx
import ClubEdit from '../../src/components/ClubEdit';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';


describe('ClubEdit', () => {
  const mockClub = {
    id: '1',
    name: 'Test Club',
    rating: 4.5,
    num_reviews: 10,
    address: '123 Test St',
    image: null,
    category: 'Nightclub',
    music_genre: 'EDM',
    attendees: 200,
    opening_hours: '10PM - 4AM',
    dress_code: 'Casual',
    description: 'A great place to party!',
    latitude: 0,
    longitude: 0,
  };

  it('renders club details correctly', () => {
    const { getByText, getByPlaceholderText, getByDisplayValue } = render(<ClubEdit club={mockClub} setClub={jest.fn()} />);
    expect(getByPlaceholderText('123 Test St')).toBeTruthy();
    expect(getByDisplayValue('10PM - 4AM')).toBeTruthy();
    expect(getByDisplayValue('Casual')).toBeTruthy();
    expect(getByDisplayValue('EDM')).toBeTruthy();
    expect(getByDisplayValue('A great place to party!')).toBeTruthy();
  });

  it('updates club details when input changes', () => {
    const mockSetClub = jest.fn();
    const { getByText , getByDisplayValue} = render(
      <ClubEdit club={mockClub} setClub={mockSetClub} />
    );

    fireEvent.changeText(getByDisplayValue('10PM - 4AM'), '9PM - 3AM');
    fireEvent.changeText(getByDisplayValue('Casual'), 'Formal');
    fireEvent.changeText(getByDisplayValue('A great place to party!'), 'A great place to relax!');
    fireEvent.changeText(getByDisplayValue('EDM'), 'Pop');
    expect(mockSetClub).toHaveBeenCalledTimes(4);
  });


});
