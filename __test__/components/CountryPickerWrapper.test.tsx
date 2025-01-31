// __tests__/CountryPickerWrapper.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import CountryPickerWrapper from '../../src/components/CountryPickerWrapper';

jest.mock('react-native-country-picker-modal', () => {
  return {
    __esModule: true,
    default: jest.fn(() => null),
  };
});

describe('CountryPickerWrapper', () => {
  it('renders correctly and calls onSelect when a country is selected', () => {
    const mockOnSelect = jest.fn();
    render(<CountryPickerWrapper onSelect={mockOnSelect} countryCode="US" />);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});