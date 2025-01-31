import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear }) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#9CA3AF" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search clubs..."
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton} testID="clear-button">
          <Feather name="x" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
});

