import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    ModifyEvent: {
        eventId: string | null;
        clubId: string | null;
        eventName: string;
        eventDate: string;
        eventPrice: number;
        eventDescription: string | null;
        eventImage: string | null;
    };
};

const ModifyEventButton: React.FC<{ 
    eventId: string |null; 
    clubId: string | null; 
    eventName: string; 
    eventDate: string;
    eventPrice: number; 
    eventDescription: string | null; 
    eventImage: string | null; }> = ({ 
        eventId, 
        clubId, 
        eventName, 
        eventDate, 
        eventPrice, 
        eventDescription, 
        eventImage }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ModifyEvent'>>();

    const handlePress = () => {
        navigation.navigate('ModifyEvent', {
            eventId,
            clubId,
            eventName,
            eventDate,
            eventPrice,
            eventDescription,
            eventImage
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
                <Text style={styles.buttonText}>Modify Event</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 16,
      color:"#5500FF",
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
});
  
export default ModifyEventButton;