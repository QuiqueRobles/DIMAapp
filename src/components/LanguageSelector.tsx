import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import CountryFlag from 'react-native-country-flag';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
    
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', flag: 'GB' }, // English (United States)
    { code: 'es', flag: 'ES' }, // Spanish (Spain)
    { code: 'it', flag: 'IT' }, // Italian (Italy)
    { code: 'fr', flag: 'FR' }, // French (France)
    { code: 'de', flag: 'DE' }, // German (Germany)
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.selectLanguage')}</Text>
      <View style={styles.flagsContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.flagButton, i18n.language === lang.code && styles.activeFlagButton]}
            onPress={() => changeLanguage(lang.code)}
          >
            <CountryFlag isoCode={lang.flag} size={25} style={styles.flag} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  flagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  flagButton: {
    margin: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  activeFlagButton: {
    backgroundColor: '#7C3AED',
  },
  flag: {
    borderRadius: 4,
  },
});

export default LanguageSelector;