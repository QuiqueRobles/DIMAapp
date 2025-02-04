import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppNavigationProp } from '@/navigation';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import CountryFlag from "react-native-country-flag";
import countryCodes from 'country-codes-list';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
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
  const countryVariations: { [key: string]: string } = {
    'usa': 'US',
    'united states': 'US',
    'united kingdom': 'GB',
    'great britain': 'GB',
  };

  const lowerCountry = country?.toLowerCase();
  if (countryVariations[lowerCountry]) {
    return countryVariations[lowerCountry];
  }

  const countryData = countryCodes.all().find(c => 
    c.countryNameEn?.toLowerCase() === lowerCountry
  );
  return countryData?.countryCode || 'ES';
};

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AppNavigationProp>();
  const { t } = useTranslation();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(t('profile.noUserFound'));

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      //console.log('data', data);
      //console.log('error', error);

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
      Alert.alert(t('profile.error'), t('profile.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirmation'),
      [
        { text: t('profile.cancel'), style: "cancel" },
        {
          text: t('profile.logout'),
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              //navigation.navigate('Login');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert(t('profile.error'), t('profile.failedToSignOut'));
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
      Alert.alert(t('profile.permissionRequired'), t('profile.allowPhotoLibraryAccess'));
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
        Alert.alert(t('profile.success'), t('profile.profilePictureUpdated'));
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert(t('profile.error'), t('profile.failedToUploadImage'));
      } finally {
        setLoading(false);
      }
    }
  };

  const renderProfileInfo = (label: string, value: string, type?: 'gender' | 'country') => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer} testID='info-value-container'>
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
          testID='camera-button'
          onPress={handleImageUpload}
          style={styles.cameraButton}
        >
          <Feather name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{userData?.name}</Text>
      <Text style={styles.email}>{userData?.email}</Text>

      {renderProfileInfo(t('profile.dateOfBirth'), userData?.date_of_birth ? format(new Date(userData.date_of_birth), 'MMMM d, yyyy') : t('profile.notSpecified'))}
      {renderProfileInfo(t('profile.gender'), genderMap[userData?.gender_id || 'not_specified'] || t('profile.notSpecified'), 'gender')}
      {renderProfileInfo(t('profile.country'), userData?.country || t('profile.notSpecified'), 'country')}

      <LanguageSelector />

      <TouchableOpacity
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.editButton}
        testID='edit-button'
      >
        <Text style={styles.editButtonText}>{t('profile.editProfile')}</Text>
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
            testID='logout-button'
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
    backgroundColor: '#121212',
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
    backgroundColor: '#5500FF',
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
    flexDirection: 'row',
    alignItems: 'center',
    width: ' 100%',
    height: 50,
    borderWidth:1,
    borderRadius: 8,
    borderColor:'#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 16,

    backgroundColor: '#151515',
  
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
 
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
    backgroundColor: '#5500FF',
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