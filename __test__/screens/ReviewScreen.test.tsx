import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReviewsScreen from '@/screens/ReviewScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { View } from 'react-native'; 

// Mock the useRoute and useNavigation hooks
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  },
}));

// Mock the ReviewItem component
jest.mock('@/components/ReviewItem', () => ({
  __esModule: true,
  default: () =>(''),
}));

// Mock the LoadingSpinner and ErrorDisplay components
jest.mock('@/components/LoadingSpinner', () => ({
  __esModule: true,
  default: () => (''),
}));

jest.mock('@/components/ErrorDisplay', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (''),
}));

describe('ReviewsScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockRoute = {
    params: {
      clubId: '123',
      clubName: 'Test Club',
    },
  };

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and back button', () => {
    const { getByText, getByTestId } = render(<ReviewsScreen />);

    expect(getByTestId('title')).toBeTruthy();
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('displays the loading spinner while fetching reviews', () => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    }));

    const { getByTestId } = render(<ReviewsScreen />);

    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('displays an error message when fetching reviews fails', async () => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => {
        throw new Error('Failed to fetch reviews');
      }),
    }));

    const { getByTestId } = render(<ReviewsScreen />);

    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
      expect(getByTestId('error-message').props.children).toBe('Failed to fetch reviews');
    });
  });

  it('displays "No reviews yet" when there are no reviews', async () => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    }));

    const { getByText } = render(<ReviewsScreen />);

    await waitFor(() => {
      expect(getByText('No reviews yet')).toBeTruthy();
    });
  });

  it('renders the list of reviews', async () => {
    const mockReviews = [
      {
        id: '1',
        created_at: '2023-10-01',
        user_id: '123',
        club_id: '456',
        text: 'Great club!',
        num_stars: 5,
      },
      {
        id: '2',
        created_at: '2023-10-02',
        user_id: '456',
        club_id: '456',
        text: 'Amazing experience!',
        num_stars: 4,
      },
    ];

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockReviews, error: null }),
    }));

    const { getAllByTestId } = render(<ReviewsScreen />);

    await waitFor(() => {
      expect(getAllByTestId('review-item')).toHaveLength(2);
    });
  });

  it('refreshes the reviews when the refresh control is triggered', async () => {
    const mockReviews = [
      {
        id: '1',
        created_at: '2023-10-01',
        user_id: '123',
        club_id: '456',
        text: 'Great club!',
        num_stars: 5,
      },
    ];

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockReviews, error: null }),
    }));

    const { getByTestId, getAllByTestId } = render(<ReviewsScreen />);

    await waitFor(() => {
      expect(getAllByTestId('review-item')).toHaveLength(1);
    });

    fireEvent(getByTestId('refresh-control'), 'refresh');

    await waitFor(() => {
      expect(getAllByTestId('review-item')).toHaveLength(1);
    });
  });
});