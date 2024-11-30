import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  const renderReview = ({ item }: { item: Review }) => (
    <View className="bg-gray-800 p-4 rounded-lg mb-2">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-semibold">{item.user_name}</Text>
        <View className="flex-row items-center">
          <Feather name="star" size={16} color="#FFD700" />
          <Text className="text-white ml-1">{item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text className="text-gray-300 mb-1">{item.comment}</Text>
      <Text className="text-gray-400 text-xs">{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <FlatList
      data={reviews}
      renderItem={renderReview}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text className="text-gray-400 text-center">No reviews yet</Text>
      }
    />
  );
};

export default ReviewsList;

