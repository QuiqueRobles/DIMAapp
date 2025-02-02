import React, { useState,useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Club {
  club_id: string;
  name: string;
  rating: number;
  num_reviews: number;
  address: string;
  image: string | null;
  category: string | null;
  music_genre?: string | null;
  attendees: number;
  opening_hours: string;
  
}

interface ClubCardProps {
  club: Club;
  onPress: () => void;
  distance?: string;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onPress, distance }) => {
  const [imageError, setImageError] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getOpenStatus(); // Call function when component mounts or when club.opening_hours changes
  }, [club.opening_hours]);

  const getOpenStatus = () => {
    if (!club.opening_hours) return;
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
  
      // Define opening and closing hours (24-hour format)
      const  [openingTime,closingTime]=club.opening_hours.split("-").map(String)
    if( !openingTime || !closingTime)return;
      // Convert opening & closing time to minutes for comparison
      const [openHour, openMinutes] = openingTime.split(":").map(Number);
      const [closeHour, closeMinutes] = closingTime.split(":").map(Number);
  
      const currentTotalMinutes = currentHour * 60 + currentMinutes;
      const openingTotalMinutes = openHour * 60 + openMinutes;
      const closingTotalMinutes = closeHour * 60 + closeMinutes;
      if (currentTotalMinutes >= openingTotalMinutes && currentTotalMinutes < closingTotalMinutes) {
        setStatus("Open");
      } else {
        setStatus("Closed");
      }
    // This is a placeholder. In a real app, you'd compare current time with opening_hours
    return;
    
  };

    //const openStatus = getOpenStatus();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9} testID="club-card">
      <View style={styles.card}>
        <Image
          source={{ 
            uri: imageError 
              ? 'https://via.placeholder.com/400x200?text=No+Image' 
              : club.image ?? 'https://via.placeholder.com/400x200?text=No+Image'
          }}
          style={styles.image}
          onError={() => setImageError(true)}
          testID="club-image"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{club.name}</Text>
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{club.rating.toFixed(1)}</Text>
                  <Text style={styles.reviews}>({club.num_reviews})</Text>
                </View>
              </View>
              {distance && (
                <View style={styles.distanceContainer}>
                  <Feather name="map-pin" size={14} color="#9CA3AF" />
                  <Text style={styles.distance}>{distance}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Feather name="users" size={14} color="#9CA3AF" />
                <Text style={styles.infoText}>{club.attendees} attending</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="clock" size={14} color="#9CA3AF" />
                <Text style={[styles.infoText, status === 'Open' ? styles.openText : styles.closedText]}>
                  {status}
                </Text>
              </View>
            </View>

            <View style={styles.tagsContainer}>
              {club.category && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{club.category}</Text>
                </View>
              )}
              {club.music_genre && (
                <View style={[styles.tag, styles.tagPurple]}>
                  <Text style={styles.tagText}>{club.music_genre}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  image: {
    width: width - 40,
    height: 200,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%', // Increased from 60% to 70%
    padding: 15,
    justifyContent: 'flex-end',
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 22, // Reduced from 24 to 22
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  reviews: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  openText: {
    color: '#10B981',
  },
  closedText: {
    color: '#EF4444',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(137, 18, 255, 0.61)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tagPurple: {
    backgroundColor: 'rgba(255, 230, 0, 0.51)',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
