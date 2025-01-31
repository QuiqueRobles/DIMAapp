// __test__/ClubHeader.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ClubHeader from '../src/components/ClubHeader';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

describe('ClubHeader', () => {
  const mockClub = {
    name: 'Test Club',
    rating: 4.5,
    num_reviews: 100,
    category: 'Nightclub',
    music_genre: 'Electronic',
  };

  it('renders correctly with all details', () => {
    const { getByText } = render(<ClubHeader club={mockClub} />);

    // Check if all details are rendered
    expect(getByText(mockClub.name)).toBeTruthy();
    expect(getByText(mockClub.rating.toFixed(1))).toBeTruthy();
    expect(getByText(`(${mockClub.num_reviews} reviews)`)).toBeTruthy();
    expect(getByText(mockClub.category)).toBeTruthy();
    expect(getByText(mockClub.music_genre)).toBeTruthy();
  });

  it('does not render optional fields if they are missing', () => {
    const clubWithoutOptionalFields = {
      ...mockClub,
      category: null,
      music_genre: null,
    };

    const { queryByText } = render(<ClubHeader club={clubWithoutOptionalFields} />);

    // Check if optional fields are not rendered
    expect(queryByText(mockClub.category)).toBeNull();
    expect(queryByText(mockClub.music_genre)).toBeNull();
  });
});