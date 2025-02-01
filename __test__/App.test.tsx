
// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import AppNavigator from '../App';
// import { SessionContextProvider } from '@supabase/auth-helpers-react';
// import { supabase } from '../src/lib/supabase';
// import { IsOwnerProvider } from '../isOwner';
// import { ClubProvider } from '../src/context/EventContext';
// import { StripeProvider } from '@stripe/stripe-react-native';
// jest.mock("uuid", () => ({
//   v4: jest.fn(() => "test-uuid"),
// }));

// jest.mock('../.env', () => ({ STRIPE_PUBLISHABLE_KEY: 'test_key' }));
// jest.mock('../src/lib/supabase');

// const mockSession = {
//   user: { id: 'test-user-id' },
// };

// const mockSupabase = {
//   auth: {
//     getSession: jest.fn(() => Promise.resolve({ data: { session: mockSession } })),
//     onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
//   },
//   from: jest.fn(() => ({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ data: { isClub: false } }) })),
// };

// supabase.auth = mockSupabase.auth;
// supabase.from = mockSupabase.from;

// describe('App Navigation', () => {
//   it('renders login screen if no session exists', async () => {
//     mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });
    
//     const { getByText } = render(
//       <StripeProvider publishableKey="test_key">
//         <ClubProvider>
//           <SessionContextProvider supabaseClient={supabase}>
//             <IsOwnerProvider>
//               <NavigationContainer>
//                 <AppNavigator />
//               </NavigationContainer>
//             </IsOwnerProvider>
//           </SessionContextProvider>
//         </ClubProvider>
//       </StripeProvider>
//     );
    
//     await waitFor(() => expect(getByText('Login')).toBeTruthy());
//   });
  
//   it('renders main tabs for a regular user', async () => {
//     mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
//     mockSupabase.from().eq.mockResolvedValueOnce({ data: { isClub: false } });
    
//     const { getByText } = render(
//       <StripeProvider publishableKey="test_key">
//         <ClubProvider>
//           <SessionContextProvider supabaseClient={supabase}>
//             <IsOwnerProvider>
//               <NavigationContainer>
//                 <AppNavigator />
//               </NavigationContainer>
//             </IsOwnerProvider>
//           </SessionContextProvider>
//         </ClubProvider>
//       </StripeProvider>
//     );
    
//     await waitFor(() => expect(getByText('Home')).toBeTruthy());
//   });
  
//   it('renders owner tabs if user is an owner', async () => {
//     mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
//     mockSupabase.from().eq.mockResolvedValueOnce({ data: { isClub: true } });
    
//     const { getByText } = render(
//       <StripeProvider publishableKey="test_key">
//         <ClubProvider>
//           <SessionContextProvider supabaseClient={supabase}>
//             <IsOwnerProvider>
//               <NavigationContainer>
//                 <AppNavigator />
//               </NavigationContainer>
//             </IsOwnerProvider>
//           </SessionContextProvider>
//         </ClubProvider>
//       </StripeProvider>
//     );
    
//     await waitFor(() => expect(getByText('Events')).toBeTruthy());
//   });
// });

// App.test.tsx
import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react-native';
import App from '../App'; // Adjust the path as needed
import { supabase } from '@/lib/supabase';

// --- MOCK SUPABASE AUTH METHODS ---
// These mocks simulate the behavior of the Supabase auth module.
const customerSession = { user: { id: 'customer1' } };
const ownerSession = { user: { id: 'owner1' } };

(supabase.auth.getSession as jest.Mock) = jest.fn();
(supabase.auth.onAuthStateChange as jest.Mock) = jest.fn().mockReturnValue({
  data: { subscription: { unsubscribe: jest.fn() } },
});

// --- STUB DESTINATION SCREENS USING LOCAL REQUIRES ---

// Stub HomeScreen for Customer MainTabs
jest.mock('@/screens/HomeScreen/HomeScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID="home-screen-placeholder">Home Screen</Text>;
});

// Stub HomeOwnerScreen for Owner MainTabs_owner
jest.mock('@/screens/HomeOwnerScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID="home-owner-screen-placeholder">Home Owner Screen</Text>;
});

// Stub LoginScreen for AuthStack
jest.mock('@/screens/Login/LoginScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID="login-screen-placeholder">Login Screen</Text>;
});

// --- MOCK USER LOOKUP ---
// This helper sets up the chainable query mocks for the users table lookup.
const setupUserLookupMock = (isClub: boolean) => {
  const mockSelect = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();
  const mockSingle = jest.fn().mockResolvedValue({ data: { isClub }, error: null });
  (supabase.from as jest.Mock) = jest.fn(() => ({
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
  }));
};

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('App Navigation Redirection', () => {
  it('renders MainTabs when an active customer session is detected', async () => {
    // Simulate an active session for a customer
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: customerSession } });
    // Set up user lookup to return isClub: false (customer)
    setupUserLookupMock(false);

    // Render the App component.
    const { getByTestId } = render(<App />);
    
    // In the customer MainTabs, our stubbed HomeScreen renders a placeholder with testID "home-screen-placeholder".
    await waitFor(() => {
      expect(getByTestId('home-screen-placeholder')).toBeTruthy();
    });
  });

  it('renders MainTabs_owner when an active owner session is detected', async () => {
    // Simulate an active session for an owner
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: ownerSession } });
    // Set up user lookup to return isClub: true (owner)
    setupUserLookupMock(true);

    // Render the App component.
    const { getByTestId } = render(<App />);
    
    // In the owner MainTabs_owner, our stubbed HomeOwnerScreen renders a placeholder with testID "home-owner-screen-placeholder".
    await waitFor(() => {
      expect(getByTestId('home-owner-screen-placeholder')).toBeTruthy();
    });
  });

  it('renders AuthStack when there is no active session', async () => {
    // Simulate no active session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    // No need to set up user lookup since there is no session.

    // Render the App component.
    const { getByTestId } = render(<App />);
    
    // In AuthStack, our stubbed LoginScreen renders a placeholder with testID "login-screen-placeholder".
    await waitFor(() => {
      expect(getByTestId('login-screen-placeholder')).toBeTruthy();
    });
  });
});