import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Club {
  id: string;
  name: string;
  rating: number;
  attendees: number;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
}

type RootStackParamList = {
  Club: { clubId: string };
};

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Club'>;

const { width, height } = Dimensions.get('window');

const CustomMarker: React.FC<{ club: Club; onPress: (club: Club) => void }> = ({ club, onPress }) => (
  <Marker
    coordinate={{ latitude: club.latitude, longitude: club.longitude }}
    title={club.name}
    onPress={() => onPress(club)}
  >
    <View style={styles.markerContainer}>
      <View style={styles.marker}>
        <Feather name="map-pin" size={18} color="#6D28D9" />
      </View>
    </View>
    <Callout tooltip>
      <TouchableOpacity onPress={() => onPress(club)}>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitle}>{club.name}</Text>
          <View style={styles.calloutDetails}>
            <View style={styles.calloutRow}>
              <Feather name="star" size={16} color="#FFD700" />
              <Text style={styles.calloutText}>{club.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.calloutRow}>
              <Feather name="users" size={16} color="#A78BFA" />
              <Text style={styles.calloutText}>{club.attendees}</Text>
            </View>
          </View>
          <Text style={styles.calloutCategory}>{club.category}</Text>
        </View>
      </TouchableOpacity>
    </Callout>
  </Marker>
);

const MapScreen: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<MapScreenNavigationProp>();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('club')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      const clubsWithCoordinates = data
        .filter((club: any) => club.latitude && club.longitude)
        .map((club: any) => ({
          ...club,
          latitude: parseFloat(club.latitude),
          longitude: parseFloat(club.longitude),
        }));

      setClubs(clubsWithCoordinates);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setError('Failed to fetch clubs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClubPress = (club: Club) => {
    setSelectedClub(club);
    navigation.navigate('Club', { clubId: club.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading clubs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: clubs[0]?.latitude || 0,
          longitude: clubs[0]?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={() => setSelectedClub(null)}
      >
        {clubs.map((club) => (
          <CustomMarker key={club.id} club={club} onPress={handleClubPress} />
        ))}
      </MapView>
      {selectedClub && (
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>{selectedClub.name}</Text>
          <Text style={styles.bottomSheetCategory}>{selectedClub.category}</Text>
          <View style={styles.bottomSheetDetails}>
            <View style={styles.bottomSheetRow}>
              <Feather name="star" size={18} color="#FFD700" />
              <Text style={styles.bottomSheetText}>{selectedClub.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.bottomSheetRow}>
              <Feather name="users" size={18} color="#A78BFA" />
              <Text style={styles.bottomSheetText}>{selectedClub.attendees}</Text>
            </View>
          </View>
          <Text style={styles.bottomSheetAddress}>{selectedClub.address}</Text>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={() => handleClubPress(selectedClub)}
          >
            <Text style={styles.bottomSheetButtonText}>View Details</Text>
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
  bottomSheetAddress: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;

