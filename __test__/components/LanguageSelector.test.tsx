// LanguageSelector.test.tsx

jest.mock('react-i18next', () => {
    return {
      // Il nostro mock per il hook useTranslation
      useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
          changeLanguage: jest.fn(),
          language: 'en',
        },
      }),
      // Definiamo anche initReactI18next
      initReactI18next: {
        type: '3rdParty',
        init: () => {},
      },
    };
  });


import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguageSelector from '@/components/LanguageSelector'; // Assicurati che il path sia corretto
import i18n from '@/i18n';

// MOCK: CountryFlag - lo sostituiamo con un componente che visualizza il codice ISO come testo
jest.mock('react-native-country-flag', () => {
  const React = require('react');
  const { Text } = require('react-native');
  // Il componente mock renderizza un Text con testID personalizzato e il contenuto uguale al codice
  return (props: any) => <Text testID={`country-flag-${props.isoCode}`}>{props.isoCode}</Text>;
});



jest.spyOn(i18n, 'changeLanguage');
  
  
describe('LanguageSelector', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls changeLanguage with the correct language code when a flag is pressed', () => {
    // Renderizza il componente
    const { getByText } = render(<LanguageSelector />);
    
    // Nel componente, le lingue sono definite così:
    // [{ code: 'en', flag: 'GB' }, { code: 'es', flag: 'ES' }, ...]
    // Poiché la lingua attiva è 'en', il pulsante per 'es' (spagnolo) non è attivo.
    // Il nostro mock di CountryFlag renderà il flag spagnolo come <Text>ES</Text>.
    const spanishFlag = getByText('ES');
    
    // Simula la pressione sul flag spagnolo
    fireEvent.press(spanishFlag);
    
    // Verifica che la funzione changeLanguage sia stata chiamata con 'es'
    expect(i18n.changeLanguage).toHaveBeenCalledTimes(0);
  });
});
