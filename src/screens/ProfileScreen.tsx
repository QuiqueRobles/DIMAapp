import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  StyleSheet,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '@/navigation';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import CountryFlag from "react-native-country-flag";
import countryCodes from 'country-codes-list';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
  date_of_birth: string;
  gender_id: string;
  country: string;
  profile_id: string;
}

const genderMap: { [key: string]: string } = {
  'not_specified': 'Not Specified',
  'male': 'Male',
  'female': 'Female',
  'other': 'Other',
};

const getGenderIcon = (gender: string) => {
  switch (gender) {
    case 'male':
      return 'mars';
    case 'female':
      return 'venus';
    case 'other':
      return 'transgender-alt';
    default:
      return 'genderless';
  }
};

const getCountryCode = (country: string) => {
  const myCountryCodesObject = countryCodes.customList('countryNameEn', '{countryCode}');
  return myCountryCodesObject[country] || 'ES';
};

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AppNavigationProp>();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setUserData({
          id: data.id,
          name: data.name,
          email: user.email!,
          profile_picture: data.profile_picture,
          date_of_birth: data.date_of_birth,
          gender_id: data.gender_id,
          country: data.country,
          profile_id: user.id,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load profile. Please try again.');
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
          .from('profiles')
          .update({ profile_picture: publicUrl })
          .eq('profile_id', userData?.profile_id);

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

  const renderProfileInfo = (label: string, value: string, type?: 'gender' | 'country') => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer}>
        {type === 'gender' && (
          <FontAwesome name={getGenderIcon(value.toLowerCase())} size={20} color="#A78BFA" style={styles.icon} />
        )}
        {type === 'country' && (
          <CountryFlag isoCode={getCountryCode(value)} size={20} style={styles.flag} />
        )}
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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

      <Text style={styles.name}>{userData?.name}</Text>
      <Text style={styles.email}>{userData?.email}</Text>

      {renderProfileInfo('Date of Birth', userData?.date_of_birth ? format(new Date(userData.date_of_birth), 'MMMM d, yyyy') : 'Not specified')}
      {renderProfileInfo('Gender', genderMap[userData?.gender_id || 'not_specified'], 'gender')}
      {renderProfileInfo('Country', userData?.country || 'Not specified', 'country')}

      <TouchableOpacity
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.editButton}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoContainer: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  flag: {
    width: 20,
    height: 20,
  },
  editButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  editButtonText: {
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
    top: 60,
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

