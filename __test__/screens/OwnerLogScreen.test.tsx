// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import OwnerLoginScreen from  '@/screens/Login/OwnerLogScreen';
// import { useSupabaseClient } from '@supabase/auth-helpers-react';
// import { useNavigation } from '@react-navigation/native';
// import { useClub } from'@/context/EventContext';
// import * as useSessionModule from 'isOwner';
// import { IsOwnerProvider } from 'isOwner';
// import { SessionContextProvider } from '@supabase/auth-helpers-react';
// // Mock the external dependencies
// jest.mock('@supabase/auth-helpers-react');
// jest.mock('@react-navigation/native');

//  jest.mock('@/context/EventContext');

//  jest.mock('isOwner', () => ({
//    useSession: jest.fn(),
//  }));
//  const mockSignIn = jest.fn();
//  const mockNavigation = { navigate: jest.fn() };
//  const mockSetClubId = jest.fn();
//  const mockSetIsOwner = jest.fn();
//  const mockSupabaseClient = {
//     auth: {
//       signInWithPassword: jest.fn(),
//       getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }),
//     },
//     supabaseUrl: 'https://mock-url.supabase.co', // Mock Supabase URL
//     supabaseKey: 'mock-supabase-key', // Mock Supabase key
//     realtime: {}, // Mock Realtime client
//     rest: {}, // Mock REST client
//     // Add other required properties here
//   } as any; // Use `as any` to bypass TypeScript errors for missing properties
 
//  describe('OwnerLoginScreen', () => {
//     const mockSignIn = jest.fn();
//     const mockNavigation = { navigate: jest.fn() };
//     const mockSetClubId = jest.fn();
//     const mockSetIsOwner = jest.fn();

 
//    beforeEach(() => {
//      // Mock the Supabase client
//      (useSupabaseClient as jest.Mock).mockReturnValue({
//        auth: {
//          signInWithPassword: mockSignIn,
//          getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }),
//        },
//      });
// ù
 
//      // Mock the navigation
//      (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
 
//      // Mock the session context
 
//     // Mock the session context
//     (useSessionModule.useSession as jest.Mock).mockReturnValue({
//         isOwner: false,
//         setisOwner: mockSetIsOwner,
//       });
//     });
 
//      // Mock the club context
//      (useClub as jest.Mock).mockReturnValue({
//        clubId: null,
//        setClubId: mockSetClubId,
//      });
//    });
 
//    afterEach(() => {
//      jest.clearAllMocks();
//    });
 
//    it('renders correctly', () => {
//      const { getByText, getByPlaceholderText } = render( 
//         <OwnerLoginScreen />
//      );
 
//      expect(getByText('Owner Login')).toBeTruthy();
//      expect(getByPlaceholderText('Email')).toBeTruthy();
//      expect(getByPlaceholderText('Password')).toBeTruthy();
//      expect(getByText('Sign In as Owner')).toBeTruthy();
//    });
 
//    // Add more tests here...

//   it('handles email and password input', () => {
//     const { getByPlaceholderText } = render(   

//         <useSessionModule.IsOwnerProvider>
//           <OwnerLoginScreen />
//         </useSessionModule.IsOwnerProvider>
//       );


//     const emailInput = getByPlaceholderText('Email');
//     const passwordInput = getByPlaceholderText('Password');

//     fireEvent.changeText(emailInput, 'owner@example.com');
//     fireEvent.changeText(passwordInput, 'password123');

//     expect(emailInput.props.value).toBe('owner@example.com');
//     expect(passwordInput.props.value).toBe('password123');
//   });

//   it('calls signInWithPassword on button press', async () => {
//     const { getByText, getByPlaceholderText } = render(  <SessionContextProvider supabaseClient={mockSupabaseClient}>

//         <useSessionModule.IsOwnerProvider>
//           <OwnerLoginScreen />
//         </useSessionModule.IsOwnerProvider>
//         </SessionContextProvider> );

//     const emailInput = getByPlaceholderText('Email');
//     const passwordInput = getByPlaceholderText('Password');
//     const signInButton = getByText('Sign In as Owner');

//     fireEvent.changeText(emailInput, 'owner@example.com');
//     fireEvent.changeText(passwordInput, 'password123');
//     fireEvent.press(signInButton);

//     await waitFor(() => {
//       expect(mockSignIn).toHaveBeenCalledWith({
//         email: 'owner@example.com',
//         password: 'password123',
//       });
//     });
//   });

//   it('navigates to user login screen on back to user login press', () => {
//     const { getByText } = render(     <SessionContextProvider supabaseClient={mockSupabaseClient}>

//         <useSessionModule.IsOwnerProvider>
//           <OwnerLoginScreen />
//         </useSessionModule.IsOwnerProvider>
//         </SessionContextProvider> );

