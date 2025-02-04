import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, RefreshControl, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import ClubHeader from '@/components/ClubHeader';
import ClubDetails from '@/components/ClubDetails';
import EventsList from '@/components/EventsList';
import ReviewsList from '@/components/ReviewsList';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width, height } = Dimensions.get('window');

const ClubScreen: React.FC = () => {
  const { t } = useTranslation();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { clubId } = route.params;

  useEffect(() => {
    fetchClubData();
  }, [clubId]);

  const fetchClubData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: clubData, error: clubError } = await supabase
        .from('club')
        .select('*')
        .eq('club_id', clubId)
        .single();
      if (clubError) throw new Error(t('error.fetchClub'));
      setClub(clubData);

      const { data: eventsData, error: eventsError } = await supabase
        .from('event')
        .select('*')
        .eq('club_id', clubId)
        .order('date', { ascending: true })
        .limit(3);
      if (eventsError) throw new Error(t('error.fetchEvents'));
      setEvents(eventsData || []);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('review')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false })
        .limit(5);
      if (reviewsError) throw new Error(t('error.fetchReviews'));
      setReviews(reviewsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
    return <ErrorDisplay message={t('error.clubNotFound')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#A78BFA" />}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imageOverlay} />
          <Image
            source={{ uri: club.image || 'https://via.placeholder.com/400x200?text=No+Image' }}
            style={styles.image}
          />
          <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.imageGradient} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.clubType}>
            <Text style={styles.clubTypeText}>{t(club.category || 'defaultCategory')}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <ClubHeader club={club} />
          <ClubDetails club={club} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('events.upcoming')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Calendar', { clubId: club.club_id, clubName: club.name })}>
                <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            {events.length > 0 ? <EventsList events={events} clubName={club.name} clubId={club.club_id} /> : <Text style={styles.noEventsText}>{t('events.none')}</Text>}
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('reviews.title')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Reviews', { clubId: club.club_id, clubName: club.name })}>
                <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            {reviews.length > 0 ? <ReviewsList reviews={reviews.slice(0, 3)} /> : <Text style={styles.noReviewsText}>{t('reviews.none')}</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    scrollContent: {
      flexGrow: 1,
    },
    imageContainer: {
      height: height * 0.4,
      width: width,
      position: 'relative',
      backgroundColor: '#121212',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    
    },
    imagee: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    imageGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '50%',
    },
    backButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 20,
      padding: 8,
    },
    clubType: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: 'rgba(237, 41, 255, 0.8)',
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    clubTypeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 20,
      backgroundColor: '#121212',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
    },
    section: {
      marginTop: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    seeAllText: {
      fontSize: 14,
      color: '#A78BFA',
      fontWeight: '600',
    },
    noEventsText: {
      color: '#9CA3AF',
      fontSize: 16,
      textAlign: 'center',
    },
    noReviewsText: {
      color: '#9CA3AF',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 16,
    },
    EditButton: {
      width: '30%',
      color:'#9CA3AF',
      overflow: 'hidden',
      borderRadius: 8,
    },
  });

export default ClubScreen;
