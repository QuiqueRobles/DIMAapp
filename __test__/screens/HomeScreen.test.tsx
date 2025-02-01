
jest.mock('@/lib/supabase', () => {
  // Importa il mock creato in __mocks__
  const { supabase, mockQueryBuilder } = require('../../__mocks__/supabaseClient');
  return { supabase, mockQueryBuilder };
});

// Variabile globale per la funzione navigate che potremo controllare nei test
const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});



import React from 'react';
import { render, fireEvent, waitFor, act, cleanup } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen/HomeScreen';
//import { supabase } from '@/lib/supabase';
import { NavigationContainer } from '@react-navigation/native';
import { PostgrestResponse, PostgrestError } from '@supabase/supabase-js';

import { mockQueryBuilder } from '../../__mocks__/supabaseClient';

global.alert = jest.fn();

jest.mock('@/components/SearchBar', () => {
  const { TextInput } = require('react-native');
  return {
    SearchBar: ({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => (
      <TextInput
        testID="search-bar"
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
      />
    ),
  };
});

jest.mock('@/components/ClubCard', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    ClubCard: ({ club, onPress }: { club: any; onPress: () => void }) => (
      <TouchableOpacity
        testID={`club-card-${club.club_id}`}
        onPress={onPress}
      >
        <Text>{club.name}</Text>
      </TouchableOpacity>
    ),
  };
});


// Update FilterModal mock:
jest.mock('@/components/FilterModal', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    FilterModal: ({ isVisible, onApply }: { isVisible: boolean; onApply: (filters: any) => void }) =>
      isVisible ? (
        <TouchableOpacity
          testID="apply-filters-button"
          onPress={() => onApply({ minRating: 4 })}
        >
          <Text>Apply Filters</Text>
        </TouchableOpacity>
      ) : null,
  };
});

const initialClubs = [
  {
    club_id: '1',
    name: 'Club One',
    rating: 5,
    category: 'Bar',
    music_genre: 'Rock',
    description: 'A great club',
    attendees: 50,
    created_at: '2021-01-01',
    num_reviews: 10,
    address: 'Address One',
    opening_hours: '20:00 - 04:00',
    dress_code: 'Casual',
    image: null,
  },
  {
    club_id: '2',
    name: 'Club Two',
    rating: 4,
    category: 'Lounge',
    music_genre: 'Jazz',
    description: 'Another great club',
    attendees: 30,
    created_at: '2021-01-02',
    num_reviews: 5,
    address: 'Address Two',
    opening_hours: '21:00 - 03:00',
    dress_code: 'Formal',
    image: null,
  },
];

const additionalClubs = [
  {
    club_id: '3',
    name: 'Club Three',
    rating: 4,
    category: 'Pub',
    music_genre: 'Pop',
    description: 'A new club loaded on scroll',
    attendees: 40,
    created_at: '2021-02-01',
    num_reviews: 7,
    address: 'Address Three',
    opening_hours: '19:00 - 02:00',
    dress_code: 'Casual',
    image: null,
  },
];

const refreshedClubs = [
  {
    club_id: '3',
    name: 'Club Three',
    rating: 4,
    category: 'Pub',
    music_genre: 'Pop',
    description: 'A refreshed club',
    attendees: 40,
    created_at: '2021-02-01',
    num_reviews: 7,
    address: 'Address Three',
    opening_hours: '19:00 - 02:00',
    dress_code: 'Casual',
    image: null,
  },
];

const initialClubsForFilter = [
  {
    club_id: '1',
    name: 'Club One',
    rating: 5,
    category: 'Bar',
    music_genre: 'Rock',
    description: 'A great club',
    attendees: 50,
    created_at: '2021-01-01',
    num_reviews: 10,
    address: 'Address One',
    opening_hours: '20:00 - 04:00',
    dress_code: 'Casual',
    image: null,
  },
  {
    club_id: '2',
    name: 'Club Two',
    rating: 3,
    category: 'Lounge',
    music_genre: 'Jazz',
    description: 'Another great club',
    attendees: 30,
    created_at: '2021-01-02',
    num_reviews: 5,
    address: 'Address Two',
    opening_hours: '21:00 - 03:00',
    dress_code: 'Formal',
    image: null,
  },
];

