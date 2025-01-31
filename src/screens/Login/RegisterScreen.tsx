// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
// import { useSupabaseClient } from '@supabase/auth-helpers-react';
// import { useNavigation } from '@react-navigation/native';
// import { Feather } from '@expo/vector-icons';
// import { AppNavigationProp } from '../../navigation';

// export default function RegisterScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const supabase = useSupabaseClient();
//   const navigation = useNavigation<AppNavigationProp>();

//   const handleSignUp = async () => {
//     if (password !== confirmPassword) {
//       alert("Passwords don't match");
//       return;
//     }

//     setIsLoading(true);
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     setIsLoading(false);
//     if (error) {
//       alert(error.message);
//     } else {
//       alert('Check your email for the confirmation link');
//       navigation.navigate('Login');
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <Image
//         source={require('../../../assets/nightmi_logo.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />
//       <View style={styles.inputContainer}>
//         <Feather name="mail" size={24} color="#9CA3AF" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#9CA3AF"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Feather name="lock" size={24} color="#9CA3AF" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#9CA3AF"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Feather name="lock" size={24} color="#9CA3AF" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Confirm Password"
//           placeholderTextColor="#9CA3AF"
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           secureTextEntry
//         />
//       </View>
//       <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
//         {isLoading ? (
//           <Text style={styles.buttonText}>Loading...</Text>
//         ) : (
//           <Text style={styles.buttonText}>Sign Up</Text>
//         )}
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.signIn}>Already have an account? Sign in</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   logo: {
//     width: 200,
//     height: 100,
//     marginBottom: 40,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     height: 50,
//     backgroundColor: '#374151',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#FFFFFF',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#A78BFA',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 16,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   signIn: {
//     color: '#A78BFA',
//     marginTop: 16,
//   },
// });