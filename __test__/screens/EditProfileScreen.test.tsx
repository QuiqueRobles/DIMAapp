jest.mock('@/lib/supabase', () => {

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upload: jest.fn().mockReturnThis(),
      getPublicUrl: jest.fn().mockReturnThis(),
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
            updateUser: jest.fn().mockResolvedValue({ error: null }),
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
        Feather: (props) => <Text {...props} />,
        // Optionally, add mocks for other icons if you use them:
        // Ionicons: (props) => <Text {...props} />,
        // MaterialIcons: (props) => <Text {...props} />,
    };
});

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
            goBack: mockedGoBack,
        }),
    };
});

import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, Text } from 'react-native';
import EditProfileScreen from '@/screens/ProfileScreen/EditProfileScreen';

jest.spyOn(Alert, 'alert');

afterEach(() => {
    jest.clearAllMocks();
});


describe('EditProfileScreen', () => {
    it('should fetch the user profile', async () => {

        supabase.auth.getUser.mockResolvedValueOnce({
            data: { 
                user: { 
                    id: 'test-user-id' ,
                    email: 'test-email',
                },
            },
            error: null,
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: {
                    id: 'test-id',
                    name: 'test-name',
                    profile_picture: 'test-picture',
                    date_of_birth: '2001-01-01',
                    gender_id: 'test-gender',
                    country: 'test-country',
                    profile_id: 'test-user-id',
                },
                error: null,
            }),
        });

        const { getByText, getByPlaceholderText } = render(
            <NavigationContainer>
                <EditProfileScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
        expect(supabase.from).toHaveBeenCalledWith('profiles');
        
        expect(getByPlaceholderText('Enter your name')).toBeTruthy();
        expect(getByPlaceholderText('Enter your email')).toBeTruthy();
        expect(getByText('2001-01-01')).toBeTruthy();

        
    });

    it('should show an error if the user profile cannot be fetched', async () => {
        supabase.auth.getUser.mockResolvedValueOnce({
            data: null,
            error: 'error',
        });

        const { getByText, getByPlaceholderText } = render(
            <NavigationContainer>
                <EditProfileScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to load profile. Please try again.');
    
    });



    it('should update the user profile', async () => {
        supabase.auth.getUser.mockResolvedValueOnce({
            data: { 
                user: { 
                    id: 'test-user-id' ,
                    email: 'test-email@example.com',
                },
            },
            error: null,
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: {
                    id: 'test-id',
                    name: 'test-name',
                    profile_picture: 'test-picture',
                    date_of_birth: '2001-01-01',
                    gender_id: 'test-gender',
                    country: 'test-country',
                    profile_id: 'test-user-id',
                },
                error: null,
            }),
        });

        

        const { getByText, getByPlaceholderText, getByTestId } = render(
            <NavigationContainer>
                <EditProfileScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        const saveButton = getByTestId('save-button');
        fireEvent.press(saveButton);

        supabase.from.mockReturnValueOnce({
            update: jest.fn().mockResolvedValueOnce
        });

        supabase.auth.updateUser.mockResolvedValueOnce({ error: null });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Profile updated successfully');
        expect(mockedGoBack).toHaveBeenCalledTimes(1);
    });

    
});

