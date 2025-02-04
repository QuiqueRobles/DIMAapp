import React from 'react';
import { render, fireEvent,waitFor        } from '@testing-library/react-native';
import RegisterScreen from '@/screens/Login/registerScreen/index';
import { TextInput, Button, View, Text ,Alert} from 'react-native';


import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';

// Mock the useSupabaseClient and useNavigation hooks
jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: jest.fn(),
  
}));
jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    
  },
}));



jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { View,Text } = require('react-native');
  
    return {
      FontAwesome: () => <View testID="font-awesome-mock" />, // Mocking FontAwesome component
      Feather: (props) => <Text {...props} />,
    };
  });
  







describe('RegisterScreen', () => {
  const mockSupabaseClient = {
    auth: {
      signUp: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
  };

  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    (useSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    
  

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the first phase of the registration form', () => {
    const { getByTestId, getByText } = render(<RegisterScreen />);

    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('confirm-password-input')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('navigates to the second phase when the first phase is submitted', async () => {
    const { getByTestId, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'password123');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByTestId('username-input')).toBeTruthy();
      expect(getByText('Submit')).toBeTruthy();
    });
  });

  it('shows an error if passwords do not match', async () => {
    const { getByTestId, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'password123');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Passwords do not match')
      
    });
  });

  it('calls the register function when the second phase is submitted', async () => {
    const { getByTestId, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'password123');
    fireEvent.press(getByText('Submit'));



    // Fill out the second phase
    await waitFor(() => {
      fireEvent.changeText(getByTestId('username-input'), 'testuser');
      fireEvent.press(getByText('Submit'));
    });

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('navigates to the login screen when the "Already have an account?" link is pressed', async () => {
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText('Already have an account? Sign in'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });
});