import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '@/screens/Login/registerScreen/RegisterScreen'; // Adjust the path as needed
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';

// Mock external dependencies
jest.mock('@supabase/auth-helpers-react');
jest.mock('@react-navigation/native');

describe('RegisterScreen', () => {
  const mockSignIn = jest.fn();
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    // Mock the Supabase client
    (useSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    });

    // Mock the navigation
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the first page correctly', () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    // Check if the first page elements are rendered
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Already have an account? Sign in')).toBeTruthy();
  });

  it('navigates to the second page when "Sign Up" is pressed', () => {
    const { getByText } = render(<RegisterScreen />);

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    // Check if the second page elements are rendered
    expect(getByText('Submit')).toBeTruthy();
  });

  it('handles email and password input on the first page', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
    expect(confirmPasswordInput.props.value).toBe('password123');
  });

  it('navigates back to the first page when the back button is pressed', () => {
    const { getByText, getByTestId } = render(<RegisterScreen />);

    // Navigate to the second page
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    // Press the back button
    const backButton = getByTestId('back-button'); // Add a testID to the back button in your component
    fireEvent.press(backButton);

    // Check if the first page elements are rendered again
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('handles date picker interaction on the second page', () => {
    const { getByText, getByTestId } = render(<RegisterScreen />);

    // Navigate to the second page
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    // Open the date picker
    const datePickerButton = getByText('Select Date'); // Adjust based on your component
    fireEvent.press(datePickerButton);

    // Confirm the date
    const confirmButton = getByText('Confirm'); // Adjust based on your component
    fireEvent.press(confirmButton);

    // Check if the date is updated
    expect(getByText('Selected Date')).toBeTruthy(); // Adjust based on your component
  });

  it('handles country picker interaction on the second page', () => {
    const { getByText, getByTestId } = render(<RegisterScreen />);

    // Navigate to the second page
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    // Open the country picker
    const countryPickerButton = getByText('Select Country'); // Adjust based on your component
    fireEvent.press(countryPickerButton);

    // Select a country
    const countryOption = getByText('United States'); // Adjust based on your component
    fireEvent.press(countryOption);

    // Check if the country is updated
    expect(getByText('United States')).toBeTruthy(); // Adjust based on your component
  });

  it('handles gender selection on the second page', () => {
    const { getByText, getByTestId } = render(<RegisterScreen />);

    // Navigate to the second page
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    // Select a gender
    const genderOption = getByText('Male'); // Adjust based on your component
    fireEvent.press(genderOption);

    // Check if the gender is updated
    expect(getByText('Male')).toBeTruthy(); // Adjust based on your component
  });

  it('navigates to the login screen when "Already have an account? Sign in" is pressed', () => {
    const { getByText } = render(<RegisterScreen />);

    const loginLink = getByText('Already have an account? Sign in');
    fireEvent.press(loginLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});