import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen/HomeScreen';
import { supabase } from '@/lib/supabase';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@/components/SearchBar', () => ({
  SearchBar: ({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => (
    <TextInput
      testID="search-bar"
      value={value}
      onChangeText={onChangeText}
      placeholder="Search..."
    />
  ),
}));

jest.mock('@/components/ClubCard', () => ({
  ClubCard: ({ club, onPress }: { club: any; onPress: () => void }) => (
    <TouchableOpacity
      testID={`club-card-${club.club_id}`}
      onPress={onPress}
    >
      <Text>{club.name}</Text>
    </TouchableOpacity>
  ),
}));

jest.mock('@/components/FilterModal', () => ({
  FilterModal: ({ isVisible, onApply }: { isVisible: boolean; onApply: (filters: any) => void }) =>
    isVisible ? (
      <button testID="apply-filters-button" onClick={() => onApply({ minRating: 4 })}>
        Apply Filters
      </button>
    ) : null,
}));

const mockSupabase = {
  from: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  order: jest.fn(() => mockSupabase),
  eq: jest.fn(() => mockSupabase),
  gte: jest.fn(() => mockSupabase),
  range: jest.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
};

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));
// Update FilterModal mock:
jest.mock('@/components/FilterModal', () => ({
  FilterModal: ({ isVisible, onApply }: { isVisible: boolean; onApply: (filters: any) => void }) =>
    isVisible ? (
      <TouchableOpacity
        testID="apply-filters-button"
        onPress={() => onApply({ minRating: 4 })}
      >
        <Text>Apply Filters</Text>
      </TouchableOpacity>
    ) : null,
}));
const mockClubs = [
  {
    club_id: '1',
    name: 'Club One',
    attendees: 100,
    rating: 4.5,
    category: 'Nightclub',
    music_genre: 'Electronic',
    description: 'A great club',
  },
  {
    club_id: '2',
    name: 'Club Two',
    attendees: 80,
    rating: 4.0,
    category: 'Bar',
    music_genre: 'Jazz',
    description: 'A cool jazz bar',
  },
];

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.range.mockResolvedValueOnce({
      data: mockClubs,
      error: null,
      count: mockClubs.length,
    });
  });

  it('fetches and displays clubs on load', async () => {
    const { findByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(findByText('Club One')).toBeTruthy();
      expect(findByText('Club Two')).toBeTruthy();
    });
  });

  // Update the search test to:
it('handles search functionality', async () => {
  const { getByTestId, queryByText } = render(
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );

  await act(async () => {
    fireEvent.changeText(getByTestId('search-bar'), 'Club One');
  });

  await waitFor(() => {
    expect(queryByText('Club One')).toBeTruthy();
    expect(queryByText('Club Two')).toBeNull();
  });
});

  it('displays error message on fetch failure', async () => {
    mockSupabase.range.mockReset().mockResolvedValueOnce({
      data: null,
      error: new Error('Fetch failed'),
      count: null,
    });

    const { findByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => expect(findByText('Failed to fetch clubs. Please try again.')).toBeTruthy());
  });

  it('refreshes data when pulled down', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent(getByTestId('refresh-control'), 'refresh');
    });

    expect(mockSupabase.range).toHaveBeenCalledTimes(2);
  });

  it('applies filters correctly', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByTestId('filter-button'));
      fireEvent.click(getByTestId('apply-filters-button'));
    });

    await waitFor(() => {
      expect(mockSupabase.gte).toHaveBeenCalledWith('rating', 4);
    });
  });

  // Update navigation mock at top of file:
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Remove the spyOn in the individual test and use:
it('navigates to club details on press', async () => {
  const mockNavigate = jest.fn();
  require('@react-navigation/native').useNavigation.mockImplementation(() => ({
    navigate: mockNavigate,
  }));

  const { getByTestId } = render(
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );

  await act(async () => {
    fireEvent.press(getByTestId('club-card-1'));
  });

  expect(mockNavigate).toHaveBeenCalledWith('Club', { clubId: '1' });
});

    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.click(getByTestId('club-card-1'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('Club', { clubId: '1' });
  });

  // Update scroll test to use proper React Native scroll event:
it('loads more clubs when scrolling', async () => {
  const { getByTestId } = render(
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );

  await act(async () => {
    fireEvent.scroll(getByTestId('flat-list'), {
      nativeEvent: {
        contentOffset: { y: 500 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 }
      }
    });
  });

  expect(mockSupabase.range).toHaveBeenCalledTimes(2);
});

    expect(mockSupabase.range).toHaveBeenCalledTimes(2);
  });
});