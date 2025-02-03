
jest.mock('@/lib/supabase', () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
      lt: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
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
        },
      },
    };
  });
  
const  { supabase }  = require('@/lib/supabase');

import React from 'react';
import { render, waitFor, act, fireEvent, within } from '@testing-library/react-native';
import TicketsScreen from '@/screens/TicketsScreen'; 
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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

jest.mock('@/components/TicketCard', () => {
    const React = require('react');
    const { Text, TouchableOpacity } = require('react-native');
    return ({ ticket, onPress, isPast, onWriteReviewPress }: { 
        ticket: any; 
        onPress: () => void; 
        isPast: boolean; 
        onWriteReviewPress: () => void; 
    }) => (
        <TouchableOpacity testID="ticket-card" onPress={onPress}>
            <Text>{ticket.event.name}</Text>
            {isPast && <TouchableOpacity testID="write-review-button" onPress={onWriteReviewPress}>
                <Text>Write Review</Text>
                </TouchableOpacity>
            }    
        </TouchableOpacity>
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

const mockedEvents = [
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Future Event' },
        club: { name: 'Test Club 1' },
        event_date: '2026-12-31T23:59:59.999Z',
        num_people: 2,
        total_price: 20,
        id: 'event1',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 1' },
        club: { name: 'Test Club 2' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event2',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 2' },
        club: { name: 'Test Club 2' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event3',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 3' },
        club: { name: 'Test Club 2' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event4',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 4' },
        club: { name: 'Test Club 2' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event5',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 5' },
        club: { name: 'Test Club 2' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event6',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 6' },
        club: { name: 'Test Club 2' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event7',
    },
    
];

const singleMockedEvent = [
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event' },
        club: { name: 'Test Club 1' },
        event_date: '2021-12-31T23:59:59.999Z',
        num_people: 2,
        total_price: 20,
        id: 'event1',
    },
];

const moreMockedPastEvents = [
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 7' },
        club: { name: 'Test Club 3' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event8',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 8' },
        club: { name: 'Test Club 3' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event9',
    },
    {
        profiles: {
            username: 'test-user',
        },
        event: { name: 'Past Event 9' },
        club: { name: 'Test Club 3' },
        event_date: '2021-01-01T00:00:00.000Z',
        num_people: 1,
        total_price: 10,
        id: 'event10',
    },
];

const mockedClub = [
    {
        club_id: 'club1',
        name: 'Test Club 1',
        attendees: 100,
        created_at: '2021-01-01T00:00:00.000Z',
        rating: 4.5,
        num_reviews: 20,
        address: 'Test Address 1',
        opening_hours: '10:00 - 20:00',
        dress_code: 'Smart Casual',
        music_genre: 'Pop',
        image: 'test-url',
        category: 'Night Club',
        description: 'Test Description 1',
    },
    {
        club_id: 'club2',
        name: 'Test Club 2',
        attendees: 200,
        created_at: '2021-01-01T00:00:00.000Z',
        rating: 4.0,
        num_reviews: 15,
        address: 'Test Address 2',
        opening_hours: '10:00 - 20:00',
        dress_code: 'Casual',
        music_genre: 'Rock',
        image: 'test-url',
        category: 'Bar',
        description: 'Test Description 2',
    },
]

const moreMockedClubs = [  
    {
        club_id: 'club3',
        name: 'Test Club 3',
        attendees: 300,
        created_at: '2021-01-01T00:00:00.000Z',
        rating: 3.5,
        num_reviews: 10,
        address: 'Test Address 3',
        opening_hours: '10:00 - 20:00',
        dress_code: 'Smart Casual',
        music_genre: 'Pop',
        image: 'test-url',
        category: 'Night Club',
        description: 'Test Description 3',
    },
];

const simulateDbResponse = () => {
    supabase.auth.getUser.mockResolvedValueOnce({
        data: { 
            user: {
                id: 'test-user-id' 
            },
        },
        error: null,
    });
    

    supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({
            data: mockedEvents,
            error: null,
        }),
    });

    supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
            data: mockedClub,
            error: null,
        }),
    });
}
  

describe('TicketsScreen', () => {

    it('should render tickets in the correct list', async () => {

        simulateDbResponse();

        const { getByText, getByTestId} = render(<TicketsScreen />);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
            

        await waitFor(() => {
            // Verifica che il biglietto "future event" sia nella lista degli eventi futuri
            const futureEventsList = getByTestId('future-events-list');
            expect(within(futureEventsList).getByText('Future Event')).toBeTruthy();

            // Verifica che il biglietto "past event" sia nella lista degli eventi passati
            const pastEventsList = getByTestId('past-events-list');
            expect(within(pastEventsList).getByText('Past Event 1')).toBeTruthy();
        });
    });

    it('should display the expanded ticket when a ticket is pressed ', async () => {

        simulateDbResponse();
        
        const { getByText, getByTestId} = render(<TicketsScreen />);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        await act(async () => {
            fireEvent.press(getByText('Future Event'));
        });

        await waitFor(() => {
            expect(getByTestId('expanded-ticket')).toBeTruthy();
        });
    });

    it('should load more past events when the past events list is scrolled to the end', async () => {

        simulateDbResponse();

        

        

        const { getByText, getByTestId} = render(<TicketsScreen />);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        await act(async () => {
            expect(getByText('Past Event 1')).toBeTruthy();
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            lt: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            range: jest.fn().mockReturnValueOnce({
                data: moreMockedPastEvents,
                error: null,
            }),
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: moreMockedClubs,
                error: null,
            }),
        });
        

        await act(async () => {
            fireEvent(getByTestId('past-events-list'), 'onEndReached',  { distanceFromEnd: 10 });
        });


        await waitFor(() => {
            expect(getByText('Past Event 7')).toBeTruthy();
        });
    });

    it('open and close review modal', async () => {
        supabase.auth.getUser.mockResolvedValueOnce({
            data: { 
                user: {
                    id: 'test-user-id' 
                },
            },
            error: null,
        });
        
    
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValueOnce({
                data: singleMockedEvent,
                error: null,
            }),
        });
    
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: mockedClub,
                error: null,
            }),
        });


        const { getByText, getByTestId, queryByTestId} = render(<TicketsScreen />);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        await act(async () => {
            fireEvent.press(getByText('Write Review'));
        });

        await waitFor(() => {
            expect(getByTestId('review-modal')).toBeTruthy();
        });

        await act(async () => {
            fireEvent.press(getByTestId('close-review-button'));
        });

        await waitFor(() => {
            expect(queryByTestId('review-modal')).toBeFalsy();    
        });
    });


    it('send review', async () => {
        supabase.auth.getUser.mockResolvedValueOnce({
            data: { 
                user: {
                    id: 'test-user-id' 
                },
            },
            error: null,
        });
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValueOnce({
                data: singleMockedEvent,
                error: null,
            }),
        });
        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: mockedClub,
                error: null,
            }),
        });
        const { getByText, getByTestId, queryByTestId} = render(<TicketsScreen />);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });
        await act(async () => {
            fireEvent.press(getByText('Write Review'));
        });

        await waitFor(() => {
            expect(getByTestId('review-modal')).toBeTruthy();
        });

        await act(async () => {
            fireEvent.press(getByTestId('submit-review-button'));
        });

        supabase.from.mockReturnValueOnce({
            insert: jest.fn().mockResolvedValueOnce({
                error: null,
            }),
        });

        await waitFor(() => {
            expect(queryByTestId('review-modal')).toBeFalsy();    
        });
    });
});




  

