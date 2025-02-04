import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import ReviewItem from '@/components/ReviewItem';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

type RootStackParamList = {
  Reviews: { clubId: string; clubName: string };
};

type ReviewsScreenRouteProp = RouteProp<RootStackParamList, 'Reviews'>;
type ReviewsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Reviews'>;

interface Review {
  id: string;
  created_at: string;
  user_id: string;
  club_id: string;
  text: string | null;
  num_stars: number;
}

const ReviewsScreen: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<ReviewsScreenNavigationProp>();
  const route = useRoute<ReviewsScreenRouteProp>();
  const { clubId, clubName } = route.params;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: reviewsError } = await supabase
        .from('review')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw new Error('Failed to fetch reviews');
      setReviews(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [clubId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReviews();
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} testID='back-button 'style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text testID='title'style={styles.headerTitle}>{clubName} Reviews</Text>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewItem review={item} testId='review-item'/>}
        contentContainerStyle={styles.reviewsList}
        refreshControl={
          <RefreshControl testID='refresh-control'refreshing={refreshing} onRefresh={handleRefresh} tintColor="#A78BFA" />
        }
        ListEmptyComponent={
          <Text style={styles.noReviewsText}>No reviews yet</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviewsList: {
    padding: 16,
  },
  noReviewsText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default ReviewsScreen;