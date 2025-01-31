// __tests__/FilterModal.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { FilterModal } from '../../src/components/FilterModal';


describe('FilterModal', () => {
  it('renders correctly when visible', () => {
    const { getByText } = render(
      <FilterModal 
  isVisible={true} 
  onClose={jest.fn()} 
  onApply={jest.fn()} 
  initialFilters={{ minRating: 0 }} // Ensure minRating is defined
/>

    );
    expect(getByText('Filter Clubs')).toBeTruthy();
  });
});