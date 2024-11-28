import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {supabase} from '@/lib/supabase'

interface Club {
  id: string;
  name: string;
  rating: number;
  attendees: number;
  image: string;
  price: number;
  category: string;
}

const ClubCard: React.FC<{ club: Club; onPress: () => void }> = ({ club, onPress }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} className="mb-6">
      <View className="relative">
        <Image
          source={{ uri: imageError ? 'https://via.placeholder.com/400x200?text=No+Image' : club.image }}
          style={{ width: '100%', height: 200 }}
          className="rounded-xl"
          onError={() => setImageError(true)}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          className="absolute bottom-0 left-0 right-0 h-24 rounded-b-xl"
        />
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text className="text-white text-xl font-bold">{club.name}</Text>
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center">
              <Feather name="star" size={16} color="#FFD700" />
              <Text className="text-yellow-400 ml-1">{club.rating}</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="users" size={16} color="#A78BFA" />
              <Text className="text-purple-400 ml-1">{club.attendees}</Text>
            </View>
            <Text className="text-green-400 font-semibold">€{club.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryButton: React.FC<{ category: string; isSelected: boolean; onPress: () => void }> = ({ category, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-2 ${isSelected ? 'bg-purple-600' : 'bg-gray-800'}`}
  >
    <Text className={`${isSelected ? 'text-white' : 'text-gray-400'} font-semibold`}>{category}</Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
   const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data, error } = await supabase
          .from('clubs')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          setClubs(data as Club[]);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const categories = ['All', ...Array.from(new Set(clubs.map(club => club.category)))];

  const filteredClubs = selectedCategory && selectedCategory !== 'All'
    ? clubs.filter(club => club.category === selectedCategory)
    : clubs;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <View className="px-6 pt-6 pb-4">
        <Text className="text-white text-3xl font-bold">PartyMilano</Text>
        <Text className="text-gray-400 text-lg">Discover Milan's Hottest Clubs</Text>
      </View>
      <View className="px-6 mb-4">
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryButton
              category={item}
              isSelected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <FlatList
        data={filteredClubs}
        renderItem={({ item }) => (
          <ClubCard
            club={item}
            onPress={() => console.log(`Pressed ${item.name}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;