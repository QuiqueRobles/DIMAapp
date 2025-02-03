import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

interface Filters {
  category: string | null;
  musicGenre: string | null;
  minRating: number;
  dressCode: string | null;
  minAttendees: number;
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Filter Clubs</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FilterSection label="Category">
              <Picker
                selectedValue={filters.category || ''}
                onValueChange={(itemValue: string | null) =>
                  setFilters({ ...filters, category: itemValue === '' ? null : itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="All Categories" value="" />
                <Picker.Item label="Nightclub" value="Nightclub" />
                <Picker.Item label="Bar" value="Bar" />
                <Picker.Item label="Lounge" value="Lounge" />
              </Picker>
            </FilterSection>

            <FilterSection label="Music Genre">
              <Picker
                selectedValue={filters.musicGenre || ''}
                onValueChange={(itemValue: string | null) =>
                  setFilters({ ...filters, musicGenre: itemValue === '' ? null : itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="All Genres" value="" />
                <Picker.Item label="Electronic" value="Electronic" />
                <Picker.Item label="Hip Hop" value="Hip Hop" />
                <Picker.Item label="Rock" value="Rock" />
                <Picker.Item label="Latin" value="Latin" />
              </Picker>
            </FilterSection>

            <FilterSection label="Minimum Rating">
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={5}
                step={0.5}
                value={filters.minRating}
                onValueChange={(value: number) =>
                  setFilters({ ...filters, minRating: value })
                }
                minimumTrackTintColor="#4F46E5"
                maximumTrackTintColor="#D1D5DB"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderValue}>0</Text>
                <Text style={styles.sliderValue}>{filters.minRating.toFixed(1)}</Text>
                <Text style={styles.sliderValue}>5</Text>
              </View>
            </FilterSection>

            <FilterSection label="Dress Code">
              <Picker
                selectedValue={filters.dressCode || ''}
                onValueChange={(itemValue: string | null) =>
                  setFilters({ ...filters, dressCode: itemValue === '' ? null : itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Any" value="" />
                <Picker.Item label="Casual" value="Casual" />
                <Picker.Item label="Smart Casual" value="Smart Casual" />
                <Picker.Item label="Formal" value="Formal" />
              </Picker>
            </FilterSection>

            <FilterSection label="Minimum Attendees">
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000}
                step={50}
                value={filters.minAttendees}
                onValueChange={(value: number) =>
                  setFilters({ ...filters, minAttendees: value })
                }
                minimumTrackTintColor="#4F46E5"
                maximumTrackTintColor="#D1D5DB"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderValue}>0</Text>
                <Text style={styles.sliderValue}>{filters.minAttendees}</Text>
                <Text style={styles.sliderValue}>1000+</Text>
              </View>
            </FilterSection>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
              <Text style={[styles.buttonText, styles.applyButtonText]}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FilterSection: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={styles.filterSection}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 0, 11, 0.25)',
  },
  modalView: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  filterSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CD9FF5',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#222222',
    color: '#FFFFFF',
    borderRadius: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    color:'#B673EF',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    color:'#B673EF',
  },
  sliderValue: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#4F46E5',
    marginLeft: 10,
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
});

