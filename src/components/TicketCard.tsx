import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface TicketCardProps {
  ticket: {
    event: {
      name: string;
    };
    club: {
      name: string;
    };
    event_date: string;
    num_people: number;
    total_price: number;
  };
  onPress: () => void;
  isPast?: boolean;
  onWriteReviewPress?: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress, isPast = false, onWriteReviewPress}) => {
  const { t, i18n } = useTranslation();
  const eventDate = new Date(ticket.event_date);

  return (
    <TouchableOpacity style={[styles.card, isPast && styles.pastCard]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.eventName}>{ticket.event.name}</Text>
        {isPast && <Feather name="check-circle" size={20} color="#10B981" />}
      </View>
      <Text style={styles.clubName}>{ticket.club.name}</Text>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Feather name="calendar" size={16} color="#A78BFA" />
          <Text style={styles.detailText}>
            {eventDate.toLocaleDateString(i18n.language, { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Feather name="users" size={16} color="#A78BFA" />
          <Text style={styles.detailText}>
            {t('ticket_card.people', { count: ticket.num_people })}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Feather name="dollar-sign" size={16} color="#67FF0C" />
          <Text style={styles.detailText}>{ticket.total_price.toFixed(2)}€</Text>
        </View>
      </View>
      {isPast && (
        <TouchableOpacity 
          style={styles.reviewButton} 
          onPress={onWriteReviewPress}
          testID='write-review-button'
        >
          <Text style={styles.reviewButtonText}>{t('ticket_card.write_review')}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pastCard: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clubName: {
    fontSize: 14,
    color: '#A78BFA',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    color: '#E5E7EB',
    fontSize: 14,
  },
  reviewButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#5500FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
  
});

export default TicketCard;

