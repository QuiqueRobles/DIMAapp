import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '../../navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { add } from 'date-fns';

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
          phone: clubphone,
          email: email,
        },
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
          <View style={styles.inputContainer}>
            <Feather name="map" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Club address"
              placeholderTextColor="#9CA3AF"
              value={clubaddress}
              onChangeText={(text)=>{setClubAddress(text);
                checkInputs();} }
              keyboardType="email-address"
              autoCapitalize="none"
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
  
  