import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '@/navigation';
import { useSession } from 'isOwner';
import { useClub } from '../../../src/context/EventContext';
import { useTranslation } from 'react-i18next'; // Add this import

export default function OwnerLoginScreen() {
  const { t } = useTranslation(); // Add translation hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {clubId, setClubId} = useClub()
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const navigation = useNavigation<AppNavigationProp>();
  const {isOwner, setisOwner} = useSession();
  console.log("Ownerr", isOwner);

  const getAuthenticatedUserId = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new Error(`Error fetching authenticated user: ${error.message}`);
      }
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      setClubId(user.id)
      return user.id;
    } catch (err) {
      return '';
    }
  };

  const handleOwnerSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setisOwner(true);
      const id = await getAuthenticatedUserId();
      setClubId(id);
    }
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
      <Text style={styles.title}>{t('owner_login.title')}</Text>
      <View style={styles.inputContainer}>
        <Feather name="mail" size={24} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={t('owner_login.email_placeholder')}
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
          placeholder={t('owner_login.password_placeholder')}
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleOwnerSignIn} disabled={isLoading}>
        {isLoading ? (
          <Text style={styles.buttonText}>{t('owner_login.loading')}</Text>
        ) : (
          <Text style={styles.buttonText}>{t('owner_login.sign_in')}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>{t('owner_login.back_to_user_login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('OwnerRegister')}>
        <Text style={styles.backToLogin}>{t('owner_login.register_as_owner')}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
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
  backToLogin: {
    color: '#FFFFFF',
    marginTop: 16,
  },
});