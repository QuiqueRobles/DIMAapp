// __tests__/LoadingSpinner.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from '../../src/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<LoadingSpinner />);
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});