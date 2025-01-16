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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
  gender_id: string;
  country: string;
  profile_id: string;
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
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  gender_id: z.string(),
  country: z.string(),
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
    if (!userData) return;

    try {
      const validatedData = userSchema.parse(userData);
      setLoading(true);

      const { error: profilesTableError } = await supabase
        .from('profiles')
        .update({
          name: validatedData.name,
          date_of_birth: validatedData.date_of_birth,
          gender_id: validatedData.gender_id,
          country: validatedData.country,
        })
        .eq('id', userData.id);

      if (profilesTableError) throw profilesTableError;

      const { error: authTableError } = await supabase.auth.updateUser({
        email: validatedData.email,
      });

      if (authTableError) throw authTableError;

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
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
        style={styles.input}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

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
          <Picker
            selectedValue={userData?.gender_id}
            onValueChange={(itemValue) => 
              setUserData(prev => prev ? { ...prev, gender_id: itemValue } : null)
            }
            style={styles.picker}
          >
            {genderOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} color="#FFFFFF" />
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
            style={styles.picker}
          >
            {countryOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} color="#FFFFFF" />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.button}
          disabled={loading}
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
    backgroundColor: '#1F2937',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 20,
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
    backgroundColor: '#374151',
    borderRadius: 8,
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
    backgroundColor: '#374151',
    borderRadius: 8,
    color: '#FFFFFF',
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
});
