// __tests__/screens/HomeOwnerScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import HomeOwner from '../../src/components/HomeOwnerScreen';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'mocked-url' } }),
    },
  },
}));

jest.mock('expo-image-picker', () => ({
  MediaTypeOptions: {
    Images: 'Images',
  },
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockClub = {
  id: '1',
  name: 'Test Club',
  rating: 4.5,
  num_reviews: 100,
  address: '123 Test Street',
  image: 'https://test.com/image.jpg',
  category: 'Nightclub',
  music_genre: 'Electronic',
  attendees: 50,
  opening_hours: '10 PM - 4 AM',
  dress_code: 'Casual',
  description: 'Test Description',
};

describe('HomeOwner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user1' } },
      error: null,
    });

    (supabase.from('club').select().eq().single as jest.Mock).mockResolvedValue({
      data: mockClub,
      error: null,
    });

    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    });
  });

  it('handles image upload', async () => {
    const { findByText, getByText } = render(<HomeOwner />);
    await findByText('Test Club');

    await act(async () => {
      fireEvent.press(getByText('Tap to Change Image'));
    });

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Profile picture updated successfully');
    });
  });

  it('handles errors', async () => {
    // Mock error with proper Error instance
    const mockError = new Error('Fetch failed');
    (supabase.from('club').select().eq().single as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const { findByText } = render(<HomeOwner />);
    
    // Use more flexible text matching
    const errorElement = await findByText(/Fetch failed/i);
    expect(errorElement).toBeTruthy();
  });

  // Add error case for image upload failure
  it('handles image upload errors', async () => {
    const { findByText, getByText } = render(<HomeOwner />);
    await findByText('Test Club');

    // Mock upload failure
    (supabase.storage.from('clubs-image').upload as jest.Mock).mockRejectedValue(
      new Error('Upload failed')
    );

    await act(async () => {
      fireEvent.press(getByText('Tap to Change Image'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to upload image. Please try again.');
    });
  });
});