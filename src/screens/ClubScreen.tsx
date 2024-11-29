import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, RefreshControl, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import ClubHeader from './components/ClubHeader';
import ClubDetails from './components/ClubDetails';
import EventsList from './components/EventsList';
import ReviewsList from './components/ReviewsList';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  Club: { clubId: string };
  Events: { clubId: string };
  Reviews: { clubId: string };
};

type ClubScreenRouteProp = RouteProp<RootStackParamList, 'Club'>;
type ClubScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Club'>;

interface Club {
  id: string;
  name: string;
  rating: number;
  num_reviews: number;
  address: string;
  image: string | null;
  category: string | null;
  music_genre?: string | null;
  attendees: number;
  opening_hours: string;
  dress_code: string | null;
  description: string | null;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ClubScreen: React.FC = () => {
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<ClubScreenNavigationProp>();
  const route = useRoute<ClubScreenRouteProp>();
  const { clubId } = route.params;

  const fetchClubData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: clubData, error: clubError } = await supabase
        .from('club')
        .select('*')
        .eq('id', clubId)
        .single();

      if (clubError) throw new Error('Failed to fetch club data');
      setClub(clubData);

      const { data: eventsData, error: eventsError } = await supabase
        .from('event')
        .select('*')
        .eq('club_id', clubId)
        .order('date', { ascending: true })
        .limit(3);

      if (eventsError) throw new Error('Failed to fetch events');
      setEvents(eventsData);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('review')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (reviewsError) throw new Error('Failed to fetch reviews');
      setReviews(reviewsData);

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
    fetchClubData();
  }, [clubId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClubData();
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!club) {
    return <ErrorDisplay message="Club not found" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: club.image || 'https://via.placeholder.com/400x200?text=No+Image' }}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={['rgba(31, 41, 55, 0)', 'rgba(31, 41, 55, 1)']}
        style={styles.gradient}
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#A78BFA" />
        }
      >
        <View style={styles.content}>
          <ClubHeader club={club} />
          <ClubDetails club={club} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Events', { clubId })}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <EventsList events={events} />
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Reviews', { clubId })}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ReviewsList reviews={reviews} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: height * 0.4,
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.4,
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: height * 0.3,
  },
  backButton: {
    marginLeft: 16,
    marginTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#A78BFA',
    fontWeight: '600',
  },
});

export default ClubScreen;

