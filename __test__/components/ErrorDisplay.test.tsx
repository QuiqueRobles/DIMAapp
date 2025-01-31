// __tests__/ErrorDisplay.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import ErrorDisplay from '../../src/components/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders correctly with error message', () => {
    const { getByText } = render(<ErrorDisplay message="An error occurred" />);
    expect(getByText('An error occurred')).toBeTruthy();
  });
});