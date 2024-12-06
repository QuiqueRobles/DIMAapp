import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import EventCard from './components/EventCard';

type RootStackParamList = {
  Calendar: { clubId: string };
  BuyTicket: { 
    eventId: string; 
    eventName: string; 
    eventDate: string; 
    eventPrice: number; 
    clubName: string;
    eventDescription: string | null;
    eventImage: string | null;
  };
};

type CalendarScreenRouteProp = RouteProp<RootStackParamList, 'Calendar'>;
type CalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Calendar'>;

interface Event {
  id: string;
  date: string;
  name: string | null;
  price: number | null;
  description: string | null;
  image: string | null;
}

const CalendarScreen: React.FC = () => {
  const route = useRoute<CalendarScreenRouteProp>();
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const { clubId } = route.params;

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [clubName, setClubName] = useState<string>('');

  useEffect(() => {
    fetchEvents();
    fetchClubName();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select('*')
      .eq('club_id', clubId);

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
  };

  const fetchClubName = async () => {
    const { data, error } = await supabase
      .from('club')
      .select('name')
      .eq('id', clubId)
      .single();

    if (error) {
      console.error('Error fetching club name:', error);
    } else {
      setClubName(data?.name || '');
    }
  };

  const markedDates = events.reduce((acc, event) => {
    acc[event.date] = { marked: true, dotColor: '#A78BFA' };
    return acc;
  }, {} as { [key: string]: { marked: boolean; dotColor: string } });

  const handleDayPress = (day: DateData) => {
    const selectedEvent = events.find(event => event.date === day.dateString);
    setSelectedEvent(selectedEvent || null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{clubName} Events</Text>
      </View>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: '#1F2937',
          calendarBackground: '#1F2937',
          textSectionTitleColor: '#A78BFA',
          selectedDayBackgroundColor: '#A78BFA',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#A78BFA',
          dayTextColor: '#FFFFFF',
          textDisabledColor: '#4B5563',
          dotColor: '#A78BFA',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#A78BFA',
          monthTextColor: '#FFFFFF',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14
        }}
      />
      {selectedEvent && (
        <EventCard 
          event={selectedEvent}
          clubName={clubName}
          onBuyTicket={() => {
            navigation.navigate('BuyTicket', {
              eventId: selectedEvent.id,
              eventName: selectedEvent.name || 'Unnamed Event',
              eventDate: selectedEvent.date,
              eventPrice: selectedEvent.price !== null ? selectedEvent.price / 100 : 0,
              clubName: clubName,
              eventDescription: selectedEvent.description,
              eventImage: selectedEvent.image
            });
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
});

export default CalendarScreen;
