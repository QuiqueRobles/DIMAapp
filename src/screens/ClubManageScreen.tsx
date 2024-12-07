import React, { useState, useEffect } from 'react';
  import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    TextInput, 
    ActivityIndicator, 
    Alert, 
    StyleSheet,
    Platform
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Feather } from '@expo/vector-icons';
  import { supabase } from '@/lib/supabase';
  import { useNavigation } from '@react-navigation/native';
  import { AppNavigationProp } from '@/navigation';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import { Picker } from '@react-native-picker/picker';
  import * as ImagePicker from 'expo-image-picker';
  import { z } from 'zod';
  
  interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    favorite_club: string;
    date_of_birth: string;
    gender_id: string;
    country: string;
    profile_picture: string;
  }
  
  const genderOptions = [
    { label: 'Not Specified', value: 'not_specified' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];
  
  const countryOptions = [
    { label: 'Select Country', value: '' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Canada', value: 'CA' },
    // Add more countries as needed
  ];
  
  const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    favorite_club: z.string().optional(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    gender_id: z.string(),
    country: z.string(),
  });
  
  export default function ClubManage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation<AppNavigationProp>();
  
    useEffect(() => {
      fetchUserProfile();
    }, []);
  
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');
        //console.log('user:',user.id);
  
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('profile_id', user.id)
          .single();
  
        if (error) throw error;
        if (data){
          setUserData(data as UserProfile);
        } 
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleSave = async () => {
      if (!userData) return;
  
      try {
        const validatedData = userSchema.parse(userData);
        setLoading(true);
  
        const { error } = await supabase
          .from('users')
          .update(validatedData)
          .eq('id', userData.id);
  
        if (error) throw error;
  
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path) {
              newErrors[err.path[0]] = err.message;
            }
          });
          setErrors(newErrors);
        } else {
          console.error('Error updating user profile:', error);
          Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    const handleLogout = async () => {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            onPress: async () => {
              try {
                await supabase.auth.signOut();
                navigation.navigate('Login');
              } catch (error) {
                console.error('Error signing out:', error);
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              }
            },
            style: "destructive"
          }
        ]
      );
    };
  
    const handleImageUpload = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload an image.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (!result.canceled && result.assets[0].uri) {
        try {
          setLoading(true);
          const ext = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf(".") + 1);
          const fileName = `${userData?.id}-${Date.now()}.${ext}`;
          const filePath = `${fileName}`;
  
          const formData = new FormData();
          formData.append('file', {
            uri: result.assets[0].uri,
            name: fileName,
            type: `image/${ext}`
          } as any);
  
          const { error: uploadError } = await supabase.storage
            .from('user_images')
            .upload(filePath, formData);
  
          if (uploadError) throw uploadError;
  
          const { data: { publicUrl } } = supabase.storage
            .from('user_images')
            .getPublicUrl(filePath);
  
  
          const { error: updateError } = await supabase
            .from('users')
            .update({ profile_picture: publicUrl })
            .eq('id', userData?.id);
  
          if (updateError) throw updateError;
  
          setUserData(prev => prev ? { ...prev, profile_picture: publicUrl } : null);
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
  
    const renderDatePicker = () => (
      <DateTimePicker
        value={userData?.date_of_birth ? new Date(userData.date_of_birth) : new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate && userData) {
            setUserData({
              ...userData,
              date_of_birth: selectedDate.toISOString().split('T')[0],
            });
          }
        }}
      />
    );
  
    const renderField = (key: keyof UserProfile, label: string, placeholder: string) => (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          value={userData?.[key] as string}
          onChangeText={(text) => setUserData(prev => prev ? { ...prev, [key]: text } : null)}
          placeholder={placeholder}
          placeholderTextColor="#666"
          style={[styles.input, !isEditing && styles.disabledInput]}
          editable={isEditing}
        />
        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
      </View>
    );
  
    const renderContent = () => (
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: userData?.profile_picture || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity 
            onPress={handleImageUpload}
            style={styles.cameraButton}
          >
            <Feather name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
  
        <Text style={styles.title}>
          {isEditing ? 'Edit Profile' : userData?.name || 'User Profile'}
        </Text>
  
        {renderField('name', 'Name', 'Enter your name')}
        {renderField('email', 'Email', 'Enter your email')}
        {renderField('phone', 'Phone', 'Enter your phone number')}
        {renderField('favorite_club', 'Favorite Club', 'Enter your favorite club')}
  
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => isEditing && setShowDatePicker(true)}
            style={[styles.input, !isEditing && styles.disabledInput]}
          >
            <Text style={styles.dateText}>
              {userData?.date_of_birth || 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && renderDatePicker()}
        </View>
  
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={userData?.gender_id}
            onValueChange={(itemValue) => 
              setUserData(prev => prev ? { ...prev, gender_id: itemValue } : null)
            }
            enabled={isEditing}
            style={[styles.picker, !isEditing && styles.disabledPicker]}
          >
            {genderOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} color={isEditing ? '#FFFFFF' : '#666666'} />
            ))}
          </Picker>
        </View>
  
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Country</Text>
          <Picker
            selectedValue={userData?.country}
            onValueChange={(itemValue) => 
              setUserData(prev => prev ? { ...prev, country: itemValue } : null)
            }
            enabled={isEditing}
            style={[styles.picker, !isEditing && styles.disabledPicker]}
          >
            {countryOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} color={isEditing ? '#FFFFFF' : '#666666'} />
            ))}
          </Picker>
        </View>
  
        <TouchableOpacity
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        ) : (
          <>
            {renderContent()}
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Feather name="log-out" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1F2937',
    },
    scrollView: {
      flex: 1,
      padding: 16,
    },
    profileImageContainer: {
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 16,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: '33%',
      backgroundColor: '#7C3AED',
      borderRadius: 20,
      padding: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 24,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#9CA3AF',
      marginBottom: 4,
    },
    input: {
      backgroundColor: '#374151',
      borderRadius: 8,
      padding: 12,
      color: '#FFFFFF',
      fontSize: 16,
    },
    disabledInput: {
      backgroundColor: '#1F2937',
      color: '#6B7280',
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      marginTop: 4,
    },
    picker: {
      backgroundColor: '#374151',
      borderRadius: 8,
      color: '#FFFFFF',
    },
    disabledPicker: {
      backgroundColor: '#1F2937',
      color: '#6B7280',
    },
    dateText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    button: {
      backgroundColor: '#7C3AED',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 24,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: '#EF4444',
      borderRadius: 30,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });
    