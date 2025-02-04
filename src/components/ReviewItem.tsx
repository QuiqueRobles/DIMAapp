import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

interface ReviewItemProps {
  review: {
    created_at: string;
    text: string | null;
    num_stars: number;
  };
  testId:'review-item'
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <Feather
              key={index}
              name={index < review.num_stars ? 'star' : 'star'}
              size={16}
              color={index < review.num_stars ? '#FFD700' : '#4B5563'}
            />
          ))}
        </View>
        <Text style={styles.date}>
          {format(new Date(review.created_at), 'MMM d, yyyy')}
        </Text>
      </View>
      {review.text && <Text style={styles.reviewText}>{review.text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  date: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  reviewText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ReviewItem;

