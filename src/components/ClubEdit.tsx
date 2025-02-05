import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput,Alert} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import Autocomplete from "react-native-autocomplete-input";
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
  latitude:number;
  longitude:number;
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
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
  
    const fetchAddressSuggestions = async (text) => {
      if (text.length < 3) return;
  
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`,
          {
            headers: {
              "User-Agent":  "Nightmi/1.0(nightmi.com)",
            }, }
        );
        // Read response as text
    
        const data = await response.json();
  
        setSuggestions(data.map((item) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        })));
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    };
  

  
    const handleUpdate = (key: keyof ClubEditsProps['club'], value: string) => {
        setClub((prev) =>prev? { ...prev, [key]: value }: null);
       
      };
    
      const handleSelect = (address) => {
        setQuery(address.display_name);
        setSelectedAddress(address); 
        setSuggestions([]); // Hide suggestions after selection
        handleUpdate('latitude', address.lat);
        handleUpdate('longitude',address.lon);
        handleUpdate('address',address.display_name);
      }


  return (

    <View style={styles.container}>

      <View style={styles.detailItem}> 
      <View style={styles.iconContainer}>
        <Feather name={"map-pin"} size={16} color="#A78BFA" />
      </View>
      <Autocomplete 
        inputContainerStyle={{ borderWidth: 0 }} // Remove extra borders if needed
        style={styles.detailInput}

        data={suggestions}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchAddressSuggestions(text);
        }}
        placeholder={club.address || 'address'}
        placeholderTextColor="#9CA3AF"
        flatListProps={{
          keyExtractor: (_, index) => index.toString(),
          renderItem: ({ item }) => (
            <TouchableOpacity style={styles.addresssuggestions}
             onPress={() => handleSelect(item)}>
              <Text style={styles.detailInput}>{item.display_name}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      </View>
    
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




export const styles = StyleSheet.create({
  container: {
    backgroundColor:'#121212',
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
  detailInput: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingVertical: 2,
     backgroundColor: '#121212'
    
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
  addresssuggestions:{
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
  }
});
export default ClubEdit;


