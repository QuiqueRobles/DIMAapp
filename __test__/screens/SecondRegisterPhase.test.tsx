import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SecondRegisterPhase from '@/screens/Login/registerScreen/secondRegisterPhase';
import { Country } from 'react-native-country-picker-modal/lib/types';
import { FontAwesome } from '@expo/vector-icons';

// Mock country data

const mockCountry: Country = {
    cca2: 'US',
    name: 'United States',

} as any;
jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { View,Text } = require('react-native');
  
    return {
      FontAwesome: () => <View testID="font-awesome-mock" />, // Mocking FontAwesome component
      Feather: (props) => <Text {...props} />,
    };
  });
  
  
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('SecondRegisterPhase Component', () => {
    const mockSetUsername = jest.fn();
    const mockSetDateOfBirth = jest.fn();
    const mockSetCountry = jest.fn();
    const mockSetGender = jest.fn();

    it('renders all input fields correctly', () => {
        const { getByPlaceholderText, getByText } = render(
            <SecondRegisterPhase 
                username="Username"
                setUsername={mockSetUsername}
                dateOfBirth={new Date()}
                setDateOfBirth={mockSetDateOfBirth}
                country={mockCountry}
                setCountry={mockSetCountry}
                gender="F"
                setGender={mockSetGender} 
            />
        );

        expect(getByPlaceholderText('register.second_phase.username')).toBeTruthy(); // Username 
        expect(getByText('register.second_phase.date_of_birth')).toBeTruthy(); // DOB label
        expect(getByText('register.second_phase.country')).toBeTruthy(); // Country label
    });

    it('calls setUsername when typing in username field', () => {
        const { getByPlaceholderText } = render(
            <SecondRegisterPhase
                username=""
                setUsername={mockSetUsername}
                dateOfBirth={new Date()}
                setDateOfBirth={mockSetDateOfBirth}
                country={mockCountry}
                setCountry={mockSetCountry}
                gender=""
                setGender={mockSetGender}
            />
        );

        const usernameInput = getByPlaceholderText('register.second_phase.username_placeholder');
        fireEvent.changeText(usernameInput, 'testUser');

        expect(mockSetUsername).toHaveBeenCalledWith('testUser');
    });

    it('calls setDateOfBirth when a new date is selected', () => {
        const testDate = new Date('2000-01-01');

        const { getByText } = render(
            <SecondRegisterPhase
                username=""
                setUsername={mockSetUsername}
                dateOfBirth={new Date()}
                setDateOfBirth={mockSetDateOfBirth}
                country={mockCountry}
                setCountry={mockSetCountry}
                gender=""
                setGender={mockSetGender}
            />
        );

        fireEvent.press(getByText('register.second_phase.date_of_birth')); // Open Date Picker
        
        fireEvent(getByText('register.second_phase.confirm'), 'press'); // Confirm Date Selection

        expect(mockSetDateOfBirth).toHaveBeenCalled();
    });

    it('calls setCountry when a country is selected', () => {
        const { getByText } = render(
            <SecondRegisterPhase
                username=""
                setUsername={mockSetUsername}
                dateOfBirth={new Date()}
                setDateOfBirth={mockSetDateOfBirth}
                country={undefined}
                setCountry={mockSetCountry}
                gender=""
                setGender={mockSetGender}
            />
        );

        fireEvent.press(getByText('register.second_phase.country'));
        expect(mockSetCountry).toHaveBeenCalled();
    });

    it('calls setGender when selecting a gender', () => {
        const { getByText } = render(
            <SecondRegisterPhase
                username=""
                setUsername={mockSetUsername}
                dateOfBirth={new Date()}
                setDateOfBirth={mockSetDateOfBirth}
                country={mockCountry}
                setCountry={mockSetCountry}
                gender=""
                setGender={mockSetGender}
            />
        );

        fireEvent.press(getByText('')); // Select Gender Radio Button
        expect(mockSetGender).toHaveBeenCalled();
    });
});
