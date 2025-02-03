import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

interface Event {
  id: string;
  date: string;
  name: string | null;
  price: number | null;
  description: string | null;
  image: string | null;
}

interface EventCardProps {
  event: Event;
  clubName: string;
  onBuyTicket: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, clubName, onBuyTicket }) => {
  return (
    <View style={styles.container}>
      {event.image && (
        <Image 
          source={{ uri: event.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{event.name || 'Unnamed Event'}</Text>
        <Text style={styles.date}>{format(parseISO(event.date), 'MMMM d, yyyy')}</Text>
        <Text style={styles.clubName}>{clubName}</Text>
        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}
        {event.price !== null && (
          <Text style={styles.price}>${(event.price / 100).toFixed(2)}</Text>
        )}
        <TouchableOpacity 
          testID='event-card'
          onPress={onBuyTicket}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buyButton}
          >
            <Text style={styles.buyButtonText}>Buy Ticket</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  clubName: {
    fontSize: 14,
    color: '#A78BFA',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 12,
  },
  buyButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EventCard;

