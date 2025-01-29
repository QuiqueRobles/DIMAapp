import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput ,Alert} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
interface Club {
  id: string;
  name: string;
  rating: number;
  num_reviews: number;
  address: string;
  image: string | null;
  category: string | null;
  music_genre: string | null;
  attendees: number;
  opening_hours: string;
  dress_code: string | null;
  description: string | null;}


interface ClubEditsProps {
  club:Club;
  setClub: React.Dispatch<React.SetStateAction<ClubEditsProps['club']| null >>;
}
const EditableDetailItem: React.FC<{
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string;
    onChange: (value: string) => void;
  }> = ({ icon, label, value, onChange }) => (
    <View style={styles.detailItem}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={16} color="#A78BFA" />
      </View>
      <TextInput
        style={styles.detailInput}
        value={value}
        onChangeText={onChange}
        placeholder={label}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );

const ClubEdit: React.FC<ClubEditsProps> = ({ club ,setClub}) => {
    //const [editableClub, setEditableClub] = useState(club);
    const handleUpdate = (key: keyof ClubEditsProps['club'], value: string) => {
        setClub((prev) =>prev? { ...prev, [key]: value }: null);
       
      };
    



  return (

    <View style={styles.container}>
      <EditableDetailItem
        icon="map-pin"
        label="Address"
        value={club.address}
        onChange={(value) => handleUpdate('address', value)}
      />
      <EditableDetailItem
        icon="clock"
        label="Opening Hours"
        value={club.opening_hours || ''}
        onChange={(value) => handleUpdate('opening_hours', value)}
      />
      
        <EditableDetailItem
          icon="user"
          label="Dress Code"
          value={club.dress_code || ''}
          onChange={(value) => handleUpdate('dress_code', value)}
        />
      
        <EditableDetailItem
          icon="music"
          label="Music Genre"
          value={club.music_genre ||''}
          onChange={(value) => handleUpdate('music_genre', value)}
        />
  
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About</Text>
          <TextInput
            style={styles.descriptionInput}
            value={club.description || ''}
            onChangeText={(value) => handleUpdate('description', value)}
            multiline
          />
        </View>
      
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
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
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailInput: {
    fontSize: 14,
    color: '#E5E7EB',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingVertical: 2,
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
  descriptionInput: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingVertical: 4,
    textAlignVertical: 'top',
  },
});
export default ClubEdit;


