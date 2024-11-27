import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '../../navigation';
import commonStyles from '@/styles/commonStyles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const navigation = useNavigation<AppNavigationProp>();

  const handleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.loginPageContainer}
    >
      
      <Image
        source={require('@/assets/nightmi_logo.png')}
        style={commonStyles.fullLogo}
        resizeMode="contain"
      />
      <View style={styles.loginFormContainer}>
        <View style={styles.fieldContainer}>
          <Text style={commonStyles.standardText}>Email</Text>
          <View style={commonStyles.inputContainer}>
            <Feather name="mail" size={24} color="#9CA3AF"/>
            <TextInput
              style={commonStyles.textInput}
              placeholder="Value"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={commonStyles.standardText}>Password</Text>
          <View style={commonStyles.inputContainer}>
            <Feather name="lock" size={24} color="#9CA3AF" />
            <TextInput
              style={commonStyles.textInput}
              placeholder="Value"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={commonStyles.primaryButton} onPress={handleSignIn} disabled={isLoading}>
        {isLoading ? (
          <Text style={commonStyles.primaryButtonText}>Loading...</Text>
        ) : (
          <Text style={commonStyles.primaryButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      <View style={styles.otherOptionsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={commonStyles.secondaryText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={commonStyles.textLink}>New here? Sign up!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('OwnerLogin')}>
          <Text style={commonStyles.secondaryText}>Are you an owner?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loginPageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 120,
    padding: 15,
    backgroundColor: '#1F2937',
  },
  loginFormContainer: {
    paddingTop: 40,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    gap: 25,
    minHeight: 400,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  fieldContainer:{
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    gap: 10,
  },
  otherOptionsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginTop: 16,
  },
});