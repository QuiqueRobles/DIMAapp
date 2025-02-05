// ModificaEventModal.test.tsx

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, Text } from 'react-native';
import ModifyEvent from '@/components/ModifyEvent';
import { useClub } from '@/context/EventContext';

// --- MOCK di expo-image-picker ---
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

// --- MOCK di supabase.storage ---
jest.mock('@/lib/supabase', () => {
  const mockStorageBuilder = {
    upload: jest.fn().mockResolvedValue({ error: null }),
    getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/dummy.jpg' } }),
  };
  const mockQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({error: null}),
  };
  return {
    supabase: {
      storage: {
        from: jest.fn(() => mockStorageBuilder),
      },
      from: jest.fn(() => mockQueryBuilder),
    },

    
  };
});
jest.mock("../../src/context/EventContext", () => ({
  useClub: jest.fn(),
}));

const {supabase: mockedSupabase} = require('@/lib/supabase');

// Se necessario, puoi mockare anche Alert.alert per verificarne la chiamata
jest.spyOn(Alert, 'alert');

global.alert = jest.fn();


// Creiamo una funzione mock per onClose da passare come prop
const onCloseMock = jest.fn();
describe("ModifyEventModal", () => {
  const mockSetEvents = jest.fn();

  beforeEach(() => {
    (useClub as jest.Mock).mockReturnValue({
      setEvents: mockSetEvents,
      events: [{ id: "1", name: "Test Event" }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });




  it('uploads image successfully and displays success alert', async () => {
    // Renderizza il componente con i dati iniziali
    const onCloseMock = jest.fn();
    const { getByText, getByTestId, queryByTestId } = render(
      <ModifyEvent
        visible={true}
        onClose={onCloseMock}
        eventId="1"
        clubId="club1"
        eventName="Test Event"
        eventDate="2023-01-01"
        eventPrice={100}
        eventDescription="Description"
        eventImage={null}
      />
    );

    // Il bottone mostra il testo "Add Image" quando image è null
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
    
    // In alternativa, se il componente non ha un testID specifico per l'immagine,
    // puoi verificare che il testo del bottone cambi in "Change Image"
    expect(getByText(/Change Image/i)).toBeTruthy();
  });

  it('shows permission alert if media library permission is denied', async () => {
    // Simula il rifiuto dei permessi
    const ImagePicker = require('expo-image-picker');
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ granted: false });
    
    // Renderizza il componente
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <ModifyEvent
        visible={true}
        onClose={onCloseMock}
        eventId="1"
        clubId="club1"
        eventName="Test Event"
        eventDate="2023-01-01"
        eventPrice={100}
        eventDescription="Description"
        eventImage={null}
      />
    );

    // Premi il bottone per upload
    const imageButton = getByText(/Add Image/i);
    await act(async () => {
      fireEvent.press(imageButton);
    });

    // Verifica che venga mostrato un Alert per il permesso negato
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission Required',
        'Please allow access to your photo library to upload an image.'
      );
    });
  });

  it('calls supabase update and shows success alert and calls onClose', async () => {
    // Renderizza il componente ModifyEventModal con alcuni dati di test
    const { getByText } = render(
      <ModifyEvent
        visible={true}
        onClose={onCloseMock}
        eventId="1"
        clubId="club1"
        eventName="Test Event"
        eventDate="2023-01-01"
        eventPrice={100}
        eventDescription="Description"
        eventImage={null}
      />
    );

    // Troviamo il bottone "Confirm" (che chiama handleSubmit)
    const confirmButton = getByText('Confirm');
    expect(confirmButton).toBeTruthy();

    // Simuliamo la pressione del bottone
    await act(async () => {
      fireEvent.press(confirmButton);
    });

    // Verifichiamo che supabase.from sia stato chiamato con 'event'
    expect(mockedSupabase.from).toHaveBeenCalledWith('event');

    // Verifichiamo che update sia stato chiamato con l'oggetto aggiornato
    // expect(mockedSupabase.from.update.eq).toHaveBeenCalledWith({
    //   name: 'Test Event',
    //   date: '2023-01-01',
    //   price: 100, // parseInt("100") restituisce 100
    //   description: 'Description',
    //   image: null,
    // });

    // Verifichiamo che eq sia stato chiamato con ('id', '1')
    //expect(mockedSupabase.from.update.eq).toHaveBeenCalledWith('id', '1');

    // Aspettiamo che la chiamata a alert e onClose siano eseguite
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Event updated successfully");
      expect(onCloseMock).toHaveBeenCalled();
        expect(mockSetEvents).toHaveBeenCalled();
       
     
    
    });
  });
});
