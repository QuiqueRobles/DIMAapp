import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Example Test', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Text>Hello, Tests!</Text>);
    expect(getByText('Hello, Tests!')).toBeTruthy();
  });
});