const filteredClubs = [
  {
    club_id: '1',
    name: 'Club One',
    rating: 5,
    category: 'Bar',
    music_genre: 'Rock',
    description: 'A great club',
    attendees: 50,
    created_at: '2021-01-01',
    num_reviews: 10,
    address: 'Address One',
    opening_hours: '20:00 - 04:00',
    dress_code: 'Casual',
    image: null,
  },
];

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});


describe('HomeScreen', () => {

  it('fetches and displays clubs on load', async () => {
    // Simula il fetch riuscito dei club iniziali
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: initialClubs,
      error: null,
      count: initialClubs.length,
      status: 200,
      statusText: 'OK',
    });

    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Attendi che i nomi dei club vengano visualizzati
    await waitFor(() => {
      expect(getByText('Club One')).toBeTruthy();
      expect(getByText('Club Two')).toBeTruthy();
    });
  });

  it('filters clubs based on search input', async () => {
    // Simula il fetch dei club
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: initialClubs,
      error: null,
      count: initialClubs.length,
      status: 200,
      statusText: 'OK',
    });

    const { getByTestId, getByText, queryByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Attendi che entrambi i club vengano visualizzati inizialmente
    await waitFor(() => {
      expect(getByText('Club One')).toBeTruthy();
      expect(getByText('Club Two')).toBeTruthy();
    });

    // Simula la modifica della barra di ricerca per cercare "Club One"
    await act(async () => {
      fireEvent.changeText(getByTestId('search-bar'), 'Club One');
      await new Promise(resolve => setImmediate(resolve));
    });

    // Dopo il filtraggio, verifica che venga visualizzato solo "Club One"
    await waitFor(() => {
      expect(getByText('Club One')).toBeTruthy();
      expect(queryByText('Club Two')).toBeNull();
    });
  });

  it('displays error message when fetching clubs fails', async () => {
    // Simula un errore nel fetch dei club
    const mockError: PostgrestError = { message: 'Fetch failed', name: '', details: '', hint: '', code: '' };
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: null,
      error: mockError,
      count: null,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Attendi che appaia il messaggio di errore
    await waitFor(() => {
      expect(getByText('Failed to fetch clubs. Please try again.')).toBeTruthy();
    });
  });

  it('refreshes data when pulled down', async () => {
    // Simula il fetch iniziale dei club
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: initialClubs,
      error: null,
      count: initialClubs.length,
      status: 200,
      statusText: 'OK',
    });

    // Simula il fetch aggiornato al refresh
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: refreshedClubs,
      error: null,
      count: refreshedClubs.length,
      status: 200,
      statusText: 'OK',
    });

    const { getByTestId, getByText, queryByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Attendi che i club iniziali siano visibili
    await waitFor(() => {
      expect(getByText('Club One')).toBeTruthy();
      expect(getByText('Club Two')).toBeTruthy();
    });

    // Recupera il FlatList tramite il suo testID
    const flatList = getByTestId('flat-list');
    expect(flatList).toBeTruthy();

    // Dal FlatList accediamo alla prop refreshControl
    // Nota: a seconda dell'implementazione, potresti dover esaminare flatList.props
    const refreshControl = flatList.props.refreshControl;
    expect(refreshControl).toBeTruthy();

    // Simula il pull-to-refresh invocando il callback onRefresh
    await act(async () => {
      refreshControl.props.onRefresh();
      // Flush delle Promise pendenti
      await new Promise(resolve => setImmediate(resolve));
    });

    // Dopo il refresh, verifica che i club iniziali non siano più presenti
    // e che venga visualizzato il nuovo club
    await waitFor(() => {
      expect(queryByText('Club One')).toBeNull();
      expect(queryByText('Club Two')).toBeNull();
      expect(getByText('Club Three')).toBeTruthy();
    });

    // Verifica che il metodo range del mock sia stato chiamato due volte:
    // una per il caricamento iniziale e una per il refresh
    expect(mockQueryBuilder.range).toHaveBeenCalledTimes(2);
  });

  it('applies filters correctly', async () => {
    // Simula il fetch iniziale senza filtri
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: initialClubsForFilter,
      error: null,
      count: initialClubsForFilter.length,
      status: 200,
      statusText: 'OK',
    });

    // Simula il fetch successivo dopo l\'applicazione del filtro
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: filteredClubs,
      error: null,
      count: filteredClubs.length,
      status: 200,
      statusText: 'OK',
    });

    const { getByTestId, getByText, queryByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Verifica che inizialmente entrambi i club siano visibili
    await waitFor(() => {
      expect(getByText('Club One')).toBeTruthy();
      expect(getByText('Club Two')).toBeTruthy();
    });

    // Simula la pressione del pulsante per aprire il filtro
    const filterButton = getByTestId('filter-button');
    expect(filterButton).toBeTruthy();
    fireEvent.press(filterButton);

    // A questo punto, il FilterModal dovrebbe essere visibile.
    // Il mock di FilterModal renderizza un pulsante "apply-filters-button".
    const applyFiltersButton = await waitFor(() =>
      getByTestId('apply-filters-button')
    );
    expect(applyFiltersButton).toBeTruthy();

    // Simula la pressione del pulsante per applicare i filtri
    await act(async () => {
      fireEvent.press(applyFiltersButton);
      await new Promise(resolve => setImmediate(resolve));
    });

    // Dopo l'applicazione del filtro, ci aspettiamo che solo Club One venga mostrato
    await waitFor(() => {
      expect(getByText('Club One')).toBeTruthy();
      expect(queryByText('Club Two')).toBeNull();
    });

    // Verifica che il metodo gte sia stato chiamato per impostare il filtro
    // (Il mock chainable dovrebbe aver registrato questa chiamata)
    expect(mockQueryBuilder.gte).toHaveBeenCalledWith('rating', 4);

    // Inoltre, controlliamo che il metodo range sia stato chiamato due volte:
    // - Una per il caricamento iniziale
    // - Una per il refresh con filtri
    expect(mockQueryBuilder.range).toHaveBeenCalledTimes(2);
  });

  it('navigates to club details on club press', async () => {
    // Assicurati che i dati vengano mockati (almeno uno dei club deve avere club_id '1')
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: initialClubs, // initialClubs deve contenere almeno un club con club_id '1'
      error: null,
      count: initialClubs.length,
      status: 200,
      statusText: 'OK',
    });
  
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
  
    // Attendi che il componente venga renderizzato (la Card per club con id '1')
    await waitFor(() => {
      expect(getByTestId('club-card-1')).toBeTruthy();
    });
  
    // Simula il press sulla Card
    await act(async () => {
      fireEvent.press(getByTestId('club-card-1'));
    });
  
    // Verifica che la funzione navigate sia stata chiamata correttamente
    expect(mockedNavigate).toHaveBeenCalledWith('Club', { clubId: '1' });
  });

  it('loads more clubs when scrolling to the bottom', async () => {
  
    // Simula il fetch iniziale dei club.
    // Impostiamo count maggiore del numero di club iniziali per indicare che ci sono altri dati da caricare.
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: initialClubs,
      error: null,
      count: 30, // ad esempio, ci sono 30 club in totale
      status: 200,
      statusText: 'OK',
    });
  
    // Simula il fetch dei club aggiuntivi al momento dello scroll
    mockQueryBuilder.range.mockResolvedValueOnce({
      data: additionalClubs,
      error: null,
      count: 30,
      status: 200,
      statusText: 'OK',
    });
  
    const { getByTestId, getByText, queryByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
  
    // Attendi che i club iniziali siano visibili
    await waitFor(() => {
      expect(getByText('Club One')).toBeTruthy();
      expect(getByText('Club Two')).toBeTruthy();
    });
  
    // Recupera il FlatList tramite il testID "flat-list"
    const flatList = getByTestId('flat-list');
    expect(flatList).toBeTruthy();
  
    // Simula lo scroll: invia un evento scroll con nativeEvent che indica un elevato contentOffset.y
    fireEvent.scroll(flatList, {
      nativeEvent: {
        contentOffset: { y: 500 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 100, width: 100 },
      },
    });
  
    // Attendi che i club aggiuntivi vengano caricati: in questo caso, verifichiamo che "Club Three" venga visualizzato
    await waitFor(() => {
      expect(getByText('Club Three')).toBeTruthy();
      // Assicuriamoci che i club iniziali non vengano duplicati, se necessario:
      // expect(queryByText('Club One')).toBeTruthy();
      // expect(queryByText('Club Two')).toBeTruthy();
    });
  
    // Verifica che il metodo range sia stato chiamato due volte:
    // - Una per il caricamento iniziale
    // - Una per il caricamento aggiuntivo durante lo scroll
    expect(mockQueryBuilder.range).toHaveBeenCalledTimes(2);
  });
  
  


});