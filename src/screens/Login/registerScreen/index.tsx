import React, {useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, PixelRatio } from 'react-native';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '@/navigation';
import CountryPicker,{DARK_THEME} from 'react-native-country-picker-modal'
import { CountryCode, Country } from 'react-native-country-picker-modal/lib/types';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import { FontAwesome } from '@expo/vector-icons';
import commonStyles from '@/styles/commonStyles';
import SecondRegisterPhase from '@/screens/Login/registerScreen/secondRegisterPhase';
import FirstRegisterPhase from '@/screens/Login/registerScreen/firstRegisterPhase';


export default function RegisterScreen() {

  //navigation between pages
  const [currentPage, setCurrentPage] = useState(0);
  
  //backend
  const supabase = useSupabaseClient();

  //form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<AppNavigationProp>();
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [country, setCountry] = useState<Country>();
  const [gender, setGender] = useState('');


  const handleRegister = async () => {

    if (!email || !password || !confirmPassword) {
      alert('Please enter all fields');
      setCurrentPage(0);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setCurrentPage(0);
      return;
    }

    if(!username || !dateOfBirth || !country){
      alert('Please enter all fields');
      setCurrentPage(1);
      return;
    }

    if (username.length <= 8 || username.length >= 20) {
      alert('Username must be between 8 and 20 characters');
      setCurrentPage(1);
      return;
    }


    try{
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if(authError) throw authError;


      const userId = authData.user?.id;
      if (!userId) {
        throw new Error('User ID is null');
      }

      const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0];

      const {data: tableUserData, error: tableUserError} = await supabase.from('users').insert([
        {
          user_id: userId,
          isClub: false,
        }
      ]);

      if(tableUserError){
        throw tableUserError;
      }

      const {data: tableProfileData, error: tableProfileError} = await supabase.from('profiles').insert([
        {
          profile_id: userId,
          name: username,
          date_of_birth: formattedDateOfBirth,
          country: country?.name,
        }
      ]);


      if(tableProfileError){
        throw tableProfileError;
      }


    }catch(error: any){
      alert(error.message);
      setCurrentPage(0);
    }
    

    

  };

  const handleSubmit = () => {
    if(currentPage == 0){
      setCurrentPage(1);
    }else{
      handleRegister();
    }
  }


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={commonStyles.pageContainer}>
      <ScrollView style={commonStyles.scrollContainer} contentContainerStyle={commonStyles.scrollContent} horizontal={false}>
        {currentPage == 1 && 
          (
            <TouchableOpacity style={commonStyles.goBackButton} onPress={()=>{setCurrentPage(0)}} disabled={isLoading}>
              <Feather name="chevron-left" size={40} color="#FFFFFF" />
            </TouchableOpacity>
          )
        }
        <Image
            source={require('@/assets/nightmi_logo.png')}
            style={commonStyles.fullLogo}
            resizeMode="contain"
        />
        <View style={styles.innerPageContainer}>
          {(currentPage == 1) ?
            (
              <SecondRegisterPhase 
                username={username}
                setUsername={setUsername}
                dateOfBirth={dateOfBirth}
                setDateOfBirth={setDateOfBirth}
                country={country}
                setCountry={setCountry}
                gender={gender}
                setGender={setGender}
              />
            ) : (
              <FirstRegisterPhase 
                goToSecondPage={()=>{setCurrentPage(1)}}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
              />
            )
          }
        </View>
        <View style={styles.dotsContainer}>
            {(currentPage == 1) ?
              (
                <>
                  <View style={styles.smallCircle}></View>
                  <View style={styles.smallCircle}>
                    <View style={styles.fullDot}></View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.smallCircle}>
                    <View style={styles.fullDot}></View>
                  </View>
                  <View style={styles.smallCircle}></View>
                </>
              )
            }
        </View>
        <TouchableOpacity style={commonStyles.primaryButton} onPress={()=>{handleSubmit()}}>
          <Text style={commonStyles.primaryButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[commonStyles.textLink,{marginTop:20}]}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  
}

const styles = StyleSheet.create({
    innerPageContainer:{
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: 400,
    },
    dotsContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        height: 50,
    },
    smallCircle:{
        width: 16,
        height: 16,
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: '#9CA3AF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullDot:{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#9CA3AF'
    }

});