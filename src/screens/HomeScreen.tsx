import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { SearchBar } from './components/SearchBar';
import { ActionButtons } from './components/ActionButtons';
import { ClubCard } from './components/ClubCard';

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

const ITEMS_PER_PAGE = 10;

const HomeScreen: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchClubs = useCallback(async (pageToFetch: number = 0, shouldRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error, count } = await supabase
        .from('club')
        .select('*', { count: 'exact' })
        .order('rating', { ascending: false })
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
  }, []);

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
        <ActivityIndicator size="large" color="#8856a3" />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#8856a3', '#000000']}
      style={styles.gradient}
      locations={[0, 0.3]}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <ActionButtons
          onFilterPress={() => console.log('Filter pressed')}
          onMapPress={() => console.log('Map pressed')}
          onSortPress={() => console.log('Sort pressed')}
        />

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
                onPress={() => console.log(`Selected club: ${item.name}`)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#8856a3" />
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

