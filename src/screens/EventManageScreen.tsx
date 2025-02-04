
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StyleSheet, Button } from 'react-native';
import OwnedEventsList from '@/components/OwnedEventList';
import { Calendar } from "react-native-calendars"
import { Plus } from "lucide-react-native"
import AddEventModal from "@/components/addEvent"
import { ClubProvider, useClub } from "../../src/context/EventContext"





export function formatDate(date: Date): string {
  return date.toString().split("T")[0]
}        

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


const EventsManage = () => {
    const [loading, setLoading] = useState(true);
    const [isNewEventModalVisible, setIsNewEventModalVisible] = useState(false)
    const [isModifyEventModalVisible, setIsModifyEventModalVisible] = useState(false)
    const { events,clubId,addEvent,setEvents,setClubId } = useClub()
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
            setClubId(user.id)
            console.log('cluuubid',clubId)
            const {data: eventsData, error: eventsError} = await supabase.from('event').select('*').eq('club_id', user.id);
        
            console.log("events fetched:", eventsData);
            if (eventsError) throw new Error('Failed to fetch events');
            //setEvents(eventsData);
            setEvents(eventsData);
            console.log("events: ", events);
        } catch (error) {
            console.error(error);
        }finally{
            setLoading(false);
        }
    };
    
    const markedDates = events.reduce((acc, event) => {
        const formattedDate = event.date
        
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
    
  

    
    return (
       
        <View style={styles.container}>
          <Calendar
           testID='calendar'
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
            events={events}
            clubName="Club Name" 
          />

          
    
          <TouchableOpacity testID='add-event-button' style={styles.fab} onPress={() => setIsNewEventModalVisible(true)}>
          <Plus size={24} color="#fff" />
          </TouchableOpacity>
    
          <AddEventModal visible={isNewEventModalVisible} onClose={() => setIsNewEventModalVisible(false)} />
        </View>
        
      )
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 70,
      backgroundColor: '#121212',
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
      backgroundColor: "#5500FF",
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
