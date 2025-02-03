import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import ModifyEventButton from '@/components/ModifyEventButton';
import ModifyEventModal from '@/components/ModifyEvent';
import { LinearGradient } from 'expo-linear-gradient';



interface Event {

    club_id: string | null
    name: string
    date: string
    created_at: string | null
    price: number |null
    description: string | null
    image: string | null
    id: string | null


}

interface EventsListProps {
  events: Event[];
  clubName: string;
}

const OwnedEventsList: React.FC<EventsListProps> = ({ events, clubName }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const today = new Date();
  const [formattedDate ,setFormattedDate]=useState("");


  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
    // setFormattedDate(format( event.date||today, 'MMM d, yyyy'));
   
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };
  

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.eventDate}>{event.date}</Text>
            {event.description && (
              <Text style={styles.eventDescription} numberOfLines={2}>
                {event.description}
              </Text>
            )}
            {event.price !== null && (
              <Text style={styles.eventPrice}>${(event.price /100 ).toFixed(2)}</Text>
            )}
          </View>
          
          

          <TouchableOpacity onPress={() => openModal(event)}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Modify Event</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      ))}

      {selectedEvent && (
        <ModifyEventModal
          visible={isModalVisible}
          onClose={closeModal}
          eventId={selectedEvent.id} 
          clubId={selectedEvent.club_id} 
          eventName={selectedEvent.name || 'Unnamed Event'} 
          eventDate={selectedEvent.date} 
          eventPrice={selectedEvent.price !== null ? selectedEvent.price: 0} 
          eventDescription={selectedEvent.description} 
          eventImage={selectedEvent.image}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  eventItem: {
    backgroundColor: '#121212',
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
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OwnedEventsList;

