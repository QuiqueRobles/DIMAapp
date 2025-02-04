import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BuyTicketScreen from '@/screens/BuyTicketScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { supabase } from '@/lib/supabase';
import { View } from 'react-native';




// Mock the useRoute and useNavigation hooks
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mock the useStripe hook
jest.mock('@stripe/stripe-react-native', () => ({
  useStripe: jest.fn(),
}));

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  },
}));



describe('BuyTicketScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockRoute = {
    params: {
      eventId: '123',
      eventName: 'Test Event',
      eventDate: '2023-10-01',
      eventPrice: 50,
      clubName: 'Test Club',
      eventDescription: 'This is a test event',
      eventImage: 'https://example.com/image.jpg',
      clubId: '456',
    },
  };

  const mockStripe = {
    initPaymentSheet: jest.fn(),
    presentPaymentSheet: jest.fn(),
  };

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRoute as jest.Mock).mockReturnValue(mockRoute);
    (useStripe as jest.Mock).mockReturnValue(mockStripe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the event details and purchase button', () => {
    const { getByText, getByTestId } = render(<BuyTicketScreen />);

    expect(getByText('Buy Tickets')).toBeTruthy();
    expect(getByText('Test Event')).toBeTruthy();
    expect(getByText('Test Club')).toBeTruthy();
    expect(getByText('October 1, 2023')).toBeTruthy();
    expect(getByText('This is a test event')).toBeTruthy();
    expect(getByText('$50.00 per ticket')).toBeTruthy();
    
  });

  it('increases and decreases the quantity correctly', () => {
    const { getByText, getByTestId } = render(<BuyTicketScreen />);

    const incrementButton = getByTestId('increment-button');
    const decrementButton = getByTestId('decrement-button');
    const quantityText = getByText('1');

    fireEvent.press(incrementButton);
    expect(quantityText.props.children).toBe(2);

    fireEvent.press(decrementButton);
    expect(quantityText.props.children).toBe(1);
  });

  it('initializes the payment sheet when quantity changes', async () => {
    const { getByTestId } = render(<BuyTicketScreen />);

    const incrementButton = getByTestId('increment-button');
    fireEvent.press(incrementButton);

    await waitFor(() => {
      expect(mockStripe.initPaymentSheet).toHaveBeenCalled();
    });
  });

  it('handles purchase flow successfully', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ data: [{}], error: null }),
    }));

    (mockStripe.presentPaymentSheet as jest.Mock).mockResolvedValue({ error: null });

    const { getByText } = render(<BuyTicketScreen />);

    fireEvent.press(getByText('Purchase Tickets'));

    await waitFor(() => {
      expect(mockStripe.presentPaymentSheet).toHaveBeenCalled();
      expect(supabase.from('ticket').insert).toHaveBeenCalled();
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('displays an error when payment fails', async () => {
    (mockStripe.presentPaymentSheet as jest.Mock).mockResolvedValue({
      error: { code: 'payment-failed', message: 'Payment failed' },
    });

    const { getByText } = render(<BuyTicketScreen />);

    fireEvent.press(getByText('Purchase Tickets'));

    await waitFor(() => {
      expect(mockStripe.presentPaymentSheet).toHaveBeenCalled();
      expect(getByText('Payment Error: payment-failed')).toBeTruthy();
    });
  });

  it('displays an error when ticket creation fails', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ data: [], error: { message: 'Database error' } }),
    }));

    (mockStripe.presentPaymentSheet as jest.Mock).mockResolvedValue({ error: null });

    const { getByText } = render(<BuyTicketScreen />);

    fireEvent.press(getByText('Purchase Tickets'));

    await waitFor(() => {
      expect(getByText('Error')).toBeTruthy();
      expect(getByText('Failed to process payment or create ticket: Database error')).toBeTruthy();
    });
  });
});