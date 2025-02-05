import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, Text } from 'react-native';
import ClubManageScreen from '@/screens/ClubManageScreen';


jest.mock('expo-image-picker', () => {
  return {
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
    launchImageLibraryAsync: jest.fn().mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://dummy-image.jpg' }],
    }),
    MediaTypeOptions: { Images: 'Images' },
  };
});

jest.mock('@/lib/supabase', () => {
    const mockStorageBuilder = {
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/dummy.jpg' } }),
    };

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      getPublicUrl: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
  
    return { 
      supabase: { 
        from: jest.fn(() => mockQueryBuilder),
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { 
                    user: { id: 'test-user-id' },
                },
                error: null,
            }),
            signOut: jest.fn().mockReturnThis(),
        },
        storage: {
            from: jest.fn(() => mockStorageBuilder),
        },
      },
    };
});

const  { supabase }  = require('@/lib/supabase');

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    // Provide a simple stub for FontAwesome
    FontAwesome: (props) => <Text {...props} />,
    Feather: (props) => <Text {...props} />,
    // Optionally, add mocks for other icons if you use them:
    // Ionicons: (props) => <Text {...props} />,
    // MaterialIcons: (props) => <Text {...props} />,
  };
});


jest.spyOn(Alert, 'alert');
jest.spyOn(console, 'error').mockImplementation(() => {});

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
        navigate: mockedNavigate,
        }),
    };
});



describe('ClubManageScreen', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('fetches club data and renders it', async () => {
        supabase.auth.getUser.mockResolvedValueOnce({
            data: { user: { id: 'test-user-id' } },
            error: null,
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data:{
                        id: 'test-club-id',
                        name: 'Test Club',
                        rating: 4.5,
                        num_reviews: 10,
                        address: 'Test Address',
                        image: 'https://example.com/dummy.jpg',
                        category: 'Test Category',
                        music_genre: 'Test Genre',
                        attendes: 100,
                        latitute: 0,
                        longitude: 0,
                        opening_hours: '10:00 - 20:00',
                        dress_code: 'Casual',
                        description: 'Test Description',
                },
                error: null,
            }),
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValueOnce({
                data: [
                        { 
                            id: 'test-event-id-1',
                            created_at: '2023-01-01',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Great event',
                            num_stars: 5,
                        },
                        { 
                            id: 'test-event-id-2',
                            created_at: '2023-01-02',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Bad event',
                            num_stars: 1,
                        },
                ],
                error: null,
            }),
        });

        const { getByText, queryByText, getAllByText } = render(
            <NavigationContainer>
                <ClubManageScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        //expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(getByText('Test Club')).not.toBeNull();
            expect(getByText('4.5')).toBeTruthy();
            expect(getByText('(10 reviews)')).toBeTruthy();
            expect(getByText('Test Address')).toBeTruthy();
            expect(getAllByText('Test Category')).toBeTruthy();
            expect(getAllByText('Test Genre')).toBeTruthy();
            expect(getByText('10:00 - 20:00')).toBeTruthy();
            expect(getByText('Casual')).toBeTruthy();
            expect(getByText('Test Description')).toBeTruthy();
            expect(getByText('Great event')).toBeTruthy();
            expect(getByText('Bad event')).toBeTruthy();
        });
       

    });

    it('image upload works', async () => {
        supabase.auth.getUser.mockResolvedValueOnce({
            data: { user: { id: 'test-user-id' } },
            error: null,
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data:{
                        id: 'test-club-id',
                        name: 'Test Club',
                        rating: 4.5,
                        num_reviews: 10,
                        address: 'Test Address',
                        image: 'https://example.com/dummy.jpg',
                        category: 'Test Category',
                        music_genre: 'Test Genre',
                        attendes: 100,
                        latitute: 0,
                        longitude: 0,
                        opening_hours: '10:00 - 20:00',
                        dress_code: 'Casual',
                        description: 'Test Description',
                },
                error: null,
            }),
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValueOnce({
                data: [
                        { 
                            id: 'test-event-id-1',
                            created_at: '2023-01-01',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Great event',
                            num_stars: 5,
                        },
                        { 
                            id: 'test-event-id-2',
                            created_at: '2023-01-02',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Bad event',
                            num_stars: 1,
                        },
                ],
                error: null,
            }),
        });

       


        const { getByText, queryByText, getAllByText, getByTestId } = render(
            <NavigationContainer>
                <ClubManageScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        const imageButton = getByTestId('image-upload');
        fireEvent.press(imageButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Profile picture updated successfully');
        });


    });

    it('error dislpayed on upload failure', async () => {
        supabase.auth.getUser.mockResolvedValueOnce({
            data: { user: { id: 'test-user-id' } },
            error: null,
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data:{
                        id: 'test-club-id',
                        name: 'Test Club',
                        rating: 4.5,
                        num_reviews: 10,
                        address: 'Test Address',
                        image: 'https://example.com/dummy.jpg',
                        category: 'Test Category',
                        music_genre: 'Test Genre',
                        attendes: 100,
                        latitute: 0,
                        longitude: 0,
                        opening_hours: '10:00 - 20:00',
                        dress_code: 'Casual',
                        description: 'Test Description',
                },
                error: null,
            }),
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValueOnce({
                data: [
                        { 
                            id: 'test-event-id-1',
                            created_at: '2023-01-01',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Great event',
                            num_stars: 5,
                        },
                        { 
                            id: 'test-event-id-2',
                            created_at: '2023-01-02',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Bad event',
                            num_stars: 1,
                        },
                ],
                error: null,
            }),
        });

        supabase.storage.from.mockReturnValueOnce({
            upload: jest.fn().mockResolvedValueOnce({ error: 'error' }),
        });


        const { getByText, queryByText, getAllByText, getByTestId } = render(
            <NavigationContainer>
                <ClubManageScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        const imageButton = getByTestId('image-upload');
        fireEvent.press(imageButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to upload image. Please try again.");
        });


    });

    it('save button works', async () => {

        supabase.auth.getUser.mockResolvedValueOnce({
            data: { user: { id: 'test-user-id' } },
            error: null,
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data:{
                        id: 'test-club-id',
                        name: 'Test Club',
                        rating: 4.5,
                        num_reviews: 10,
                        address: 'Test Address',
                        image: 'https://example.com/dummy.jpg',
                        category: 'Test Category',
                        music_genre: 'Test Genre',
                        attendes: 100,
                        latitute: 0,
                        longitude: 0,
                        opening_hours: '10:00 - 20:00',
                        dress_code: 'Casual',
                        description: 'Test Description',
                },
                error: null,
            }),
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValueOnce({
                data: [
                        { 
                            id: 'test-event-id-1',
                            created_at: '2023-01-01',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Great event',
                            num_stars: 5,
                        },
                        { 
                            id: 'test-event-id-2',
                            created_at: '2023-01-02',
                            user_id: 'test-user-id',
                            club_id: 'test-club-id',
                            text: 'Bad event',
                            num_stars: 1,
                        },
                ],
                error: null,
            }),
        });

        const { getByText, queryByText, getAllByText, getByTestId } = render(
            <NavigationContainer>
                <ClubManageScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        
        const editSaveButton = getByTestId('edit-save-button');
        await act(async () => {
            fireEvent.press(editSaveButton);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
        

        supabase.from.mockReturnValueOnce({
            update: jest.fn().mockResolvedValueOnce({ error: null }),
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Profile Picture updated successfully');
        });
    });

});


