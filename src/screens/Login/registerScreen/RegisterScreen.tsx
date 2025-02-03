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

export default function RegisterScreen() {

  //navigation between pages
  const [currentPage, setCurrentPage] = useState(0);
  

  //date of birth selection
  const [date, setDate] = useState(new Date());
  const [showDatepicker, setshowDatepicker] = useState(false);
  interface DatePickerEvent {
    type: string;
    nativeEvent: {
      timestamp: number;
    };
  }
  const onChange = (event: DatePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || date;
    setshowDatepicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const showDatepickerDatepicker = () => {
    setshowDatepicker(true);
  };
  const confirmDate = () => {
    setshowDatepicker(false);
  };
  const formatDate = (date: Date) => {
    const dateString = date.toDateString();
    const dateParts = dateString.split(' ');
    return `${dateParts[2]} ${dateParts[1]} ${dateParts[3]}`;
  };

  //country selection
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [country, setCountry] = useState<Country>();
  const [visible, setVisible] = useState<boolean>(false);
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const [countryButtonPressed, setCountryButtonPressed] = useState<boolean>(false);
  const openCountryPickerForTheFirstTime = () => {
    setCountryButtonPressed(true);
    setVisible(true);
  }
  const closePicker = () => {
    if (countryButtonPressed) {
      setCountryButtonPressed(false);
    }
    setVisible(false);
  }

  //gender selection
  const genderButtons: RadioButtonProps[] = useMemo(() => ([
    {
        id: 'M', 
        label: '',
        value: 'M',
        borderColor: '#9CA3AF',
    },
    {
        id: 'F',
        label: '',
        value: 'F',
        borderColor: '#9CA3AF',
    },
    {
        id: 'O',
        label: '',
        value: 'O',
        borderColor: '#9CA3AF',
    }
  ]), []);
  const [selectedGender, setSelectedGender] = useState<string | undefined>();

  //form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const navigation = useNavigation<AppNavigationProp>();


  if (currentPage === 0) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commonStyles.pageContainer}
      >
          <Image
            source={require('@/assets/nightmi_logo.png')}
            style={commonStyles.fullLogo}
            resizeMode="contain"
          />
          <View style={commonStyles.inputContainer}>
            <Feather name="mail" size={24} color="#9CA3AF"  />
            <TextInput
              style={commonStyles.textInput}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={commonStyles.inputContainer}>
            <Feather name="lock" size={24} color="#9CA3AF"/>
            <TextInput
              style={commonStyles.textInput}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={commonStyles.inputContainer}>
            <Feather name="lock" size={24} color="#9CA3AF" />
            <TextInput
              style={commonStyles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={commonStyles.primaryButton} onPress={() => {setCurrentPage(1)}} disabled={isLoading}>
            {isLoading ? (
              <Text style={commonStyles.primaryButtonText}>Loading...</Text>
            ) : (
              <Text style={commonStyles.primaryButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={commonStyles.textLink}>Already have an account? Sign in</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }else if(currentPage === 1){
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commonStyles.pageContainer}>
        <ScrollView style={commonStyles.scrollContainer} contentContainerStyle={commonStyles.scrollContent} horizontal={false}>
          <TouchableOpacity style={commonStyles.goBackButton} onPress={() => {setCurrentPage(0)}} disabled={isLoading}>
            <Feather name="chevron-left" size={40} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.secondPageContainer}>
            <Image
              source={require('@/assets/nightmi_logo.png')}
              style={commonStyles.fullLogo}
              resizeMode="contain"
            />
            <View style={styles.usernameContainer} >
              <Feather name="user" size={70} color="#9CA3AF"/>
              <View style={commonStyles.inputContainer}>
                <TextInput
                  style={commonStyles.textInput}
                  placeholder="Value"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.dobContainer} >
              <View style={styles.dateInputHeader}>
                <Text style={commonStyles.standardText}>Date of Birth:</Text>
                <TouchableOpacity onPress={showDatepickerDatepicker} style={styles.dateInputButton}>
                  <Text style={commonStyles.standardText}>{formatDate(date)}</Text>
                </TouchableOpacity>
              </View>
              {showDatepicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                    textColor='#FFFFFF'
                    locale="en-US"
                  />
                  <TouchableOpacity onPress={confirmDate} style={commonStyles.primaryButton}>
                      <Text style={commonStyles.standardText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.otherInfoContainer} >
              <View style={styles.countryFormContainer}>
                <Text style={commonStyles.standardText}>
                  Country:
                </Text>
                <View style={commonStyles.inputContainer}>

                  {(country || countryButtonPressed)  ?
                    (
                      <CountryPicker
                        {...{
                          allowFontScaling: true,
                          countryCode,
                          withFilter: true,
                          withFlag: true,
                          withCurrencyButton: false,
                          withCallingCodeButton: false,
                          withCountryNameButton: true,
                          withAlphaFilter: false,
                          withCallingCode: false,
                          withCurrency: false,
                          withEmoji: true,
                          withModal: true,
                          withFlagButton: true,
                          onSelect,
                          theme: DARK_THEME,
                          disableNativeModal: false,
                          preferredCountries: ['US', 'GB'],
                          modalProps: { visible },
                          onClose: () => closePicker(),
                          onOpen: () => setVisible(true),
                        }}
                      />
                    ) : (
                      <TouchableOpacity style={styles.countrySelectionButton} onPress={() => openCountryPickerForTheFirstTime()}>
                        <Text style={commonStyles.placeholderText}>Select country </Text>
                      </TouchableOpacity>
                    )
                  } 
                </View>
              </View>
              <View style={styles.genderFormContainer}>
                <RadioGroup
                  radioButtons={genderButtons}
                  onPress={setSelectedGender}
                  selectedId={selectedGender}
                  containerStyle={
                    {
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-end',
                      width: '50%',
                      height: '100%',
                      gap: 5,
                    }
                  }
                />
                  
                <View style={styles.genderLabelContainer}>
                  <FontAwesome name="mars" size={24} color="#9CA3AF" />
                  <FontAwesome name="venus" size={24} color="#9CA3AF" />
                  <FontAwesome name="genderless" size={24} color="#9CA3AF" />
                </View>
              </View>
            </View>
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
                    </>
                  )
                }
            </View>
            <TouchableOpacity style={commonStyles.primaryButton}>
              <Text style={commonStyles.primaryButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
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
  secondPageContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    borderRadius: 8,
    padding: 15,
    gap: 20,
  },
  usernameContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    gap: 20,
    borderRadius: 8,
  },
  dobContainer: {  //contains the button, the label and the picker
    width: '100%',
    height: 'auto',
    
  },
  dateInputHeader: {  //contains only the label and the button
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 20,
  },
  dateInputButton: {
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#576171',
    borderRadius: 8,
  },
  datePickerContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
  },
  countryFormContainer: {
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    alignItems: 'center',
    gap: 5,
  },
  countrySelectionButton: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  genderFormContainer: {
    flexDirection: 'row',
    width: '50%',
  },
  genderLabelContainer: {
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 16,
    paddingTop: 4,
  },
  dotsContainer:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
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