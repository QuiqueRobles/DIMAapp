// __tests__/screens/HomeOwnerScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeOwner from '../../src/components/HomeOwnerScreen';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
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
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockReturnThis(),
      getPublicUrl: jest.fn().mockReturnThis(),
    },
  },
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

describe('HomeOwner', () => {
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

  const mockReviews = [
    {
      id: '1',
      created_at: '2024-01-01',
      user_id: 'user1',
      club_id: '1',
      text: 'Great club!',
      num_stars: 5,
    },
  ];

  beforeEach(() => {
    // Mock supabase responses
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user1' } },
      error: null,
    });

    (supabase.from('club').select().eq().single as jest.Mock).mockResolvedValue({
      data: mockClub,
      error: null,
    });

    (supabase.from('review').select().eq().order().limit as jest.Mock).mockResolvedValue({
      data: mockReviews,
      error: null,
    });

    // Mock ImagePicker responses
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    });
  });

  it('renders correctly', async () => {
    const { getByText, findByText } = render(<HomeOwner />);

    // Check if the club name is rendered
    expect(await findByText('Test Club')).toBeTruthy();

    // Check if the club address is rendered
    expect(getByText('123 Test Street')).toBeTruthy();
  });

  it('handles image upload', async () => {
    const { getByText } = render(<HomeOwner />);

    // Simulate image upload
    const tapToChangeImage = getByText('Tap to Change Image');
    fireEvent.press(tapToChangeImage);

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(supabase.storage.from('clubs-image').upload).toHaveBeenCalled();
    });
  });

  it('toggles edit mode', async () => {
    const { getByText, findByText } = render(<HomeOwner />);

    // Simulate pressing the Edit button
    const editButton = getByText('Edit');
    fireEvent.press(editButton);

    // Check if the Save button appears
    const saveButton = await findByText('Save');
    expect(saveButton).toBeTruthy();
  });

  it('saves changes when in edit mode', async () => {
    const { getByText } = render(<HomeOwner />);

    // Simulate pressing the Edit button
    const editButton = getByText('Edit');
    fireEvent.press(editButton);

    // Simulate pressing the Save button
    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(supabase.from('club').update).toHaveBeenCalled();
    });
  });

  it('displays error message when club data fetch fails', async () => {
    // Mock an error when fetching club data
    (supabase.from('club').select().eq().single as jest.Mock).mockResolvedValue({
      data: null,
      error: new Error('Failed to fetch club data'),
    });

    const { findByText } = render(<HomeOwner />);

    // Check if the error message is displayed
    expect(await findByText('Failed to fetch club data')).toBeTruthy();
  });
});