// __test__/ClubCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ClubCard } from '../../src/components/ClubCard';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

// Mock isOwner
jest.mock('isOwner');

describe('ClubCard', () => {
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
  };

  const mockOnPress = jest.fn();

  it('renders correctly with all props', () => {
    const { getByText, getByTestId } = render(
      <ClubCard club={mockClub} onPress={mockOnPress} distance="1.2 km" />
    );

    // Check if the club name is rendered
    expect(getByText('Test Club')).toBeTruthy();

    // Check if the rating is rendered
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('(100)')).toBeTruthy();

    // Check if the distance is rendered
    expect(getByText('1.2 km')).toBeTruthy();

    // Check if the attendees count is rendered
    expect(getByText('50 attending')).toBeTruthy();

    // Check if the category and music genre are rendered
    expect(getByText('Nightclub')).toBeTruthy();
    expect(getByText('Electronic')).toBeTruthy();

    // Check if the image is rendered
    const image = getByTestId('club-image');
    expect(image.props.source.uri).toBe('https://via.placeholder.com/400x200');
  });

  it('calls onPress when the card is pressed', () => {
    const { getByTestId } = render(
      <ClubCard club={mockClub} onPress={mockOnPress} />
    );

    // Simulate a press on the card
    fireEvent.press(getByTestId('club-card'));

    // Check if the onPress function was called
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('displays a placeholder image when the club image fails to load', () => {
    const { getByTestId } = render(
      <ClubCard club={{ ...mockClub, image: null }} onPress={mockOnPress} />
    );

    // Check if the placeholder image is rendered
    const image = getByTestId('club-image');
    expect(image.props.source.uri).toBe('https://via.placeholder.com/400x200?text=No+Image');
  });

  it('displays the correct open/closed status', () => {
    const { getByText } = render(
      <ClubCard club={mockClub} onPress={mockOnPress} />
    );

    // Check if the open/closed status is rendered
    const openStatus = getByText(/Open|Closed/);
    expect(openStatus).toBeTruthy();
  });
});