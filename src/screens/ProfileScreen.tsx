import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  favorite_club: string;
  attended_events: number;
  profile_picture: string;
  recent_activity: { event: string; date: string }[];
}

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AppNavigationProp>();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', '1')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUserData(data as UserProfile);
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (userData) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            favorite_club: userData.favorite_club,
          })
          .eq('id', userData.id);

        if (error) {
          throw error;
        }

        setIsEditing(false);
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
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

  const renderContent = () => (
    <ScrollView className="flex-1">
      <View className="items-center mt-8">
        <Image
          source={{ uri: userData?.profile_picture || 'https://via.placeholder.com/150' }}
          className="w-32 h-32 rounded-full"
        />
        <TouchableOpacity className="absolute bottom-0 right-1/3 bg-purple-600 rounded-full p-2">
          <Feather name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="px-6 mt-6">
        <Text className="text-white text-2xl font-bold text-center mb-6">
          {isEditing ? 'Edit Profile' : userData?.name || 'User Profile'}
        </Text>

        {['name', 'email', 'phone', 'favorite_club'].map((key) => (
          <View key={key} className="mb-4">
            <Text className="text-gray-400 text-sm mb-1 capitalize">
              {key.replace(/_/g, ' ')}
            </Text>
            {isEditing ? (
              <TextInput
                value={userData?.[key as keyof UserProfile] as string}
                onChangeText={(text) => setUserData(userData ? { ...userData, [key]: text } : null)}
                className="bg-gray-800 text-white p-3 rounded-md"
              />
            ) : (
              <Text className="text-white text-lg">{userData?.[key as keyof UserProfile] as string}</Text>
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-purple-600 py-3 px-6 rounded-full mt-6"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {userData?.recent_activity && (
        <View className="mt-8 px-6">
          <Text className="text-white text-xl font-semibold mb-4">Recent Activity</Text>
          {userData.recent_activity.map((activity, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <View className="bg-purple-600 rounded-full p-2 mr-3">
                <Feather name="activity" size={16} color="white" />
              </View>
              <View>
                <Text className="text-white text-base">{activity.event}</Text>
                <Text className="text-gray-400 text-sm">{new Date(activity.date).toLocaleDateString()}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#A78BFA" />
        </View>
      ) : (
        <>
          {renderContent()}
          <TouchableOpacity
            onPress={handleLogout}
            className="absolute top-4 right-4 bg-red-600 rounded-full p-3 shadow-lg"
          >
            <Feather name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}