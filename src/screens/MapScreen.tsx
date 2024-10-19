import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

interface Club {
  id: string;
  name: string;
  rating: number;
  attendees: number;
  price: number;
  category: string;
  latitude: number;
  longitude: number;
}

const clubs: Club[] = [
  {
    id: '1',
    name: 'Armani Privé',
    rating: 4.8,
    attendees: 250,
    price: 30,
    category: 'Luxury',
    latitude: 45.4668,
    longitude: 9.1905,
  },
  {
    id: '2',
    name: 'Just Cavalli',
    rating: 4.6,
    attendees: 200,
    price: 25,
    category: 'Fashion',
    latitude: 45.4715,
    longitude: 9.1765,
  },
  {
    id: '3',
    name: 'Hollywood',
    rating: 4.5,
    attendees: 180,
    price: 20,
    category: 'Nightclub',
    latitude: 45.4642,
    longitude: 9.1900,
  },
  {
    id: '4',
    name: 'Loolapaloosa',
    rating: 4.3,
    attendees: 220,
    price: 15,
    category: 'Dance',
    latitude: 45.4819,
    longitude: 9.2058,
  },
  {
    id: '5',
    name: 'Volt Club',
    rating: 4.7,
    attendees: 190,
    price: 22,
    category: 'Electronic',
    latitude: 45.4785,
    longitude: 9.1896,
  },
];

const { width, height } = Dimensions.get('window');

const CustomMarker: React.FC<{ club: Club }> = ({ club }) => (
  <Marker
    coordinate={{ latitude: club.latitude, longitude: club.longitude }}
    title={club.name}
  >
    <View style={styles.markerContainer}>
      <View style={styles.marker}>
        <Feather name="map-pin" size={18} color="#6D28D9" />
      </View>
    </View>
    <Callout tooltip>
      <View style={styles.calloutContainer}>
        <Text style={styles.calloutTitle}>{club.name}</Text>
        <View style={styles.calloutDetails}>
          <View style={styles.calloutRow}>
            <Feather name="star" size={16} color="#FFD700" />
            <Text style={styles.calloutText}>{club.rating}</Text>
          </View>
          <View style={styles.calloutRow}>
            <Feather name="users" size={16} color="#A78BFA" />
            <Text style={styles.calloutText}>{club.attendees}</Text>
          </View>
          <View style={styles.calloutRow}>
            <Feather name="tag" size={16} color="#10B981" />
            <Text style={styles.calloutText}>€{club.price}</Text>
          </View>
        </View>
        <Text style={styles.calloutCategory}>{club.category}</Text>
      </View>
    </Callout>
  </Marker>
);

const MapScreen: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.4642,
          longitude: 9.1900,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={() => setSelectedClub(null)}
      >
        {clubs.map((club) => (
          <CustomMarker key={club.id} club={club} />
        ))}
      </MapView>
      {selectedClub && (
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>{selectedClub.name}</Text>
          <Text style={styles.bottomSheetCategory}>{selectedClub.category}</Text>
          <View style={styles.bottomSheetDetails}>
            <View style={styles.bottomSheetRow}>
              <Feather name="star" size={18} color="#FFD700" />
              <Text style={styles.bottomSheetText}>{selectedClub.rating}</Text>
            </View>
            <View style={styles.bottomSheetRow}>
              <Feather name="users" size={18} color="#A78BFA" />
              <Text style={styles.bottomSheetText}>{selectedClub.attendees}</Text>
            </View>
            <View style={styles.bottomSheetRow}>
              <Feather name="tag" size={18} color="#10B981" />
              <Text style={styles.bottomSheetText}>€{selectedClub.price}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={() => console.log(`Book ${selectedClub.name}`)}
          >
            <Text style={styles.bottomSheetButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: height,
  },
  markerContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    padding: 8,
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#6D28D9',
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  calloutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calloutText: {
    marginLeft: 4,
    fontSize: 14,
  },
  calloutCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bottomSheetCategory: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  bottomSheetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bottomSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSheetText: {
    marginLeft: 6,
    fontSize: 16,
  },
  bottomSheetButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;