import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
}

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity className="bg-gray-800 p-4 rounded-lg mb-2">
      <Text className="text-white font-semibold text-lg mb-1">{item.name}</Text>
      <View className="flex-row items-center">
        <Feather name="calendar" size={14} color="#A78BFA" />
        <Text className="text-gray-300 ml-1 mr-3">{item.date}</Text>
        <Feather name="clock" size={14} color="#A78BFA" />
        <Text className="text-gray-300 ml-1">{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={events}
      renderItem={renderEvent}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text className="text-gray-400 text-center">No upcoming events</Text>
      }
    />
  );
};

export default EventsList;

