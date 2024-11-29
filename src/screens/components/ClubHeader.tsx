import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ClubHeaderProps {
  club: {
    name: string;
    rating: number;
    num_reviews: number;
    category: string | null;
  };
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ club }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{club.name}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={18} color="#FFD700" />
          <Text style={styles.rating}>{club.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({club.num_reviews} reviews)</Text>
        </View>
        {club.category && (
          <View style={styles.categoryContainer}>
            <Feather name="tag" size={16} color="#A78BFA" />
            <Text style={styles.category}>{club.category}</Text>
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
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  category: {
    fontSize: 14,
    color: '#A78BFA',
    marginLeft: 4,
  },
});

export default ClubHeader;

