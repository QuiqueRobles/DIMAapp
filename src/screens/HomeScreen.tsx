import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { SearchBar } from './components/SearchBar';
import { ClubCard } from './components/ClubCard';
import { FilterModal } from './components/FilterModal';

type RootStackParamList = {
  Home: undefined;
  Club: { clubId: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Club {
  id: string;
  name: string;
  attendees: number;
  created_at: string;
  rating: number;
  num_reviews: number;
  address: string;
  opening_hours: string;
  dress_code: string | null;
  music_genre: string | null;
  image: string | null;
  category: string | null;
  description: string | null;
}

interface Filters {
  category: string | null;
  musicGenre: string | null;
  minRating: number;
  dressCode: string | null;
  minAttendees: number;
}

const ITEMS_PER_PAGE = 20;

const HomeScreen: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: null,
    musicGenre: null,
    minRating: 0,
    dressCode: null,
    minAttendees: 0,
  });
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleClubPress = (clubId: string) => {
    navigation.navigate('Club', { clubId });
  };

  const fetchClubs = useCallback(async (pageToFetch: number = 0, shouldRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('club')
        .select('*', { count: 'exact' })
        .order('rating', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.musicGenre) {
        query = query.eq('music_genre', filters.musicGenre);
      }
      if (filters.minRating > 0) {
        query = query.gte('rating', filters.minRating);
      }
      if (filters.dressCode) {
        query = query.eq('dress_code', filters.dressCode);
      }
      if (filters.minAttendees > 0) {
        query = query.gte('attendees', filters.minAttendees);
      }

      const { data, error, count } = await query
        .range(pageToFetch * ITEMS_PER_PAGE, (pageToFetch + 1) * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      if (data) {
        setClubs(prevClubs => shouldRefresh ? data : [...prevClubs, ...data]);
        setHasMore(count !== null && (pageToFetch + 1) * ITEMS_PER_PAGE < count);
        setPage(pageToFetch);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setError('Failed to fetch clubs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClubs(0, true);
  }, [fetchClubs]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchClubs(page + 1);
    }
  }, [loading, hasMore, page, fetchClubs]);

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterApply = (newFilters: Filters) => {
    setFilters(newFilters);
    setIsFilterModalVisible(false);
    fetchClubs(0, true);
  };

  const filteredClubs = clubs.filter(club => {
    const query = searchQuery.toLowerCase();
    return (
      (club.name?.toLowerCase() ?? '').includes(query) ||
      (club.category?.toLowerCase() ?? '').includes(query) ||
      (club.music_genre?.toLowerCase() ?? '').includes(query) ||
      (club.description?.toLowerCase() ?? '').includes(query)
    );
  });

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#4F46E5', '#000000']}
      style={styles.gradient}
      locations={[0, 0.3]}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.header}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <Feather name="filter" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredClubs}
            renderItem={({ item }) => (
              <ClubCard
                club={item}
                onPress={() => handleClubPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No clubs found</Text>
              </View>
            }
          />
        )}

        <FilterModal
          isVisible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onApply={handleFilterApply}
          initialFilters={filters}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  listContainer: {
    padding: 20,
  },
  footerLoader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;

