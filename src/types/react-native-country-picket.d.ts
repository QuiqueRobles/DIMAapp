// src/types/react-native-country-picker.d.ts
declare module 'react-native-country-picker' {
    import { ComponentType } from 'react';
  
    export interface Country {
      cca2: string;
      name: string;
      callingCode: string;
      flag: string;
    }
  
    export interface CountryPickerProps {
      countryCode: string;
      withFilter?: boolean;
      withFlag?: boolean;
      withCountryNameButton?: boolean;
      withAlphaFilter?: boolean;
      withCallingCode?: boolean;
      withEmoji?: boolean;
      onSelect: (country: Country) => void;
      containerButtonStyle?: object;
    }
  
    const CountryPicker: ComponentType<CountryPickerProps>;
  
    export default CountryPicker;
  }