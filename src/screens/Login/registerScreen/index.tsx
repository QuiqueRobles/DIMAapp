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
  
  const [selectedGender, setSelectedGender] = useState<string | undefined>();

  //form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const navigation = useNavigation<AppNavigationProp>();


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
              <SecondRegisterPhase />
            ) : (
              <FirstRegisterPhase goToSecondPage={()=>{setCurrentPage(1)}}/>
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
        <TouchableOpacity style={commonStyles.primaryButton} onPress={()=>{setCurrentPage(1)}}>
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