//     const backToLoginButton = getByText('Back to User Login');
//     fireEvent.press(backToLoginButton);

//     expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
//   });

//   it('navigates to owner register screen on register as owner press', () => {
//     const { getByText } = render(     <SessionContextProvider supabaseClient={mockSupabaseClient}>

//         <useSessionModule.IsOwnerProvider>
//           <OwnerLoginScreen />
//         </useSessionModule.IsOwnerProvider>
//         </SessionContextProvider> );

//     const registerButton = getByText('Register as owner');
//     fireEvent.press(registerButton);

//     expect(mockNavigation.navigate).toHaveBeenCalledWith('OwnerRegister');
//   });

//   it('sets club ID and owner status on successful login', async () => {
//     mockSignIn.mockResolvedValueOnce({ error: null });

//     const { getByText, getByPlaceholderText } = render(
//         <SessionContextProvider supabaseClient={mockSupabaseClient}>

//       <useSessionModule.IsOwnerProvider>
//         <OwnerLoginScreen />
//       </useSessionModule.IsOwnerProvider>
//       </SessionContextProvider> );

//     const emailInput = getByPlaceholderText('Email');
//     const passwordInput = getByPlaceholderText('Password');
//     const signInButton = getByText('Sign In as Owner');

//     fireEvent.changeText(emailInput, 'owner@example.com');
//     fireEvent.changeText(passwordInput, 'password123');
//     fireEvent.press(signInButton);

//     await waitFor(() => {
//       expect(mockSetClubId).toHaveBeenCalledWith('123');
//       expect(mockSetIsOwner).toHaveBeenCalledWith(true);
//     });
//   });

//   it('shows an alert on login error', async () => {
//     mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } });

//     const { getByText, getByPlaceholderText } = render(     <SessionContextProvider supabaseClient={mockSupabaseClient}>

//         <useSessionModule.IsOwnerProvider>
//           <OwnerLoginScreen />
//         </useSessionModule.IsOwnerProvider>
//         </SessionContextProvider> );

//     const emailInput = getByPlaceholderText('Email');
//     const passwordInput = getByPlaceholderText('Password');
//     const signInButton = getByText('Sign In as Owner');

//     fireEvent.changeText(emailInput, 'owner@example.com');
//     fireEvent.changeText(passwordInput, 'password123');
//     fireEvent.press(signInButton);

//     await waitFor(() => {
//       expect(mockSignIn).toHaveBeenCalledWith({
//         email: 'owner@example.com',
//         password: 'password123',
//       });
//     });
//   });

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OwnerLoginScreen from  '@/screens/Login/OwnerLogScreen';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';
import { useClub } from'@/context/EventContext';
import { useSession } from 'isOwner';

import { IsOwnerProvider } from 'isOwner';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
global.error=jest.fn();


jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('isOwner', () => ({
  useSession: jest.fn(),
}));

jest.mock('@/context/EventContext', () => ({
  useClub: jest.fn(),
}));

describe('OwnerLoginScreen', () => {
  let supabaseMock: any;
  let navigationMock: any;
  let sessionMock: any;
  let clubMock: any;

  beforeEach(() => {
    supabaseMock = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: '12345' } }, error: null }),
      },
    };

    navigationMock = { navigate: jest.fn() };
    sessionMock = { isOwner: false, setisOwner: jest.fn() };
    clubMock = { clubId: null, setClubId: jest.fn() };

    (useSupabaseClient as jest.Mock).mockReturnValue(supabaseMock);
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    (useSession as jest.Mock).mockReturnValue(sessionMock);
    (useClub as jest.Mock).mockReturnValue(clubMock);
  });

  it('renders login screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(<OwnerLoginScreen />);

    expect(getByText('Owner Login')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In as Owner')).toBeTruthy();
  });

  it('updates input fields correctly', () => {
    const { getByPlaceholderText } = render(<OwnerLoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'owner@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('owner@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('handles login button press', async () => {
    const { getByText, getByPlaceholderText } = render(<OwnerLoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign In as Owner');

    fireEvent.changeText(emailInput, 'owner@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'owner@example.com',
      password: 'password123',
    }));
  });

  it('navigates to user login screen', () => {
    const { getByText } = render(<OwnerLoginScreen />);
    const backToLoginButton = getByText('Back to User Login');

    fireEvent.press(backToLoginButton);

    expect(navigationMock.navigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to owner registration screen', () => {
    const { getByText } = render(<OwnerLoginScreen />);
    const registerButton = getByText('Register as owner');

    fireEvent.press(registerButton);

    expect(navigationMock.navigate).toHaveBeenCalledWith('OwnerRegister');
  });
});