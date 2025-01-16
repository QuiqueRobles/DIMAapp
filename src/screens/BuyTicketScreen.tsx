import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { useStripe } from '@stripe/stripe-react-native';
import { supabase } from '../lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

type RootStackParamList = {
  BuyTicket: { 
    eventId: string; 
    eventName: string; 
    eventDate: string; 
    eventPrice: number; 
    clubName: string;
    eventDescription: string | null;
    eventImage: string | null;
    clubId: string;
  };
};

type BuyTicketScreenRouteProp = RouteProp<RootStackParamList, 'BuyTicket'>;
type BuyTicketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BuyTicket'>;

const BuyTicketScreen: React.FC = () => {
  const route = useRoute<BuyTicketScreenRouteProp>();
  const navigation = useNavigation<BuyTicketScreenNavigationProp>();
  const { eventId, eventName, eventDate, eventPrice, clubName, eventDescription, eventImage, clubId } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const fetchPaymentSheetParams = async () => {
    try {
      console.log('Fetching payment intent...');
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          amount: Math.round(quantity * eventPrice * 100),
          currency: 'usd',
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Invalid JSON response');
      }

      console.log('Parsed data:', data);

      if (!data.clientSecret) {
        console.error('No client secret in response:', data);
        throw new Error('No client secret received');
      }

      return { paymentIntent: data.clientSecret };
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      Alert.alert('Error', 'Unable to initialize payment. Please try again.');
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    try {
      console.log('Initializing payment sheet...');
      const { paymentIntent } = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'Your App Name',
        returnURL: 'your-app-scheme://stripe-redirect',
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        console.log('Payment sheet initialized successfully');
      }
    } catch (error) {
      console.error('Error in initializePaymentSheet:', error);
      Alert.alert('Error', 'Failed to initialize payment. Please try again.');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [quantity]);

  const handlePurchase = async () => {
  setLoading(true);
  try {
    console.log('Presenting payment sheet...');
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      console.error('Error presenting payment sheet:', JSON.stringify(paymentError, null, 2));
      Alert.alert(`Payment Error: ${paymentError.code}`, paymentError.message);
      return;
    }

    console.log('Payment successful');
    const ticketData = await createTicketInDatabase();
    console.log('Ticket created successfully:', JSON.stringify(ticketData, null, 2));
    Alert.alert('Success', 'Your payment was successful and ticket has been created!');
    navigation.goBack();
  } catch (error) {
    console.error('Error in handlePurchase:', error instanceof Error ? error.stack : JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      Alert.alert('Error', `Failed to process payment or create ticket: ${error.message}`);
    } else {
      Alert.alert('Error', 'An unknown error occurred while processing your purchase');
    }
  } finally {
    setLoading(false);
  }
};



  const createTicketInDatabase = async () => {
  try {
    console.log('Creating ticket in database...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', JSON.stringify(userError, null, 2));
      throw new Error(`User error: ${userError.message}`);
    }
    
    if (!user) {
      console.error('No user found');
      throw new Error('No user logged in');
    }

    const ticketData = {
      user_id: user.id,
      club_id: clubId,
      event_id: eventId,
      purchase_date: new Date().toISOString(),
      total_price: quantity * eventPrice,
      event_date: eventDate,
      num_people: quantity,
    };

    console.log('Ticket data to be inserted:', JSON.stringify(ticketData, null, 2));

    const { data, error } = await supabase
      .from('ticket')
      .insert(ticketData)
      .select();

    if (error) {
      console.error('Supabase insertion error:', JSON.stringify(error, null, 2));
      throw new Error(`Supabase error: ${error.message || 'Unknown error occurred during insertion'}`);
    }

    if (!data || data.length === 0) {
      console.error('No data returned from ticket insertion');
      throw new Error('No data returned from ticket insertion');
    }

    console.log('Ticket created:', JSON.stringify(data[0], null, 2));
    return data[0];
  } catch (error) {
    console.error('Error creating ticket:', error instanceof Error ? error.stack : JSON.stringify(error, null, 2));
    throw error;
  }
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
        <TouchableOpacity onPress={handlePurchase} disabled={loading}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.purchaseButton}
          >
            <Text style={styles.purchaseButtonText}>
              {loading ? 'Processing...' : 'Purchase Tickets'}
            </Text>
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

