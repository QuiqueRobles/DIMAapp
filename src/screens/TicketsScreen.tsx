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
import ErrorDisplay from '@/components/ErrorDisplay';

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

const TICKETS_PAGE_SIZE = 10; // Number of tickets per page for past events
const FLATLIST_MAX_HEIGHT = 300; // Adjust as needed so each list is independently scrollable

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

      const { data: userData, error: userError } = await supabase.auth.getUser();
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.title}>My tickets</Text>

        {/* Incoming Events Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Incoming Events</Text>
          <FlatList
            data={currentTickets}
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
          />
        </View>

        {/* Past Events Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Past Events</Text>
          <FlatList
            data={pastTickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard
                ticket={item}
                onPress={() => handleTicketPress(item)}
                isPast
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
          />
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
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
  },
  sectionContainer: {
    marginBottom: 24,
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
});

export default TicketScreen;
