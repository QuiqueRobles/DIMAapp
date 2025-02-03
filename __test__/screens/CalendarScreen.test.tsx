

jest.mock('@/lib/supabase', () => {
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [],
      error: null,
    }),
  };

  return { 
    supabase: { 
      from: jest.fn(() => mockQueryBuilder),
    },
  };
});

const  { supabase }  = require('@/lib/supabase');
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import CalendarScreen from '@/screens/CalendarScreen'; // adjust path if necessary
import { Calendar } from 'react-native-calendars';




// --- MOCK NAVIGATION AND ROUTE ---
// We override useNavigation to capture navigation calls
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
    // Provide route parameters required by CalendarScreen
    useRoute: () => ({
      params: { clubId: 'club1', clubName: 'Test Club' },
    }),
  };
});

// --- MOCK EventCard COMPONENT ---
// We stub EventCard to display a touchable element with a testID and trigger the onBuyTicket callback
jest.mock('@/components/EventCard', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return ({ event, clubName, onBuyTicket }: { 
    event: any; 
    clubName: string; 
    onBuyTicket: () => void; 
  }) => (
    <TouchableOpacity testID="event-card" onPress={onBuyTicket}>
      <Text>{event.name}</Text>
    </TouchableOpacity>
  );
});

// --- MOCK SUPABASE QUERY FOR EVENTS ---
// We simulate that the query returns one event on a specific date.
const mockEvent = {
  id: 'event1',
  date: '2023-04-20',
  name: 'Test Event',
  price: 2000, // price in cents
  description: 'Test event description',
  image: 'test-url',
};


afterEach(() => {
  jest.clearAllMocks();
});

describe('CalendarScreen', () => {
  it('displays event card when a day with an event is pressed', async () => {
    
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({
        data: [mockEvent],
        error: null,
      }),
    });
    
    // Render CalendarScreen
    const { getByTestId} = render(<CalendarScreen />);
    
    // Wait for the component to finish fetching events
    // (you can adjust the delay as necessary; 500ms is just an example)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
    
    // Simulate a day press with a date that matches our event
    await act(async () => {
      fireEvent(getByTestId('calendar'), 'onDayPress', { dateString: '2023-04-20' });
    });
    // Wait for the event card to appear (using its testID)
    await waitFor(() => {
      expect(getByTestId('event-card')).toBeTruthy();
    });
  });

  it('displays an error message when the event fetch fails', async () => {
    
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({
        data: [],
        error: new Error('Failed to fetch events'),
      }),
    });
    
    // Render CalendarScreen
    const { getByText } = render(<CalendarScreen />);
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(getByText('Failed to fetch events')).toBeTruthy();
    });
  });

  
  it('navigates to BuyTicket screen when the buy ticket button is pressed on the event card', async () => {
    
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({
        data: [mockEvent],
        error: null,
      }),
    });
    
    // Render CalendarScreen
    const { getByTestId } = render(<CalendarScreen />);
    
    // Wait for the component to finish fetching events
    // (you can adjust the delay as necessary; 500ms is just an example)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
    
    // Simulate a day press with a date that matches our event
    await act(async () => {
      fireEvent(getByTestId('calendar'), 'onDayPress', { dateString: '2023-04-20' });
    });

    // Wait for the event card to appear
    const eventCard = await waitFor(() => getByTestId('event-card'));
    
    // Simulate pressing the event card (which triggers the onBuyTicket callback)
    act(() => {
      fireEvent.press(eventCard);
    });
    
    // Verify that navigation.navigate is called with the expected parameters
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('BuyTicket', {
        eventId: 'event1',
        eventName: 'Test Event',
        eventDate: '2023-04-20',
        eventPrice: 2000 / 100, // converting cents to dollars (20)
        clubName: 'Test Club',
        eventDescription: 'Test event description',
        eventImage: 'test-url',
      });
    });
  });

  it('navigates back to the previous screen when the back button is pressed', async () => {
    // Render CalendarScreen
    const { getByTestId } = render(<CalendarScreen />);
    
    // Simulate pressing the back button
    act(() => {
      fireEvent.press(getByTestId('back-button'));
    });
    
    // Verify that navigation.goBack is called
    await waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalled();
    });
  });
});

