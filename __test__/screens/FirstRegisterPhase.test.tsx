import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FirstRegisterPhase from '@/screens/Login/registerScreen/firstRegisterPhase';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
  }));

describe('FirstRegisterPhase Component', () => {
    const mockGoToSecondPage = jest.fn();
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockSetConfirmPassword = jest.fn();
    

    it('renders all input fields correctly', () => {
        const { getByPlaceholderText } = render(
            <FirstRegisterPhase
                goToSecondPage={mockGoToSecondPage}
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                confirmPassword=""
                setConfirmPassword={mockSetConfirmPassword}
            />
        );

        expect(getByPlaceholderText('Value')).toBeTruthy(); // Email
        expect(getByPlaceholderText('Value')).toBeTruthy(); // Password
        expect(getByPlaceholderText('Value')).toBeTruthy(); // Confirm Password
    });

    it('calls setEmail when typing in email field', () => {
        const { getAllByPlaceholderText } = render(
            <FirstRegisterPhase
                goToSecondPage={mockGoToSecondPage}
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                confirmPassword=""
                setConfirmPassword={mockSetConfirmPassword}
            />
        );

        const emailInput = getAllByPlaceholderText('Value')[0];
        fireEvent.changeText(emailInput, 'test@example.com');

        expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('calls setPassword when typing in password field', () => {
        const { getAllByPlaceholderText } = render(
            <FirstRegisterPhase
                goToSecondPage={mockGoToSecondPage}
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                confirmPassword=""
                setConfirmPassword={mockSetConfirmPassword}
            />
        );

        const passwordInput = getAllByPlaceholderText('Value')[1];
        fireEvent.changeText(passwordInput, 'password123');

        expect(mockSetPassword).toHaveBeenCalledWith('password123');
    });

    it('calls setConfirmPassword when typing in confirm password field', () => {
        const { getAllByPlaceholderText } = render(
            <FirstRegisterPhase
                goToSecondPage={mockGoToSecondPage}
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                confirmPassword=""
                setConfirmPassword={mockSetConfirmPassword}
            />
        );

        const confirmPasswordInput = getAllByPlaceholderText('Value')[2];
        fireEvent.changeText(confirmPasswordInput, 'password123');

        expect(mockSetConfirmPassword).toHaveBeenCalledWith('password123');
    });
});
