import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ClubDetailsProps {
  club: {
    id: string;
    name: string;
    rating: number;
    num_reviews: number;
    address: string;
    image: string | null;
    category: string | null;
    music_genre?: string | null;
    attendees: number;
    opening_hours: string;
    dress_code: string | null;
    description: string | null;
  };
}

const ClubDetails: React.FC<ClubDetailsProps> = ({ club }) => {
  return (
    <View style={styles.container}>
      <DetailItem icon="map-pin" text={club.address} />
      <DetailItem icon="clock" text={club.opening_hours} />
      {club.dress_code && <DetailItem icon="user" text={club.dress_code} />}
      {club.music_genre && <DetailItem icon="music" text={club.music_genre} />}
      {club.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text style={styles.description}>{club.description}</Text>
        </View>
      )}
    </View>
  );
};

const DetailItem: React.FC<{ icon: keyof typeof Feather.glyphMap; text: string }> = ({ icon, text }) => (
  <View style={styles.detailItem}>
    <View style={styles.iconContainer}>
      <Feather name={icon} size={16} color="#A78BFA" />
    </View>
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#E5E7EB',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
  },
});

export default ClubDetails;
