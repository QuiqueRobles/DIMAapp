import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { format, parseISO } from 'date-fns';
import TicketButton from './TicketButton';

interface Event {
  id: string;
  created_at: string;
  club_id: string;
  date: string;
  name: string | null;
  price: number | null;
  description: string | null;
  image: string | null;
}

interface EventsListProps {
  events: Event[];
  clubName: string;
}

const EventsList: React.FC<EventsListProps> = ({ events, clubName }) => {
  return (
    <View style={styles.container}>
      {events.map((event) => (
        <View key={event.id} style={styles.eventItem}>
          {event.image && (
            <Image 
              source={{ uri: event.image }} 
              style={styles.eventImage} 
              resizeMode="cover"
            />
          )}
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{event.name || 'Unnamed Event'}</Text>
            <Text style={styles.eventDate}>{format(parseISO(event.date), 'MMM d, yyyy')}</Text>
            {event.description && (
              <Text style={styles.eventDescription} numberOfLines={2}>
                {event.description}
              </Text>
            )}
            {event.price !== null && (
              <Text style={styles.eventPrice}>${(event.price / 100).toFixed(2)}</Text>
            )}
          </View>
          <TicketButton event={event} clubName={clubName} />
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
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventInfo: {
    padding: 16,
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
  eventDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
});

export default EventsList;

