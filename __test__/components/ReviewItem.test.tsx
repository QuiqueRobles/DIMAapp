// __tests__/ReviewItem.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ReviewItem from '../../src/components/ReviewItem';

describe('ReviewItem', () => {
  const mockReview = {
    created_at: '2024-04-10T12:00:00Z',
    text: 'Great club!',
    num_stars: 5,
  };

  it('renders review details correctly', () => {
    const { getByText } = render(<ReviewItem review={mockReview} />);
    expect(getByText('Great club!')).toBeTruthy();
  });
});
