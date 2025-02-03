

  import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, ActivityIndicator, Animated, PanResponder, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Club {
  club_id: string;
  name: string;
  rating: number;
  attendees: number;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  image: string;
  description: string;
  opening_hours: string;
  dress_code: string;
  music_genre: string;
}

type RootStackParamList = {
  Club: { clubId: string };
};

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Club'>;

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 200;

const CustomMarker: React.FC<{ club: Club; onPress: (club: Club) => void; isSelected: boolean }> = ({ club, onPress, isSelected }) => (
  <Marker
    coordinate={{ latitude: club.latitude, longitude: club.longitude }}
    onPress={() => onPress(club)}
    testID='marker'
  >
    <View style={styles.markerContainer}>
      <View style={[styles.marker, isSelected && styles.selectedMarker]}>
        <Feather name="map-pin" size={18} color={isSelected ? "#FFFFFF" : "#6D28D9"} />
      </View>
    </View>
    {isSelected && (
      <Callout tooltip>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutText}>{club.name}</Text>
        </View>
      </Callout>
    )}
  </Marker>
);

const ClubCard: React.FC<{ 
  club: Club; 
  onViewDetails: () => void; 
  onClose: () => void;
  panResponder: any;
  translateY: Animated.Value;
}> = ({ club, onViewDetails, onClose, panResponder, translateY }) => (
  <Animated.View 
    style={[
      styles.cardContainer, 
      { transform: [{ translateY }] }
    ]}
    {...panResponder.panHandlers}
  >
    <TouchableOpacity style={styles.closeButton} onPress={onClose} testID='close-button'>
      <Feather name="x" size={24} color="#6D28D9" />
    </TouchableOpacity>
    <View style={styles.cardContent}>
      <Image source={{ uri: club.image }} style={styles.clubImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{club.name}</Text>
        <Text style={styles.cardCategory}>{club.category}</Text>
        <View style={styles.cardDetails}>
          <View style={styles.cardRow}>
            <Feather name="star" size={16} color="#FFD700" />
            <Text style={styles.cardText}>{club.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Feather name="users" size={16} color="#A78BFA" />
            <Text style={styles.cardText}>{club.attendees}</Text>
          </View>
          <View style={styles.cardRow}>
            <Feather name="music" size={16} color="#10B981" />
            <Text style={styles.cardText}>{club.music_genre}</Text>
          </View>
        </View>
        <Text style={styles.cardAddress} numberOfLines={1}>{club.address}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.viewDetailsButton} onPress={onViewDetails} testID='view-details-button'>
      <Text style={styles.viewDetailsButtonText}>View Details</Text>
    </TouchableOpacity>
  </Animated.View>
);

const MapOwner:React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const translateY = useRef(new Animated.Value(CARD_HEIGHT)).current;

  const navigation = useNavigation<MapScreenNavigationProp>();

  useEffect(() => {
    fetchClubs();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        closeCard();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

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
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: club.latitude - 0.004,
        longitude: club.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleViewDetails = () => {
    if (selectedClub) {
      console.log('Navigating to club:', selectedClub.club_id);
      navigation.navigate('Club', { clubId: selectedClub.club_id });
    }
  };

  const closeCard = () => {
    Animated.timing(translateY, {
      toValue: CARD_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedClub(null));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D28D9" />
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
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: clubs[0]?.latitude || 0,
          longitude: clubs[0]?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {clubs.map((club) => (
          <CustomMarker 
            key={club.club_id} 
            club={club} 
            onPress={handleClubPress}
            isSelected={selectedClub?.club_id === club.club_id}
          />
        ))}
      </MapView>
      {selectedClub && (
        <ClubCard
          club={selectedClub}
          onViewDetails={handleViewDetails}
          onClose={closeCard}
          panResponder={panResponder}
          translateY={translateY}
        />
      )}
    </View>
  );
};

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
  selectedMarker: {
    backgroundColor: '#6D28D9',
    borderColor: '#F3E8FF',
  },
  calloutContainer: {
    backgroundColor: '#151515',
    borderRadius: 6,
    padding: 6,
    maxWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    backgroundColor: '#151515',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
  },
  clubImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4B5563',
  },
  cardAddress: {
    fontSize: 12,
    color: '#4B5563',
  },
  viewDetailsButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 14,
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

export default MapOwner