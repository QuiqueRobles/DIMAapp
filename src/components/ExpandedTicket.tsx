import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';

interface ExpandedTicketProps {
  ticket: {
    id: string;
    event: {
      name: string;
    };
    club: {
      name: string;
    };
    event_date: string;
    num_people: number;
    total_price: number;
    purchase_date: string;
    profiles: {
      username: string;
    };
  };
  onClose: () => void;
}

const ExpandedTicket: React.FC<ExpandedTicketProps> = ({ ticket, onClose }) => {
  const { t, i18n } = useTranslation();
  const eventDate = new Date(ticket.event_date);
  const purchaseDate = new Date(ticket.purchase_date);

  const DetailItem: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
      <Feather name={icon} size={20} color="#A78BFA" />
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container} testID='expanded-ticket'>
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ScrollView>
          <Text style={styles.title}>{ticket.event.name}</Text>
          <Text style={styles.subtitle}>{ticket.club.name}</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={ticket.id}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>
          <View style={styles.details}>
            <DetailItem 
              icon="user" 
              label={t('expanded_ticket.user')} 
              value={ticket.profiles.username} 
            />
            <DetailItem 
              icon="calendar" 
              label={t('expanded_ticket.event_date')} 
              value={eventDate.toLocaleDateString(i18n.language, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} 
            />
            <DetailItem 
              icon="clock" 
              label={t('expanded_ticket.event_time')} 
              value={eventDate.toLocaleTimeString(i18n.language, { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} 
            />
            <DetailItem 
              icon="users" 
              label={t('expanded_ticket.number_of_people')} 
              value={`${ticket.num_people}`} 
            />
            <DetailItem 
              icon="dollar-sign" 
              label={t('expanded_ticket.total_price')} 
              value={`${ticket.total_price.toFixed(2)}€`} 
            />
            <DetailItem 
              icon="shopping-bag" 
              label={t('expanded_ticket.purchase_date')} 
              value={purchaseDate.toLocaleDateString(i18n.language, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} 
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#A78BFA',
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  details: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default ExpandedTicket;

