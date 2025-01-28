import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ActionButtonsProps {
  onFilterPress: () => void;
  onMapPress: () => void;
  onSortPress: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFilterPress,
  onMapPress,
  onSortPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onFilterPress}>
        <Feather name="filter" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onMapPress}>
        <Feather name="map" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSortPress}>
        <Feather name="arrow-down" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  button: {
    width: 45,
    height: 45,
    backgroundColor: '#374151',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

