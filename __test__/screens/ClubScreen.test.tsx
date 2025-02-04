const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
};

jest.mock('@/lib/supabase', () => {
    return { 
        supabase: { 
            from: jest.fn(() => mockQueryBuilder),
        }
    };
});

const { supabase } = require('@/lib/supabase');

const fakeRoute = {
    params: { clubId: '1', clubName: 'Test Club' },
};

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
        navigate: jest.fn(),
        }),
        useRoute: () => fakeRoute,
    };
});


import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import ClubScreen from '@/screens/HomeScreen/ClubScreen'; // adjust path if necessary
import { Navigation } from 'lucide-react-native';
import { NavigationContainer } from '@react-navigation/native';


jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        // Provide a simple stub for Feather
        Feather: (props) => <Text {...props} />,
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('ClubScreen', () => {
    it('renders the club details', async () => {
        // In questo modo, quando il codice invoca la catena:
        // supabase.from('club').select('*').eq('club_id', 'test-club-id').single()
        // la prima chiamata a .eq() restituisce il chainable object (mockQueryBuilder)
        // mentre la seconda restituisce la Promise risolta con i dati di test.
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: {
                    club_id: 'test-club-id',
                    name: 'Test Club',
                    rating: 4.5,
                    num_reviews: 10,
                    address: '123 Test St',
                    image: 'https://test.com/image.jpg',
                    category: 'Test Category',
                    music_genre: 'Test Genre',
                    attendees: 100,
                    opening_hours: '12:00 - 02:00',
                    dress_code: 'Smart Casual',
                    description: 'Test description',
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
                        id: '1',
                        created_at: '2021-09-01T00:00:00Z',
                        club_id: 'test-club-id',
                        date: '2021-09-01',
                        name: 'Test Event',
                        price: 1000,
                        description: 'Test event description',
                        image: 'https://test.com/event.jpg',
                    },
                ],
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
                        id: '1',
                        created_at: '2021-09-01T00:00:00Z',
                        user_id: 'test-user-id',
                        club_id: 'test-club-id',
                        text: 'Test review',
                        num_stars: 5,
                    },
                ],
                error: null,
            }),
        });

        const { queryByText, getByText, getByTestId, getAllByText} = render(
            <ClubScreen />
   
        );

        await waitFor(() => {
            expect(getByText('Test Club')).not.toBeNull();
            expect(getByText('123 Test St')).not.toBeNull();
            expect(getAllByText('Test Category')).not.toBeNull();
            expect(getAllByText('Test Genre')).not.toBeNull();
            expect(getByText('$10.00')).not.toBeNull();
            expect(getByText('12:00 - 02:00')).not.toBeNull();
            expect(getByText('Smart Casual')).not.toBeNull();
            expect(getByText('Test description')).not.toBeNull();
        });
    });

    it('renders error message when club data fetch fails', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: null,
                error: {
                    message: 'An unknown error occurred',
                },
            }),
        });

        const { getByText } = render(
            <ClubScreen />
        );

        await waitFor(() => {
            expect(getByText('Failed to fetch club data')).not.toBeNull();
        });
    });

    
});

