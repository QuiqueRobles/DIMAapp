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
import { useTranslation } from 'react-i18next'; // Add this import

interface FirstRegisterPhaseProps {
    goToSecondPage: () => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
}

const FirstRegisterPhase: React.FC<FirstRegisterPhaseProps> = (
    {goToSecondPage,email,setEmail,password,setPassword,confirmPassword,setConfirmPassword}) => {

    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<AppNavigationProp>();
    const { t } = useTranslation(); // Add translation hook

    return (
        <View style={styles.firstPageContainer}> 
            <View style={styles.fieldContainer}>
                <Text style={commonStyles.standardText}>{t('register.first_phase.email')}</Text>
                <View style={commonStyles.inputContainer}>
                    <Feather name="mail" size={24} color="#9CA3AF"  />
                    <TextInput testID="email-input"
                        style={commonStyles.textInput}
                        placeholder={t('register.first_phase.email_placeholder')}
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View> 
            </View>
            <View style={styles.fieldContainer}>
                <Text style={commonStyles.standardText}>{t('register.first_phase.password')}</Text>
                <View style={commonStyles.inputContainer}>
                    <Feather name="lock" size={24} color="#9CA3AF"/>
                    <TextInput testID="password-input"
                        style={commonStyles.textInput}
                        placeholder={t('register.first_phase.password_placeholder')}
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                <Text style={commonStyles.standardText}>{t('register.first_phase.confirm_password')}</Text>
                <View style={commonStyles.inputContainer}>
                    <Feather name="lock" size={24} color="#9CA3AF" />
                    <TextInput testID="confirm-password-input"
                    style={commonStyles.textInput}
                    placeholder={t('register.first_phase.password_placeholder')}
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    firstPageContainer: {
        paddingTop: 40,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        gap: 25,
    },
    fieldContainer:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        gap: 10,
    }
});

export default FirstRegisterPhase;