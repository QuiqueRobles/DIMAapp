// __tests__/StarRating.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native'; // Import render and fireEvent
import StarRating from '../../src/components/StarRating'; // Adjust the import path as needed

describe('StarRating', () => {
  it('renders the correct number of filled stars based on rating', () => {
    const { getAllByTestId } = render(<StarRating rating={3} onRatingChange={jest.fn()} />);
    expect(getAllByTestId('filled-star').length).toBe(3);
  });

  it('calls onRatingChange when a star is pressed', () => {
    const mockOnRatingChange = jest.fn();
    const { getAllByTestId } = render(<StarRating rating={3} onRatingChange={mockOnRatingChange} />);
    fireEvent.press(getAllByTestId('star-button')[4]); // Simulate pressing the 5th star
    expect(mockOnRatingChange).toHaveBeenCalledWith(5); // Expect the rating to be updated to 5
  });
});