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
        value: 'M'
    },
    {
        id: 'F',
        label: '',
        value: 'F'
    },
    {
        id: 'O',
        label: '',
        value: 'O'
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
        style={styles.pageContainer}
      >
          <Image
            source={require('@/assets/nightmi_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.inputContainer}>
            <Feather name="mail" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => {setCurrentPage(1)}} disabled={isLoading}>
            {isLoading ? (
              <Text style={styles.buttonText}>Loading...</Text>
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signIn}>Already have an account? Sign in</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }else if(currentPage === 1){
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.pageContainer}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} horizontal={false}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => {setCurrentPage(0)}} disabled={isLoading}>
            <Feather name="chevron-left" size={40} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.secondPageInputContainer}>
            <Image
              source={require('@/assets/nightmi_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.usernameContainer} >
              <Feather name="user" size={70} color="#9CA3AF" style={styles.usernameIcon} />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Value"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.dobContainer} >
              <View style={styles.dateInputContainer}>
                <Text style={styles.standardText}>Date of Birth:</Text>
                <TouchableOpacity onPress={showDatepickerDatepicker} style={styles.dateInputButton}>
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
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
                  <TouchableOpacity onPress={confirmDate} style={styles.confirmButton}>
                      <Text style={styles.dateText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.otherInfoContainer} >
              <View style={styles.halfColumnContainer}>
                <Text style={styles.standardText}>Country:</Text>
                <View style={styles.inputContainer}>

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
                      <TouchableOpacity style={styles.borderlessButton} onPress={() => openCountryPickerForTheFirstTime()}>
                        <Text style={styles.inputLabel}>Select country </Text>
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
                  
                <View style={styles.genderButtonLabelContainer}>
                  {//gender labels
                  }
                  <FontAwesome name="mars" size={24} color="#9CA3AF" />
                  <FontAwesome name="venus" size={24} color="#9CA3AF" />
                  <FontAwesome name="genderless" size={24} color="#9CA3AF" />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    // borderWidth: 2,
    // borderColor: 'red',
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    padding: 0,
    // borderWidth: 2,
    // borderColor: 'green',
  },
  logo: {
    width: 200,
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width: '100%',
    height: 50,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 20,
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  icon: {
  },
  usernameIcon: {
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#A78BFA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  goBackButton: {
    width: 40,
    height: 40,
    backgroundColor: '#A78BFA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signIn: {
    color: '#A78BFA',
    marginTop: 16,
  },
  secondPageInputContainer: {
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
  dobContainer: {
    width: '100%',
    height: 'auto',

  },
  dateInputButton: {
    width: '60%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#576171',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  datePickerContainer: {
    width: '100%',
    height: 'auto',
    backgroundColor: '##374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: '#A78BFA',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  otherInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  halfColumnContainer: {
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    gap: 5,
  },
  countryPicker: {
    width: '100%',
    height: 50,
    backgroundColor: '#444444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  container: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 17,
    textAlign: 'center',
    margin: 5,
  },
  instructions: {
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
    marginBottom: 0,
  },
  data: {
    maxWidth: 250,
    padding: 10,
    marginTop: 7,
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 2,
    color: 'black',
  },
  borderlessButton: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 20,
  },
  standardText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  genderFormContainer: {
    flexDirection: 'row',
    width: '50%',
  },
  genderButtonLabelContainer: {
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 16,
    paddingTop: 4,
  }

});