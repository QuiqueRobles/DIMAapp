// __test__/ClubDetails.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ClubDetails from '../../src/components/ClubDetails';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

describe('ClubDetails', () => {
  const mockClub = {
    id: '1',
    name: 'Test Club',
    rating: 4.5,
    num_reviews: 100,
    address: '123 Test Street',
    image: 'https://via.placeholder.com/400x200',
    category: 'Nightclub',
    music_genre: 'Electronic',
    attendees: 50,
    opening_hours: '10 PM - 4 AM',
    dress_code: 'Casual',
    description: 'A great place to party!',
  };

  it('renders correctly with all details', () => {
    const { getByText } = render(<ClubDetails club={mockClub} />);

    // Check if all details are rendered
    expect(getByText(mockClub.address)).toBeTruthy();
    expect(getByText(mockClub.opening_hours)).toBeTruthy();
    expect(getByText(mockClub.dress_code)).toBeTruthy();
    expect(getByText(mockClub.music_genre)).toBeTruthy();
    expect(getByText('About')).toBeTruthy();
    expect(getByText(mockClub.description)).toBeTruthy();
  });

  it('does not render optional fields if they are missing', () => {
    const clubWithoutOptionalFields = {
      ...mockClub,
      dress_code: null,
      music_genre: null,
      description: null,
    };

    const { queryByText } = render(<ClubDetails club={clubWithoutOptionalFields} />);

    // Check if optional fields are not rendered
    expect(queryByText(mockClub.dress_code)).toBeNull();
    expect(queryByText(mockClub.music_genre)).toBeNull();
    expect(queryByText('About')).toBeNull();
    expect(queryByText(mockClub.description)).toBeNull();
  });
});