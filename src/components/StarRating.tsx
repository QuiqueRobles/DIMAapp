import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          style={styles.starContainer}
        >
          <Feather
            name={star <= rating ? 'star' : 'star'}
            size={30}
            color={star <= rating ? '#FFD700' : '#4B5563'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starContainer: {
    padding: 5,
  },
});

export default StarRating;

