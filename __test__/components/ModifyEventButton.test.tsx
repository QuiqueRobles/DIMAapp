// __tests__/ModifyEventButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ModifyEventButton from '../../src/components/ModifyEventButton';
import { useNavigation } from '@react-navigation/native';

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('ModifyEventButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ModifyEventButton
        eventId="1"
        clubId="club1"
        eventName="Test Event"
        eventDate={new Date()}
        eventPrice={1000}
        eventDescription="Test Description"
        eventImage="https://example.com/image.jpg"
      />
    );
    expect(getByText('Modify Event')).toBeTruthy();
  });

  it('navigates to ModifyEvent screen on press', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    const { getByText } = render(
      <ModifyEventButton
        eventId="1"
        clubId="club1"
        eventName="Test Event"
        eventDate={new Date()}
        eventPrice={1000}
        eventDescription="Test Description"
        eventImage="https://example.com/image.jpg"
      />
    );
    fireEvent.press(getByText('Modify Event'));

    expect(mockNavigate).toHaveBeenCalledWith('ModifyEvent', {
      eventId: '1',
      clubId: 'club1',
      eventName: 'Test Event',
      eventDate: expect.any(Date),
      eventPrice: 1000,
      eventDescription: 'Test Description',
      eventImage: 'https://example.com/image.jpg',
    });
  });
});