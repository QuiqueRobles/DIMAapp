import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import TicketCard from '@/components/TicketCard';
import ExpandedTicket from '@/components/ExpandedTicket';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReviewForm from '@/components/ReviewForm';
import ErrorDisplay from '@/components/ErrorDisplay';
import { set } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

const DEBUG = true;

interface Ticket {
  id: string;
  user_id: string;
  club_id: string;
  event_id: string;
  purchase_date: string;
  total_price: number;
  event_date: string;
  num_people: number;
  profiles: {
    name: string;
  };
  event: {
    name: string;
  };
  club: {
    name: string;
  };
}

const TICKETS_PAGE_SIZE = 4; // Number of tickets per page for past events
const FLATLIST_MAX_HEIGHT = 380; // Adjust as needed so each list is independently scrollable

const TicketScreen: React.FC = () => {
  const [currentTickets, setCurrentTickets] = useState<Ticket[]>([]);
  const [pastTickets, setPastTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedTicketForReview, setSelectedTicketForReview] = useState<Ticket | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');


  useEffect(() => {
    fetchTickets();
  }, []);

  /**
   * Fetch both current and past tickets.
   * This resets the page counter for infinite scrolling.
   */
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(1);
      setHasMore(true);

      console.log("fetchTickets");

      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log("userData:", userData);
      console.log("userError:", userError);

      if (userError || !userData.user) {
        
        throw new Error('Failed to get user');
      }

      


      // Fetch all tickets for the user
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('ticket')
        .select(`
          *,
          profiles:user_id (name),
          event:event_id (name)
        `)
        .eq('user_id', userData.user.id);

      //console.log("ticketsData:", ticketsData);

      if (ticketsError) {
        throw new Error('Failed to fetch tickets');
      }

      // For each ticket, fetch club data if available
      const ticketsWithClubData: Ticket[] = await Promise.all(
        (ticketsData || []).map(async (ticket: Ticket) => {
          const { data: clubData, error: clubError } = await supabase
            .from('club')
            .select('name')
            .eq('club_id', ticket.club_id)
            .single();
          //console.log("clubData:", clubData);
          return clubError ? ticket : { ...ticket, club: clubData };
        })
      );

      // Separate current and past tickets based on event_date
      const now = new Date();
      const current = ticketsWithClubData.filter(
        (ticket) => new Date(ticket.event_date) >= now
      );
      const pastSorted = ticketsWithClubData
        .filter((ticket) => new Date(ticket.event_date) < now)
        .sort(
          (a, b) =>
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
        );
      const initialPastTickets = pastSorted.slice(0, TICKETS_PAGE_SIZE);
      if (initialPastTickets.length < TICKETS_PAGE_SIZE) {
        setHasMore(false);
      }

      setCurrentTickets(current);
      setPastTickets(initialPastTickets);
    } catch (err: unknown) {
      //console.log("error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh handler for pull-to-refresh.
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  };

  /**
   * Fetch more past tickets (for infinite scroll).
   */
  const fetchMorePastTickets = async () => {
    console.log("fetchMorePastTickets");
    console.log("loadingMore:", loadingMore);
    console.log("hasMore:", hasMore);
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Failed to get user');
      }

      const nowISOString = new Date().toISOString();
      const { data: moreTickets, error: ticketsError } = await supabase
        .from('ticket')
        .select(`
          *,
          profiles:user_id (name),
          event:event_id (name)
        `)
        .eq('user_id', userData.user.id)
        .lt('event_date', nowISOString)
        .order('event_date', { ascending: false })
        .range(page * TICKETS_PAGE_SIZE, (page + 1) * TICKETS_PAGE_SIZE - 1);

      console.log("moreTickets:", moreTickets);
      console.log("ticketsError:", ticketsError);
      if (ticketsError) {
        throw new Error('Failed to fetch more tickets');
      }

      if (moreTickets) {
        // Process club data for each additional ticket
        const ticketsWithClub = await Promise.all(
          moreTickets.map(async (ticket: Ticket) => {
            const { data: clubData, error: clubError } = await supabase
              .from('club')
              .select('name')
              .eq('club_id', ticket.club_id)
              .single();
            console.log("clubData:", clubData);
            return clubError ? ticket : { ...ticket, club: clubData };
          })
        );

        if (ticketsWithClub.length < TICKETS_PAGE_SIZE) {
          setHasMore(false);
        }
        setPastTickets((prev) => [...prev, ...ticketsWithClub]);
        setPage((prev) => prev + 1);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleTicketPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleReviewSubmit = async () => {
    if (!selectedTicketForReview) return;

    try {
    

      const { error: reviewError } = await supabase
        .from('review')
        .insert([
          {
            user_id: selectedTicketForReview.user_id,
            club_id: selectedTicketForReview.club_id,
            num_stars: rating,
            text: review,
          },
        ]);

      if (reviewError) {
        if(reviewError.code === '23505'){
          throw new Error('You have already submitted a review for this event');
        }else{
          throw new Error('Failed to submit review');
        }
      }

      setShowReviewForm(false);
      setSelectedTicketForReview(null);
      setRating(0);
      setReview('');
      alert('Review submitted successfully');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };



  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (

    //console.log("pastTickets:", pastTickets),
    
    <SafeAreaView style={styles.container}>
      <View
        style={styles.content}
        
      >
        
                <LinearGradient
                  colors={['rgba(76, 43, 176, 0.97)', 'rgba(131, 27, 191, 0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nameGradient}
                />
                <Text style={styles.title}>My Tickets</Text>
              
        

        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Incoming Events</Text>
          <FlatList
            data={currentTickets}
            testID='future-events-list'
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard ticket={item} onPress={() => handleTicketPress(item)} />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay entradas para próximos eventos
              </Text>
            }
            nestedScrollEnabled
            style={{ maxHeight: FLATLIST_MAX_HEIGHT }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        </View>

        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Past Events</Text>
          <FlatList
            data={pastTickets}
            testID='past-events-list'
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard
                ticket={item}
                onPress={() => handleTicketPress(item)}
                isPast
                onWriteReviewPress={() => {
                  setSelectedTicketForReview(item);
                  setShowReviewForm(true);
                }}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay entradas de eventos pasados
              </Text>
            }
            onEndReached={fetchMorePastTickets}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <LoadingSpinner /> : null}
            nestedScrollEnabled
            style={{ maxHeight: FLATLIST_MAX_HEIGHT }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        </View>
      </View> 

      

      <Modal
        visible={!!selectedTicket}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedTicket(null)}
      >
        {selectedTicket && (
          <ExpandedTicket
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </Modal>
      <Modal
        visible={showReviewForm}
        animationType="slide"
        testID='review-modal'
        transparent
        onRequestClose={() => setShowReviewForm(false)}
      >
        <ReviewForm 
          clubName={selectedTicketForReview?.club.name || ''}
          onReviewSubmit={() => {

            handleReviewSubmit();
          }}
          onClose={() => {
            setShowReviewForm(false)
            setSelectedTicketForReview(null);
            setRating(0);
            setReview('');
          }}
          rating={rating}
          rewiewtext={review}
          setRating={setRating}
          setReview={setReview}

        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 16,
    marginTop: 5,
    marginBottom: 24,
    alignSelf:'center',
    fontFamily:'koboto'
  },
  sectionContainer: {
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginTop: 16,
    marginBottom: 8,

  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
  },
  nameGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    bottom: 0,
    height:50,
  },
  
});

export default TicketScreen;
