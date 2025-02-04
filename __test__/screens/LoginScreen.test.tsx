import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/screens/Login/LoginScreen'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';
import { useSession } from 'isOwner';
import { useTranslation } from 'react-i18next';

// Mock external dependencies
jest.mock('@supabase/auth-helpers-react');
jest.mock('@react-navigation/native');
jest.mock('isOwner');



jest.mock('isOwner', () => ({
  useSession: jest.fn(),
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key, // Mock translation function
      i18n: {
        language: 'en', // Mock language property
      },
    }),
  }));

describe('LoginScreen', () => {
  const mockSignIn = jest.fn();
  const mockNavigation = { navigate: jest.fn() };
  const mockSetIsOwner = jest.fn();

  beforeEach(() => {
 
    // Mock the Supabase client
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    });

    // Mock the navigation
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);

    // Mock the session context
    (useSession as jest.Mock).mockReturnValue({
      isOwner: false,
      setisOwner: mockSetIsOwner,
    });
 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    // Check if the logo is rendered
    expect(getByText('login.email')).toBeTruthy(); // Translated text
    expect(getByText('login.password')).toBeTruthy(); // Translated text
    expect(getByPlaceholderText('login.enterEmail')).toBeTruthy(); // Translated placeholder
    expect(getByPlaceholderText('login.enterPassword')).toBeTruthy(); // Translated placeholder
    expect(getByText('login.signIn')).toBeTruthy(); // Translated button text
  });

  it('handles email and password input', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('login.enterEmail');
    const passwordInput = getByPlaceholderText('login.enterPassword');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls signInWithPassword on button press', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('login.enterEmail');
    const passwordInput = getByPlaceholderText('login.enterPassword');
    const signInButton = getByText('login.signIn');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows an alert if email or password is missing', () => {
    const { getByText } = render(<LoginScreen />);

    const signInButton = getByText('login.signIn');
    fireEvent.press(signInButton);

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('navigates to ForgotPassword screen', () => {
    const { getByText } = render(<LoginScreen />);

    const forgotPasswordButton = getByText('login.forgotPassword');
    fireEvent.press(forgotPasswordButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('navigates to Register screen', () => {
    const { getByText } = render(<LoginScreen />);

    const registerButton = getByText('login.signUp');
    fireEvent.press(registerButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('navigates to OwnerLogin screen', () => {
    const { getByText } = render(<LoginScreen />);

    const ownerLoginButton = getByText('login.areYouOwner');
    fireEvent.press(ownerLoginButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('OwnerLogin');
  });
});