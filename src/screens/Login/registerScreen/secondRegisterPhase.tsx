import React, {useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '@/navigation';
import CountryPicker,{DARK_THEME} from 'react-native-country-picker-modal'
import { CountryCode, Country } from 'react-native-country-picker-modal/lib/types';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import { FontAwesome } from '@expo/vector-icons';
import commonStyles from '@/styles/commonStyles';

interface SecondRegisterPhaseProps {
    username: string;
    setUsername: (username: string) => void;
    dateOfBirth: Date;
    setDateOfBirth: (date: Date) => void;
    country: Country | undefined;
    setCountry: (country: Country) => void;
    gender: string;
    setGender: (gender:string) => void;
}


const SecondRegisterPhase: React.FC<SecondRegisterPhaseProps> = (
    {username, setUsername, dateOfBirth, setDateOfBirth, country, setCountry,gender,setGender}) => {

    //date of birth selection
    const [showDatepicker, setshowDatepicker] = useState(false);
    interface DatePickerEvent {
        type: string;
        nativeEvent: {
        timestamp: number;
        };
    }
    const onChange = (event: DatePickerEvent, selectedDate?: Date | undefined) => {
        const currentDate = selectedDate || dateOfBirth;
        setshowDatepicker(Platform.OS === 'ios');
        setDateOfBirth(currentDate);
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
    const [countryCode, setCountryCode] = useState<CountryCode>(country?.cca2 || 'US');
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



    return (
        <View style={styles.secondPageContainer}>
            <View style={styles.usernameContainer} >
              <Feather name="user" size={70} color="#9CA3AF"/>
              <Text style={commonStyles.standardText}>Username:</Text>
              <View style={commonStyles.inputContainer}>
                <TextInput
                  style={commonStyles.textInput}
                  placeholder="Value"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>
            <View style={styles.dobContainer} >
              <View style={styles.dateInputHeader}>
                <Text style={commonStyles.standardText}>Date of Birth:</Text>
                <TouchableOpacity onPress={showDatepickerDatepicker} style={styles.dateInputButton}>
                  <Text style={commonStyles.standardText}>{formatDate(dateOfBirth)}</Text>
                </TouchableOpacity>
              </View>
              {showDatepicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={dateOfBirth}
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
                  onPress={setGender}
                  selectedId={gender}
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
    );

}

const styles = StyleSheet.create({
    secondPageContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
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
});

export default SecondRegisterPhase;