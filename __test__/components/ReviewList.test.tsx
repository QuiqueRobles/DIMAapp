// __tests__/ReviewsList.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ReviewsList from '../../src/components/ReviewsList';

describe('ReviewsList', () => {
  const mockReviews = [
    {
      id: '1',
      created_at: '2024-04-10T12:00:00Z',
      user_id: 'user123',
      club_id: 'club456',
      text: 'Amazing experience!',
      num_stars: 5,
      user_name: 'John Doe',
    },
  ];

  it('renders reviews correctly', () => {
    const { getByText } = render(<ReviewsList reviews={mockReviews} />);
    expect(getByText('Amazing experience!')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
  });
});