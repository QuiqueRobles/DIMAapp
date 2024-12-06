import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';

type RootStackParamList = {
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

type BuyTicketScreenRouteProp = RouteProp<RootStackParamList, 'BuyTicket'>;
type BuyTicketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BuyTicket'>;

const BuyTicketScreen: React.FC = () => {
  const route = useRoute<BuyTicketScreenRouteProp>();
  const navigation = useNavigation<BuyTicketScreenNavigationProp>();
  const { eventId, eventName, eventDate, eventPrice, clubName, eventDescription, eventImage } = route.params;

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handlePurchase = () => {
    Alert.alert(
      "Purchase Confirmation",
      `You are about to purchase ${quantity} ticket(s) for ${eventName} at ${clubName} for a total of $${(quantity * eventPrice).toFixed(2)}. Do you want to proceed?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            Alert.alert("Success", "Your tickets have been purchased!");
            navigation.goBack();
          }
        }
      ]
    );
  };

  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Date not available';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Buy Tickets</Text>
        {eventImage && (
          <Image 
            source={{ uri: eventImage }} 
            style={styles.eventImage} 
            resizeMode="cover"
          />
        )}
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{eventName}</Text>
          <Text style={styles.clubName}>{clubName}</Text>
          <Text style={styles.eventDate}>{formatEventDate(eventDate)}</Text>
          {eventDescription && (
            <Text style={styles.eventDescription}>{eventDescription}</Text>
          )}
          <Text style={styles.eventPrice}>${eventPrice.toFixed(2)} per ticket</Text>
        </View>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
            <Feather name="minus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
            <Feather name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${(quantity * eventPrice).toFixed(2)}</Text>
        </View>
        <TouchableOpacity onPress={handlePurchase}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.purchaseButton}
          >
            <Text style={styles.purchaseButtonText}>Purchase Tickets</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  eventInfo: {
    marginBottom: 30,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  clubName: {
    fontSize: 18,
    color: '#A78BFA',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 10,
  },
  eventPrice: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  quantityButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 10,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  totalLabel: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  purchaseButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BuyTicketScreen;

