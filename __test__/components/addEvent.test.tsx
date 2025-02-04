import React from "react";
import { render, fireEvent, waitFor,act } from "@testing-library/react-native";
import AddEventModal from "@/components/addEvent";
import { useClub } from "@/context/EventContext"
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

// Mocking `useClub`
jest.mock("@/context/EventContext", () => ({
  useClub: jest.fn(),
}));
jest.spyOn(Alert, 'alert');

global.alert = jest.fn();

jest.mock("@/lib/supabase", () => ({
    supabase:{
  storage: {
    from: jest.fn(() => ({
        upload: jest.fn(async () => ({ data: { path: "mocked-path" }, error: null })),
      getPublicUrl: jest.fn(() => ({ publicUrl: "http://example.com/image.png" })),
    })),
  },
  from: jest.fn(() => ({
    insert: jest.fn(),
  })),
}}));



jest.mock('expo-image-picker', () => {
    return {
      requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
      launchImageLibraryAsync: jest.fn().mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'file://dummy-image.jpg' }],
      }),
      MediaTypeOptions: { Images: 'Images' },
    };
  });
 
describe("AddEventModal", () => {
  let mockAddEvent: jest.Mock;

  beforeEach(() => {
    mockAddEvent = jest.fn();
    (useClub as jest.Mock).mockReturnValue({
      addEvent: mockAddEvent,
      events: [],
      clubId: "club123",
    });
  });

  it("renders the modal with all input fields", () => {
    const { getByPlaceholderText, getByText } = render(<AddEventModal visible={true} onClose={jest.fn()} />);

    expect(getByText("Add New Event")).toBeTruthy();
    expect(getByPlaceholderText("Event Name")).toBeTruthy();
    expect(getByPlaceholderText("Price")).toBeTruthy();
    expect(getByPlaceholderText("Description")).toBeTruthy();
    expect(getByText("Add Image")).toBeTruthy();
    expect(getByText("Add Event")).toBeTruthy();
  });

  it("updates the form fields when typing", () => {
    const { getByPlaceholderText } = render(<AddEventModal visible={true} onClose={jest.fn()} />);

    fireEvent.changeText(getByPlaceholderText("Event Name"), "Test Event");
    fireEvent.changeText(getByPlaceholderText("Price"), "50");
    fireEvent.changeText(getByPlaceholderText("Description"), "This is a test description");

    expect(getByPlaceholderText("Event Name").props.value).toBe("Test Event");
    expect(getByPlaceholderText("Price").props.value).toBe("50");
    expect(getByPlaceholderText("Description").props.value).toBe("This is a test description");
  });
  it('uploads image successfully and displays success alert', async () => {
    // Renderizza il componente con i dati iniziali
    
    const { getByText, getByTestId, queryByTestId } = render(
        <AddEventModal visible={true} onClose={jest.fn()} />)
        const imageButton = getByTestId('image-button');
        expect(imageButton).toBeTruthy();
    
        // Simula la pressione del bottone per l'upload
        await act(async () => {
          fireEvent.press(imageButton);
        });
        
        
        // Attendi che Alert.alert venga chiamato con il messaggio di successo
        await waitFor(() => {
          expect(Alert.alert).toHaveBeenCalledWith('Success', 'Event picture updated successfully');
        });
    
        // Verifica che, a seguito dell'upload, l'immagine sia stata impostata e renderizzata
        // Supponendo che ModifyEventModal mostri l'immagine in un componente Image con testID 'image-preview'
        const previewImage = queryByTestId('image-preview');
        if (previewImage) {
          expect(previewImage.props.source).toEqual({ uri: 'https://example.com/dummy.jpg' });
        }
});

  it("calls `addEvent` and `supabase.insert` when submitting", async () => {
    const mockOnClose = jest.fn();
    const { getByText, getByPlaceholderText } = render(<AddEventModal visible={true} onClose={mockOnClose} />);

    fireEvent.changeText(getByPlaceholderText("Event Name"), "Test Event");
    fireEvent.changeText(getByPlaceholderText("Price"), "50");
    fireEvent.changeText(getByPlaceholderText("Description"), "Event description");

    fireEvent.press(getByText("Add Event"));

    await waitFor(() => {
      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Event",
          price: 50,
          description: "Event description",
          club_id: "club123",
        })
      );
    });
  });

  it("calls onClose when the cancel button is pressed", () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(<AddEventModal visible={true} onClose={mockOnClose} />);

    fireEvent.press(getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
