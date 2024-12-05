import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import TicketButton from './TicketButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  clubId: string;
}

type RootStackParamList = {
  Calendar: { clubId: string };
};

type EventsListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Calendar'>;

const EventsList: React.FC<EventsListProps> = ({ events, clubName, clubId }) => {
  const navigation = useNavigation<EventsListNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Calendar', { clubId })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#A78BFA',
    fontWeight: '600',
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

