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
    Platform,
    KeyboardAvoidingView,
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Feather } from '@expo/vector-icons';
  import { supabase } from '@/lib/supabase';
  import { useNavigation } from '@react-navigation/native';
  import { AppNavigationProp } from '@/navigation';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import { Picker } from '@react-native-picker/picker';
  import * as ImagePicker from 'expo-image-picker';
  import commonStyles from '@/styles/commonStyles';
  import { z } from 'zod';
  
  interface ClubProfile {
    club_id: string;
    name: string;
    image: string;
    category: string;
    description: string;
    opening_hours: string;
    dress_code: string;
    music_genre: string;
    rating: string;
    num_reviews: string;
    attendees: string;
  }

  const clubSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    category: z.string().min(2, 'Category must be at least 2 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    opening_hours: z.string().regex(/^\d{2}:\d{2} - \d{2}:\d{2}$/, 'Invalid opening hours format'),
    dress_code: z.string().min(2, 'Dress code must be at least 2 characters'),
    music_genre: z.string().min(2, 'Music genre must be at least 2 characters'),
    attendees: z.string().regex(/^\d+$/, 'Invalid number of attendees'),
  });

  
  
  // const clubSchema = z.object({
  //   name: z.string().min(2, 'Name must be at least 2 characters'),
  //   email: z.string().email('Invalid email address'),
  //   phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  //   favorite_club: z.string().optional(),
  //   date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  //   gender_id: z.string(),
  //   country: z.string(),
  // });
  
  export default function ClubManage() {
    const [isEditing, setIsEditing] = useState(false);
    const [clubData, setClubData] = useState<ClubProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation<AppNavigationProp>();
  
    useEffect(() => {
      fetchClubProfile();
    }, []);
  
    const fetchClubProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');
        console.log('user:',user.id);
  
        const { data, error } = await supabase
          .from('club')
          .select('club_id, name, image, category, description, opening_hours, dress_code, music_genre, rating, num_reviews, attendees')
          .eq('club_id', user.id)
          .single();
  
        if (error) throw error;
        if (data){
          const clubData: ClubProfile = {
            ...data,
            rating: data.rating.toString(),
            num_reviews: data.num_reviews.toString(),
            attendees: data.attendees.toString(),
          };
          setClubData(clubData); 
          
        } 
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
        //console.log("club data:",clubData);
      }
    };
  

    const handleSave = async () => {
      
      if (!clubData) return;
      try {

        const validatedData = clubSchema.parse(clubData);
        setLoading(true);
  
        const { error } = await supabase
          .from('club')
          .update(validatedData)
          .eq('club_id', clubData.club_id);
  
        if (error) throw error;
        console.log('validatedData:',validatedData);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        console.log('error:',error);
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path) {
              newErrors[err.path[0]] = err.message;
            }
          });
          setErrors(newErrors);
        } else {
          console.error('Error updating club profile:', error);
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
          const fileName = `${clubData?.club_id}-${Date.now()}.${ext}`;
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
            .eq('id', clubData?.club_id);
  
          if (updateError) throw updateError;
  
          setClubData(prev => prev ? { ...prev, profile_picture: publicUrl } : null);
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
  
  
    const renderField = (key: keyof ClubProfile, label: string, placeholder: string) => (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          value={clubData?.[key] as string}
          onChangeText={(text) => setClubData(prev => prev ? { ...prev, [key]: text } : null)}
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
            source={{ uri: clubData?.image || 'https://via.placeholder.com/150' }}
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
          {isEditing ? 'Edit Profile' : clubData?.name || 'User Profile'}
        </Text>
  
        {renderField('name', 'Name', 'Enter your name')}
        {renderField('category', 'Category', 'Enter your email')}
        {renderField('opening_hours', 'Opening Hours', 'Enter new opening hours')}
        {renderField('description', 'Description', 'Enter your phone number')}
        {renderField('attendees', 'Attendees', 'Enter your favorite club')}
        {renderField('music_genre', 'Music Genre', 'Enter your favorite club')}
        {renderField('dress_code', 'Dress Code', 'Enter your date of birth')}
        
        
  
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
      <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={commonStyles.pageContainer}>
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
      </KeyboardAvoidingView>
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
    