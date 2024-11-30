import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Tickets: { eventId: string };
};

type TicketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tickets'>;

interface TicketButtonProps {
  eventId: string;
}

const TicketButton: React.FC<TicketButtonProps> = ({ eventId }) => {
  const navigation = useNavigation<TicketScreenNavigationProp>();

  const handlePress = () => {
    navigation.navigate('Tickets', { eventId });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Buy Ticket</Text>
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TicketButton;
