import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import TicketButton from './TicketButton';

interface Event {
  id: string;
  created_at: string;
  club_id: string;
  date: string;
  name: string | null;
  price: number | null;
}

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  return (
    <View style={styles.container}>
      {events.map((event) => (
        <View key={event.id} style={styles.eventItem}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{event.name || 'Unnamed Event'}</Text>
            <Text style={styles.eventDate}>{format(new Date(event.date), 'MMM d, yyyy')}</Text>
            {event.price !== null && (
              <Text style={styles.eventPrice}>${(event.price / 100).toFixed(2)}</Text>
            )}
          </View>
          <TicketButton eventId={event.id} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  eventItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventInfo: {
    flex: 1,
    marginRight: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
});

export default EventsList;
