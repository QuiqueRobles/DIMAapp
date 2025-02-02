import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';

interface Review {
  id: string;
  created_at: string;
  user_id: string;
  club_id: string;
  text: string | null;
  num_stars: number;
  user_name: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Feather
          key={i}
          name={i < review.num_stars ? 'star' : 'star'}
          size={16}
          color={i < review.num_stars ? '#FFD700' : '#4B5563'}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {review.user_id.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameAndDate}>
            <Text style={styles.userName}>{review.user_name || 'Anonymous'}</Text>
            <Text style={styles.reviewDate}>
              {format(new Date(review.created_at), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>
        <View style={styles.starRating}>{renderStars()}</View>
      </View>
      <Text style={styles.reviewText}>{review.text || 'No comment'}</Text>
    </View>
  );
};

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  return (
    // <FlatList
    //   data={reviews}
    //   renderItem={({ item }) => <ReviewItem review={item} />}
    //   keyExtractor={(item) => item.id}
    //   contentContainerStyle={styles.container}
    // />
    <View style={styles.container}>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  reviewItem: {
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameAndDate: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  starRating: {
    flexDirection: 'row',
  },
  star: {
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
});

export default ReviewsList;

