import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  ScrollView, 
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
import { z } from 'zod';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
  gender_id: string;
  country: string;
  countryCode: CountryCode;
  profile_id: string;
}

const genderOptions = [
  { label: '🚻 Not Specified', value: 'not_specified' },
  { label: '♂ Male', value: 'male' },
  { label: '♀ Female', value: 'female' },
  { label: '⚧ Other', value: 'other' },
];

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  gender_id: z.string(),
  country: z.string(),
  countryCode: z.string(),
});

export default function EditProfileScreen() {
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
          date_of_birth: data.date_of_birth,
          gender_id: data.gender_id,
          country: data.country,
          countryCode: data.country_code || 'US',
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

  const handleSave = async () => {
    console.log('userData', userData);
    if (!userData) return;

    try {
      const validatedData = userSchema.parse(userData);
      setLoading(true);
    
      console.log('validatedData', validatedData);

      const { error: profilesTableError } = await supabase
        .from('profiles')
        .update({
          name: validatedData.name,
          date_of_birth: validatedData.date_of_birth,
          gender_id: validatedData.gender_id,
          country: validatedData.country,
          country_code: validatedData.countryCode,
        })
        .eq('id', userData.id);

      console.log('profilesTableError', profilesTableError);

      if (profilesTableError) throw profilesTableError;

      const { error: authTableError } = await supabase.auth.updateUser({
        email: validatedData.email,
      });

      if (authTableError) throw authTableError;

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('error', error);
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

  const renderDatePicker = () => (
    <DateTimePicker
      value={userData?.date_of_birth ? new Date(userData.date_of_birth) : new Date()}
      mode="date"
      display="default"
      style={styles.input}
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
        style={styles.input}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const onSelectCountry = (country: Country) => {
    setUserData(prev => prev ? { ...prev, country: country.name, countryCode: country.cca2 } : null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        {renderField('name', 'Name', 'Enter your name')}
        {renderField('email', 'Email', 'Enter your email')}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text style={styles.dateText}>
              {userData?.date_of_birth || 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && renderDatePicker()}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={userData?.gender_id}
              onValueChange={(itemValue) => 
                setUserData(prev => prev ? { ...prev, gender_id: itemValue } : null)
              }
              style={styles.picker}
            >
              {genderOptions.map((option) => (
                <Picker.Item 
                  key={option.value} 
                  label={option.label} 
                  value={option.value}
                  color="#FFFFFF" // Changed from #151515 to white
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Country</Text>
          <CountryPicker
            countryCode={userData?.countryCode as CountryCode}
            withFilter
            withFlag
            withCountryNameButton
            withAlphaFilter
            withCallingCode={false}
            withEmoji
            onSelect={onSelectCountry}
            containerButtonStyle={styles.countryPickerButton}
            theme={{
              primaryColor: '#FFFFFF',
              primaryColorVariant: '#7C3AED',
              backgroundColor: '#151515',
              onBackgroundTextColor: '#FFFFFF',
              fontSize: 16,
              fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
              filterPlaceholderTextColor: '#9CA3AF',
              activeOpacity: 0.7,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.button}
          disabled={loading}
          testID='save-button'
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  backButton: {
    marginBottom: 20,
    backgroundColor:"#5500FF"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  picker: {
    backgroundColor: '#151515',
    borderRadius: 3,
    color: '#FFFFFF',
    borderWidth:1,
    borderColor:'#FFFFFF',
    justifyContent: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,

  },
  countryPickerButton: {
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'#FFFFFF',

  },
  button: {
    backgroundColor: '#5500FF',
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
});

