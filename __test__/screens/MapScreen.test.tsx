// Definisci l'oggetto chainable
const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    // Creiamo un mock per "not"
    not: jest.fn(),
};

// Configuriamo il mock per .not() in modo da simulare due chiamate:
// - La prima chiamata restituisce l'oggetto chainable (mockQueryBuilder)
// - La seconda chiamata restituisce una Promise risolta con i dati di test

jest.mock('@/lib/supabase', () => {
    return { 
        supabase: { 
            from: jest.fn(() => mockQueryBuilder),
        }
    };
});

const { supabase } = require('@/lib/supabase');
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import MapScreen from '@/screens/MapScreen/MapScreen'; // adjust path if necessary
import { PanResponder, Animated } from 'react-native';

// --- MOCK NAVIGATION AND ROUTE ---
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
  
describe('MapScreen', () => {
    it('clubs appear on the map as markers', async () => {
        // In questo modo, quando il codice invoca la catena:
        // supabase.from('club').select('*').not('latitude', 'is', null).not('longitude', 'is', null)
        // la prima chiamata a .not() restituisce il chainable object (mockQueryBuilder)
        // mentre la seconda restituisce la Promise risolta con i dati di test.
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            not: jest.fn().mockReturnValueOnce({
                not: jest.fn().mockResolvedValueOnce({
                    data: [
                        {
                            club_id: '1',
                            name: 'Club 1',
                            rating: 4.5,
                            attendees: 100,
                            category: 'Disco',
                            latitude: 51.509865,
                            longitude: -0.118092,
                            address: 'London, UK',
                            image: 'https://example.com/club1.jpg',
                            description: 'Description of Club 1',
                            opening_hours: '20:00 - 02:00',
                            dress_code: 'Smart casual',
                            music_genre: 'Pop',
                        },
                    ],
                }),
            }),
        });
        const { getByTestId } = render(<MapScreen />);
    
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
    
        await waitFor(() => {
            expect(getByTestId('marker')).not.toBeNull();
        });
    });

    it('error message appears if there are no clubs', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            not: jest.fn().mockReturnValueOnce({
                not: jest.fn().mockResolvedValueOnce({
                    data: [],
                    error: 'No clubs found',
                }),
            }),
        });
        const { getByText } = render(<MapScreen />);
    
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
    
        await waitFor(() => {
            expect(getByText('Failed to fetch clubs. Please try again.')).not.toBeNull();
        });
    });

    it('tapping on a marker shows the club details', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            not: jest.fn().mockReturnValueOnce({
                not: jest.fn().mockResolvedValueOnce({
                    data: [
                        {
                            club_id: '1',
                            name: 'Club 1',
                            rating: 4.5,
                            attendees: 100,
                            category: 'Disco',
                            latitude: 51.509865,
                            longitude: -0.118092,
                            address: 'London, UK',
                            image: 'https://example.com/club1.jpg',
                            description: 'Description',
                            opening_hours: '20:00 - 02:00',
                            dress_code: 'Smart casual',
                            music_genre: 'Pop',
                        },
                    ],
                }),
            }),
        });
        const { getByTestId, getByText, getAllByText } = render(<MapScreen />);
    
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
    
        await act(async () => {
            fireEvent.press(getByTestId('marker'));
        });
    
        await waitFor(() => {
            expect(getAllByText('Club 1')).not.toBeNull();
            expect(getByText('4.5')).not.toBeNull();
            expect(getByText('100')).not.toBeNull();
            expect(getByText('Disco')).not.toBeNull();
            expect(getByText('London, UK')).not.toBeNull();
        });
    });

    it('tapping on view details button navigates to Club', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            not: jest.fn().mockReturnValueOnce({
                not: jest.fn().mockResolvedValueOnce({
                    data: [
                        {
                            club_id: '1',
                            name: 'Club 1',
                            rating: 4.5,
                            attendees: 100,
                            category: 'Disco',
                            latitude: 51.509865,
                            longitude: -0.118092,
                            address: 'London, UK',
                            image: 'https://example.com/club1.jpg',
                            description: 'Description',
                            opening_hours: '20:00 - 02:00',
                            dress_code: 'Smart casual',
                            music_genre: 'Pop',
                        },
                    ],
                }),
            }),
        });
        const { getByTestId, getByText, getAllByText } = render(<MapScreen />);
    
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
    
        await act(async () => {
            fireEvent.press(getByTestId('marker'));
        });
    
        await act(async () => {
            fireEvent.press(getByTestId('view-details-button'));
        });
    
        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('Club', { clubId: '1' });
        });
    });

    it('tapping on close button hides the club card', async () => {
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            not: jest.fn().mockReturnValueOnce({
                not: jest.fn().mockResolvedValueOnce({
                    data: [
                        {
                            club_id: '1',
                            name: 'Club 1',
                            rating: 4.5,
                            attendees: 100,
                            category: 'Disco',
                            latitude: 51.509865,
                            longitude: -0.118092,
                            address: 'London, UK',
                            image: 'https://example.com/club1.jpg',
                            description: 'Description',
                            opening_hours: '20:00 - 02:00',
                            dress_code: 'Smart casual',
                            music_genre: 'Pop',
                        },
                    ],
                }),
            }),
        });
        const { getByTestId, queryByText } = render(<MapScreen />);
    
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
    
        await act(async () => {
            fireEvent.press(getByTestId('marker'));
        });
    
        await act(async () => {
            fireEvent.press(getByTestId('close-button'));
        });
    
        await waitFor(() => {
            expect(queryByText('Club 1')).toBeNull();
        });
    });


});
  