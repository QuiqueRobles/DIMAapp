import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ClubHeaderProps {
  club: {
    name: string;
    rating: number;
    num_reviews: number;
    category: string | null;
    music_genre: string | null;
  };
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ club }) => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <LinearGradient
          colors={['rgba(76, 43, 176, 0.97)', 'rgba(131, 27, 191, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.nameGradient}
        />
        <Text style={styles.name}>{club.name}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Feather name="star" size={18} color="#FFD700" />
        <Text style={styles.rating}>{club.rating.toFixed(1)}</Text>
        <Text style={styles.reviews}>({club.num_reviews} reviews)</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  nameContainer: {
    position: 'relative',
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    padding: 10,
  },
  nameGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagPurple: {
    backgroundColor: 'rgba(167, 139, 250, 0.3)',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ClubHeader;
