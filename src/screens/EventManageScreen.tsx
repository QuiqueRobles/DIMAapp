import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import OwnedEventsList from '@/components/OwnedEventList';

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


const EventsManage = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);
    
    
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const {data: {user} } = await supabase.auth.getUser();
            if(!user) throw new Error('Club not found');
            console.log("club:" ,user.id);

            const {data: eventsData, error: eventsError} = await supabase.from('event').select('*').eq('club_id', user.id);
        
            console.log("events:", eventsData);
            if (eventsError) throw new Error('Failed to fetch events');
            setEvents(eventsData || []);
        } catch (error) {
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    
    return (
        <SafeAreaView style={styles.container}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
              >
                <OwnedEventsList events={events} clubName="Club Name" />

              </ScrollView>
        </SafeAreaView>
    )
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1F2937',
    },
    scrollContent: {
        flexGrow: 1,
    },
  });

  
  
  export default EventsManage;
