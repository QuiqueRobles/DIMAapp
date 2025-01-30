
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StyleSheet, Button } from 'react-native';
import OwnedEventsList from '@/components/OwnedEventList';
import { Calendar } from "react-native-calendars"
//import { Plus } from "lucide-react-native"
import AddEventModal from "@/components/addEvent"
import { ClubProvider, useClub } from "src/context/EventContext"

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}        

interface Event {
    event_id: string;
    created_at: string;
    club_id: string;
    date: Date;
    name: string;
    price: number;
    description: string;
    image: string;
}


const EventsManage = () => {
    const [loading, setLoading] = useState(true);
    const [isNewEventModalVisible, setIsNewEventModalVisible] = useState(false)
    const [isModifyEventModalVisible, setIsModifyEventModalVisible] = useState(false)
    const { events,clubId,addEvent,setEvents } = useClub()
    const [mytempEvents, setMytempEvents] = useState<Event[]>([]); //temporary variable to store events

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
        
            console.log("events fetched:", eventsData);
            if (eventsError) throw new Error('Failed to fetch events');
            //setEvents(eventsData);
            setMytempEvents(eventsData);
            console.log("events: ", mytempEvents);
        } catch (error) {
            console.error(error);
        }finally{
            setLoading(false);
        }
    };
    
    const markedDates = events.reduce((acc, event) => {
        const formattedDate = formatDate(event.date)
        
        return {
          ...acc,
          [formattedDate]: {
            marked: true,
            dotColor: "#8B5CF6",
            selected: true,
            selectedColor: "rgba(139, 92, 246, 0.2)",
          },
        }
      }, {})
    
    const fetchClubData = async () => {
      try {

        console.log("fetching events for club:", clubId);
      
        const { data: clubData, error: clubError } = await supabase
          .from('event')
          .select('*')
          .eq('club_id', clubId)
          .order('date', { ascending:true})
          .limit(5) as { data: Event[], error: any }; // Explicit type);

        console.log("clubData:", clubData);
        console.log("clubError:", clubError);
  
        if (clubError) throw new Error('Failed to fetch club data');
        setEvents(clubData);  

        
      } 
      catch (err: unknown) {
        if (err instanceof Error) {
          
        } else {
          
        }
      } finally {
        
      }
    };

    
    return (
        <ClubProvider>
        <View style={styles.container}>
          <Calendar
            theme={{
              backgroundColor: "#121212",
              calendarBackground: "#121212",
              textSectionTitleColor: "#666",
              selectedDayBackgroundColor: "#8B5CF6",
              selectedDayTextColor: "#fff",
              todayTextColor: "#8B5CF6",
              dayTextColor: "#fff",
              textDisabledColor: "#444",
              monthTextColor: "#fff",
            }}
            markedDates={markedDates}
          />
    
          <View style={styles.eventsContainer}>
            <Text style={styles.noEvents}>{events.length === 0 ? "No events yet" : "Today's events:"}</Text>
          </View>
          
          <OwnedEventsList 
            events={mytempEvents} 
            clubName="Club Name" 
          />

          
    
          <TouchableOpacity style={styles.fab} onPress={() => setIsNewEventModalVisible(true)}>
            <Text/>
          </TouchableOpacity>
    
          <AddEventModal visible={isNewEventModalVisible} onClose={() => setIsNewEventModalVisible(false)} />
        </View>
        </ClubProvider>
      )
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 70,
      backgroundColor: '#1F2937',
    },
    scrollContent: {
        flexGrow: 1,
    },
    eventsContainer: {
      flex: 1,
      alignItems: "center",
      paddingTop: 20,
    },
    noEvents: {
      color: "#666",
      fontSize: 16,
    },
    fab: {
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
      backgroundColor: "#8B5CF6",
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
  });
  
  export default EventsManage;
