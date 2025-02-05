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
    const emailInput = getByPlaceholderText('owner_login.email_placeholder');
    const passwordInput = getByPlaceholderText('owner_login.password_placeholder');
    const loginButton = getByText('owner_login.sign_in');

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
    const backToLoginButton = getByText('owner_login.back_to_user_login');

    fireEvent.press(backToLoginButton);

    expect(navigationMock.navigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to owner registration screen', () => {
    const { getByText } = render(<OwnerLoginScreen />);
    const registerButton = getByText('owner_login.register_as_owner');

    fireEvent.press(registerButton);

    expect(navigationMock.navigate).toHaveBeenCalledWith('OwnerRegister');
  });
});
