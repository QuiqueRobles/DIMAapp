import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '../../navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { add } from 'date-fns';


import Autocomplete from 'react-native-autocomplete-input';
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

export default function OwnerRegisterScreen() {
  const supabase = useSupabaseClient();
  const KNOWN_PASSWORD = 'club_password';
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clubname,setClubName]=useState('');
  const [clubaddress,setClubAddress]=useState('');
  const [clubphone,setClubPhone]=useState('');
  const navigation = useNavigation<AppNavigationProp>();
  const [showText, setShowText] = useState(false);
  const [missingparameters,setMissingParameters]=useState(true);
  const[latitude,setLatitude]=useState('');
  const[longitude,setLongitude]=useState('');
  const checkInputs=()=>{
    if (clubname==''|| clubaddress=='' || clubphone=='' || email=='') {
      setMissingParameters(true)
    }
    else {setMissingParameters(false)}

  }

  const handleRegister = async () => {
    setIsLoading(true);

    if (clubname.length == 0 || clubname.length > 20) {
      alert('Club name must be between 1 and 20 characters');
      return;
    }

    try {

      console.log("clubname: ", clubname);
      console.log("clubaddress: ", clubaddress);
      console.log("clubphone: ", clubphone);
      console.log("email: ", email);
      
      const {data: clubRequestData, error: clubRequestError} = await supabase.from('club_requests').insert([
        {
          name: clubname,
          address: clubaddress,
          club_id: clubId,
          name: clubname,
          latitude:latitude,
          longitude:longitude,
        }
      ]);
  
    } catch(error: any){
      alert(error.message);
    }finally {
      setIsLoading(false);
      setShowText(true); 
    }


  };

  const handlePress= () => {
    if (!missingparameters){
      handleRegister();
    }else alert("Missing Parameters")
  };

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
                "User-Agent": "Nightmi/1.0(nightmi.com)", 
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
    
  
   
      
        const handleSelect = (address) => {
          setQuery(address.display_name);
          setSelectedAddress(address); 
          setSuggestions([]); // Hide suggestions after selection
        setLatitude(address.lat);
        setLongitude(address.lon);
        setClubAddress(address.display_name);
        }
  


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image
        source={require('@/assets/nightmi_business_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {!showText && ( 
        <>
          <Text style={styles.signIn}>Interested in working with us? Fill this form, you'll be contacted!</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Club Name"
              placeholderTextColor="#9CA3AF"
              value={clubname}
              onChangeText={(text)=>{setClubName(text);
                checkInputs();} }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainerAutocomplete}>
            <Feather name="map" size={24} color="#9CA3AF" style={styles.icon} />
      <Autocomplete 
        style={styles.autocompleteInput}
        containerStyle={styles.autocompleteContainer}
        listContainerStyle={{
          display: suggestions.length > 0 ? "flex" : "none",
          height: Math.min(suggestions.length *70,500),
          zIndex:10,}}
        inputContainerStyle={styles.autocompleteInput}
        
         // Remove extra borders if needed
         // style={styles.inputContainer}
        data={suggestions}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchAddressSuggestions(text);
        }}
        placeholder={clubaddress||'Club Address'}
        placeholderTextColor="#9CA3AF"
        flatListProps={{
          keyboardShouldPersistTaps: "handled",
          keyExtractor: (_, index) => index.toString(),
          getItemLayout: (_, index) => ({
            length: 60,
            offset:10 * index,
            index,}),
          renderItem: ({ item }) => (
         

            <TouchableOpacity style={styles.item}
             onPress={() => handleSelect(item)}>
              <Text style={styles.input}>{item.display_name}</Text>
            </TouchableOpacity>
       

        ),


        }}

      />
      </View>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text)=>{setEmail(text);
                checkInputs();} }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="phone" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#9CA3AF"
              value={clubphone}
              onChangeText={(text)=>{setClubPhone(text);
                checkInputs();}
              }
              keyboardType="phone-pad"
            />
          </View>
          
          <TouchableOpacity style={styles.button} disabled={isLoading} onPress={handlePress}>
            {isLoading ? (
              <Text style={styles.buttonText}>Loading...</Text>
            ) : ( 
              <Text style={styles.buttonText}>Confirm</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('OwnerLogin')}>
            <Text style={styles.signIn}>Already have an account? Sign in</Text>
          </TouchableOpacity>
          
      </> )}
      {showText && (
        <>
          <Text style={styles.signIn}>Thank you for being interested in our project. We'll be contacting you soon!</Text></>
      )}
    </KeyboardAvoidingView> );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#1E1E1E',
    borderWidth:1,
    borderRadius:8,
    borderColor:'#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 1,
 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: '#1E1E1E',
    borderWidth:1,
    borderRadius: 8,
    borderColor:'#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  autocompleteContainer: {
    flex: 1,
    zIndex: 10, // Ensures dropdown appears above other components
  },
  autocompleteInput: {
    borderWidth: 0, // Removes extra border
    backgroundColor: "#1E1E1E",
  color:'#FFFFFF',
  fontSize: 16,
  },
  listContainer:{
    height:'300%',
    zIndex:10,
    
  },


  inputContainerAutocomplete:{
    flexDirection:'row',
    alignItems:'baseline',
    width: '80%',
    height:50,
    backgroundColor: '#1E1E1E',
    zIndex: 100,
    borderWidth:1,
    borderRadius: 8,
    borderColor:'#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 16,

  
  },

  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    alignItems:'center',
    color: '#FFFFFF',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#5500FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signIn: {
    width:'80%',
    color: '#FFFFFF',
    alignItems:'center',
    textAlign:'center',
    marginBottom:40,
    marginTop: 16,
  },
});
  
  