
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../App';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '../src/lib/supabase';
import { IsOwnerProvider } from '../isOwner';
import { ClubProvider } from '../src/context/EventContext';
import { StripeProvider } from '@stripe/stripe-react-native';
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid"),
}));

jest.mock('../.env', () => ({ STRIPE_PUBLISHABLE_KEY: 'test_key' }));
jest.mock('../src/lib/supabase');

const mockSession = {
  user: { id: 'test-user-id' },
};

const mockSupabase = {
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: mockSession } })),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  },
  from: jest.fn(() => ({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ data: { isClub: false } }) })),
};

supabase.auth = mockSupabase.auth;
supabase.from = mockSupabase.from;

describe('App Navigation', () => {
  it('renders login screen if no session exists', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });
    
    const { getByText } = render(
      <StripeProvider publishableKey="test_key">
        <ClubProvider>
          <SessionContextProvider supabaseClient={supabase}>
            <IsOwnerProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </IsOwnerProvider>
          </SessionContextProvider>
        </ClubProvider>
      </StripeProvider>
    );
    
    await waitFor(() => expect(getByText('Login')).toBeTruthy());
  });
  
  it('renders main tabs for a regular user', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.from().eq.mockResolvedValueOnce({ data: { isClub: false } });
    
    const { getByText } = render(
      <StripeProvider publishableKey="test_key">
        <ClubProvider>
          <SessionContextProvider supabaseClient={supabase}>
            <IsOwnerProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </IsOwnerProvider>
          </SessionContextProvider>
        </ClubProvider>
      </StripeProvider>
    );
    
    await waitFor(() => expect(getByText('Home')).toBeTruthy());
  });
  
  it('renders owner tabs if user is an owner', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
    mockSupabase.from().eq.mockResolvedValueOnce({ data: { isClub: true } });
    
    const { getByText } = render(
      <StripeProvider publishableKey="test_key">
        <ClubProvider>
          <SessionContextProvider supabaseClient={supabase}>
            <IsOwnerProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </IsOwnerProvider>
          </SessionContextProvider>
        </ClubProvider>
      </StripeProvider>
    );
    
    await waitFor(() => expect(getByText('Events')).toBeTruthy());
  });
});
