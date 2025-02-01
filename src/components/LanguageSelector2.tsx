import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { useTranslation } from 'react-i18next';

const LanguageSelector2: React.FC = () => {
  const { i18n } = useTranslation();
  const [showFlags, setShowFlags] = useState(false);

  const languages = [
    { code: 'en', flag: 'GB' }, // English (United Kingdom)
    { code: 'es', flag: 'ES' }, // Spanish (Spain)
    { code: 'it', flag: 'IT' }, // Italian (Italy)
    { code: 'fr', flag: 'FR' }, // French (France)
    { code: 'de', flag: 'DE' }, // German (Germany)
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowFlags(false); // Hide flags after selection
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowFlags(!showFlags)} style={styles.flagButton}>
        <CountryFlag isoCode={currentLanguage.flag} size={20} style={styles.flag} />
      </TouchableOpacity>

      {showFlags && (
        <View style={styles.flagsContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
              style={styles.flagButton}
            >
              <CountryFlag isoCode={lang.flag} size={20} style={styles.flag} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  flagButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  flagsContainer: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  flag: {
    borderRadius: 4,
  },
});

export default LanguageSelector2;