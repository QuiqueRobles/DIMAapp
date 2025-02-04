/*
  import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AppNavigationProp } from '@/navigation';
import * as Linking from 'expo-linking';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const navigation = useNavigation<AppNavigationProp>();

 useEffect(() => {
  const handleDeepLink = (url: string | null) => {
    if (!url) return;

    const parsed = Linking.parse(url);
    console.log('Parsed URL:', parsed);

    if (parsed.queryParams?.token) {
      const token = parsed.queryParams.token;
      if (typeof token === 'string') {
        console.log('Token found:', token);
        setToken(token);
        // Navigate directly to ResetPassword screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'ResetPassword' }],
        });
      }
    }
  };

  // Handle both cold and warm starts
  Linking.getInitialURL()
    .then(url => {
      handleDeepLink(url);
      if (url) navigation.navigate('ResetPassword');
    })
    .catch(console.error);

  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
    navigation.navigate('ResetPassword');
  });

  return () => subscription.remove();
}, [navigation]);

const handleResetPassword = async () => {
  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords don't match");
    return;
  }

  if (!token) {
    Alert.alert("Error", "No token found");
    return;
  }

  setIsLoading(true);
  try {
    // Attempt to set the session with the recovery token.
    // (This is a workaround and may not be officially supported.)
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token, // Note: Using the same token for both is hacky.
    });
    if (sessionError) {
      console.error("Session error:", sessionError);
      Alert.alert("Error", sessionError.message);
      return;
    }

    // Now that we (hopefully) have a session, update the password.
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Password reset successfully!");
      navigation.navigate('Login');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    Alert.alert("Error", "Failed to reset password");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image
        source={require('@/assets/nightmi_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Reset Password</Text>
      <View style={styles.inputContainer}>
        <Feather name="lock" size={24} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Feather name="lock" size={24} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
        {isLoading ? (
          <Text style={styles.buttonText}>Resetting...</Text>
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>Back to Login</Text>
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
    width: '100%',
    height: 50,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    color: '#A78BFA',
    marginTop: 16,
  },
}); */