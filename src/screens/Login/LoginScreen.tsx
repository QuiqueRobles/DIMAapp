import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '../../navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from 'isOwner';
import LanguageSelector2 from '@/components/LanguageSelector2';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = useSupabaseClient();
  const navigation = useNavigation<AppNavigationProp>();
  const { isOwner, setisOwner } = useSession();
  const { t } = useTranslation(); // Initialize useTranslation

  const handleSignIn = async () => {
    if (!email || !password) {
      alert(t('login.enterEmailPassword')); // Translated alert
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setisOwner(false);

    setIsLoading(false);
    if (error) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#1D1E1D', '#1D1E1D', '#1D1E1D']}
      style={styles.gradient}
      locations={[0, 0.3, 1]}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <StatusBar barStyle="light-content" />
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* Language Selector */}
            <LanguageSelector2 />

            <Image
              source={require('@/assets/nightmi_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.formContainer}>
              <Text style={styles.label}>{t('login.email')}</Text> {/* Translated label */}
              <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('login.enterEmail')} // Translated placeholder
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.label}>{t('login.password')}</Text> {/* Translated label */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('login.enterPassword')} // Translated placeholder
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.signInButton, (!email || !password) && styles.disabledButton]}
                onPress={handleSignIn}
                disabled={isLoading || !email || !password}
              >
                <LinearGradient
                  colors={['#5500FF', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>{t('login.signIn')}</Text> 
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.optionText}>{t('login.forgotPassword')}</Text> {/* Translated text */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
  <Text style={styles.optionText}>
    {t('login.newHere')} <Text style={[styles.optionText, styles.highlightText]}>{t('login.signUp')}</Text>
  </Text>
</TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('OwnerLogin')}>
                  <Text style={styles.optionText}>{t('login.areYouOwner')}</Text> {/* Translated text */}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.15,
    marginBottom: 40,
    marginTop: 80,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    alignItems:'center',
    alignSelf:'center',
  
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
    alignSelf:'center',
  
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  signInButton: {
    width: '80%',
    marginTop: 20,
    overflow: 'hidden',
    borderRadius: 8,
    alignItems:'stretch',
    alignSelf:'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  highlightText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});