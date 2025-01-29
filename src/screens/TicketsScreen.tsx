import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase'; // Asegúrate de que esta ruta sea correcta
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

const TicketScreen: React.FC = () => {
  const [currentTickets, setCurrentTickets] = useState<Ticket[]>([]);
  const [pastTickets, setPastTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        
        throw new Error('Failed to get user');
      }
      
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
      

      if (ticketsData) {
       
        const ticketsWithClubData = await Promise.all(
          ticketsData.map(async (ticket: Ticket) => {
            const { data: clubData, error: clubError } = await supabase
              .from('club')
              .select('name')
              .eq('id', ticket.club_id)
              .single();

            if (clubError) {
             
              return ticket;
            }

            return { ...ticket, club: clubData };
          })
        );

       
        const now = new Date();
        const current = ticketsWithClubData.filter((ticket: Ticket) => new Date(ticket.event_date) >= now);
        const past = ticketsWithClubData
          .filter((ticket: Ticket) => new Date(ticket.event_date) < now)
          .sort((a: Ticket, b: Ticket) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
          .slice(0, 10);

       

        setCurrentTickets(current);
        setPastTickets(past);
      } else {
       
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
    
        setError(err.message);
      } else {
       
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
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
      <Text style={styles.title}>My tickets</Text>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Incoming Events</Text>
        <FlatList
          data={currentTickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TicketCard ticket={item} onPress={() => handleTicketPress(item)} />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay entradas para próximos eventos</Text>}
        />
        <Text style={styles.sectionTitle}>Past Events</Text>
        <FlatList
          data={pastTickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TicketCard ticket={item} onPress={() => handleTicketPress(item)} isPast />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay entradas de eventos pasados</Text>}
        />
      </View>
      <Modal
        visible={!!selectedTicket}
        animationType="slide"
        transparent={true}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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

