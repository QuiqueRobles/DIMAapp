import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
type RootStackParamList = {
  BuyTicket: { 
    eventId: string; 
    eventName: string; 
    eventDate: string; 
    eventPrice: number; 
    clubName: string;
    eventDescription: string | null;
    eventImage: string | null;
    clubId: string; // Add clubId to the navigation params
  };
};

type BuyTicketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BuyTicket'>;

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

interface TicketButtonProps {
  event: Event;
  clubName: string;
}

const TicketButton: React.FC<TicketButtonProps> = ({ event, clubName }) => {
  const navigation = useNavigation<BuyTicketScreenNavigationProp>();
  const { t } = useTranslation();
  const handlePress = () => {
    navigation.navigate('BuyTicket', { 
      eventId: event.id, 
      eventName: event.name || 'Unnamed Event', 
      eventDate: event.date, 
      eventPrice: event.price !== null ? event.price : 0, 
      clubName,
      eventDescription: event.description,
      eventImage: event.image,
      clubId: event.club_id // Add clubId to the navigation params
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{t('buyTicket')}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default TicketButton;

