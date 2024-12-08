import React from 'react';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';

interface CountryPickerWrapperProps {
  withFlag?: boolean;
  withFilter?: boolean;
  withCountryNameButton?: boolean;
  withAlphaFilter?: boolean;
  withCallingCode?: boolean;
  withEmoji?: boolean;
  onSelect: (country: Country) => void;
  countryCode?: CountryCode;
}

const CountryPickerWrapper: React.FC<CountryPickerWrapperProps> = ({
  withFlag = true,
  withFilter = true,
  withCountryNameButton = true,
  withAlphaFilter = true,
  withCallingCode = true,
  withEmoji = true,
  onSelect,
  countryCode = 'US',
}) => {
  return (
    <CountryPicker
      withFlag={withFlag}
      withFilter={withFilter}
      withCountryNameButton={withCountryNameButton}
      withAlphaFilter={withAlphaFilter}
      withCallingCode={withCallingCode}
      withEmoji={withEmoji}
      onSelect={onSelect}
      countryCode={countryCode}
    />
  );
};

export default CountryPickerWrapper;