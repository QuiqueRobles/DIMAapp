// __tests__/SearchBar.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('calls onChangeText when text is entered', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar value="" onChangeText={mockOnChangeText} onClear={jest.fn()} />);
    fireEvent.changeText(getByPlaceholderText('Search clubs...'), 'Test');
    expect(mockOnChangeText).toHaveBeenCalledWith('Test');
  });

  it('calls onClear when clear button is pressed', () => {
    const mockOnClear = jest.fn();
    const { getByTestId } = render(<SearchBar value="Test" onChangeText={jest.fn()} onClear={mockOnClear} />);
    fireEvent.press(getByTestId('clear-button'));
    expect(mockOnClear).toHaveBeenCalled();
  });
});