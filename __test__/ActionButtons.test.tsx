// __test__/ActionButtons.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActionButtons } from '../src/components/ActionButtons';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

describe('ActionButtons', () => {
  const mockOnFilterPress = jest.fn();
  const mockOnMapPress = jest.fn();
  const mockOnSortPress = jest.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(
      <ActionButtons
        onFilterPress={mockOnFilterPress}
        onMapPress={mockOnMapPress}
        onSortPress={mockOnSortPress}
      />
    );

    // Check if all buttons are rendered
    expect(getByTestId('filter-button')).toBeTruthy();
    expect(getByTestId('map-button')).toBeTruthy();
    expect(getByTestId('sort-button')).toBeTruthy();
  });

  it('calls onFilterPress when the filter button is pressed', () => {
    const { getByTestId } = render(
      <ActionButtons
        onFilterPress={mockOnFilterPress}
        onMapPress={mockOnMapPress}
        onSortPress={mockOnSortPress}
      />
    );

    // Simulate a press on the filter button
    fireEvent.press(getByTestId('filter-button'));
    expect(mockOnFilterPress).toHaveBeenCalled();
  });

  it('calls onMapPress when the map button is pressed', () => {
    const { getByTestId } = render(
      <ActionButtons
        onFilterPress={mockOnFilterPress}
        onMapPress={mockOnMapPress}
        onSortPress={mockOnSortPress}
      />
    );

    // Simulate a press on the map button
    fireEvent.press(getByTestId('map-button'));
    expect(mockOnMapPress).toHaveBeenCalled();
  });

  it('calls onSortPress when the sort button is pressed', () => {
    const { getByTestId } = render(
      <ActionButtons
        onFilterPress={mockOnFilterPress}
        onMapPress={mockOnMapPress}
        onSortPress={mockOnSortPress}
      />
    );

    // Simulate a press on the sort button
    fireEvent.press(getByTestId('sort-button'));
    expect(mockOnSortPress).toHaveBeenCalled();
  });
});