 
  import React, { useState, useEffect } from 'react';
  import { View, ScrollView, Text, TouchableOpacity, RefreshControl, Image, StyleSheet, Dimensions,Alert,Button,GestureResponderEvent} from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import { Feather } from '@expo/vector-icons';
  import { LinearGradient } from 'expo-linear-gradient';
  import { supabase } from '@/lib/supabase';
  import ClubHeader from '@/components/ClubHeader';
  import ClubDetails from '@/components/ClubDetails';
  import ClubEdit from '@/components/ClubEdit';
  import EventsList from '@/components/EventsList';
  import ReviewsList from '@/components/ReviewsList';
  import ErrorDisplay from '@/components/ErrorDisplay';
  import LoadingSpinner from '@/components/LoadingSpinner';
  import { AppNavigationProp, AppRouteProp } from '@/navigation';
  import { launchImageLibrary } from 'react-native-image-picker';
  import * as ImagePicker from 'expo-image-picker';
  const { width, height } = Dimensions.get('window');
  
  type RootStackParamList = {
    Home: undefined;
    Club: { clubId: string };
    Reviews: { clubId: string; clubName: string };
    Calendar: { clubId: string; clubName: string };
  };

  
  type ClubScreenRouteProp = RouteProp<RootStackParamList, 'Club'>;
  type ClubScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Club'>;
  

    interface Club {
      id: string;
      name: string;
      rating: number;
      num_reviews: number;
      address: string;
      image: string | null;
      category: string | null;
      music_genre: string | null;
      attendees: number;
      opening_hours: string;
      dress_code: string | null;
      description: string | null;}
  
  interface Event {
    id: string;
    created_at: string;
    club_id: string;
    date: string;
    name: string | null;
    price: number | null;
    description: string | null;
    image: string | null;
  }
  
  interface Review {
    id: string;
    created_at: string;
    user_id: string;
    club_id: string;
    text: string | null;
    num_stars: number;
  }
  
  const HomeOwner: React.FC = () => {
    const [club, setClub] = useState<Club | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState(false);
  
    const navigation = useNavigation<AppNavigationProp>();
    const [clubId,setClubId]=useState("0"); 
    const [edit,setEdit]=useState(false);
      

    const getAuthenticatedUserId = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          throw new Error(`Error fetching authenticated user: ${error.message}`);
        }
        
        if (!user) {
          throw new Error('No authenticated user found');
        }
        setClubId(user.id)
        return user.id; // Return the user's ID
      } catch (err) {
        return 123232; // Return null if there's an error
      }
    };
    
   
    const fetchClubData = async () => {
      try {
        setLoading(true);
        setError(null);
       const clubId=await getAuthenticatedUserId();
     
        const { data: clubData, error: clubError } = await supabase
          .from('club')
          .select('*')
          .eq('club_id', clubId)
          .single();
  
        if (clubError) throw new Error('Failed to fetch club data');
        setClub(clubData);
       
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('review')
          .select('*')
          .eq('club_id', clubId)
          .order('created_at', { ascending: false })
          .limit(5);
  
        if (reviewsError) throw new Error('Failed to fetch reviews');
        setReviews(reviewsData || []);
  
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    const handleImageUpload = async () => {
      //const clubId=await getAuthenticatedUserId();
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
          const fileName = `${club?.id}-${Date.now()}.${ext}`;
          const filePath = `${fileName}`;
  
          const formData = new FormData();
          formData.append('file', {
            uri: result.assets[0].uri,
            name: fileName,
            type: `image/${ext}`
          } as any);
  
          const { error: uploadError } = await supabase.storage
            .from('clubs-image')
            .upload(filePath, formData);
  
          if (uploadError) throw uploadError;
  
          const { data: { publicUrl } } = supabase.storage
            .from('clubs-image')
            .getPublicUrl(filePath);
           alert(publicUrl);
          const { error: updateError } = await supabase
            .from('club') 
            .update({'image': publicUrl })
            .eq('club_id',clubId);
          
        
          if (updateError) throw updateError;
  
          setClub(prev => prev ? { ...prev, image: publicUrl } : null);
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
 const saveChanges = async () => {
    try {
      const { data, error } = await supabase
        .from('club')
        .update({
          address: club.address,
          opening_hours: club.opening_hours,
          dress_code: club.dress_code,
          music_genre: club.music_genre,
          description: club.description,
        })
        .eq('club_id', clubId);// Match by the unique club ID 
        if (error) {
            throw error;
          }
    
          Alert.alert('Success', 'Club details updated successfully.');
          setEdit(!edit);
        } catch (error) {
          Alert.alert('Error', 'Failed to update club details.');
          console.error(error);
        }
        
      };
         
    
  
    useEffect(() => {
      fetchClubData();
    }, [clubId]);
  
    const handleRefresh = () => {
      setRefreshing(true);
      fetchClubData();
    };
  
  
    if (error) {
      return <ErrorDisplay message={error} />;
    }
  
    if (!club) {
      return <ErrorDisplay message="Club not found" />;
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#A78BFA" />
          }
        >
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImageUpload} style={styles.imageContainer}>
                <View style={styles.imageOverlay} />
  
                  <Image source={{ uri: club.image || 'https://via.placeholder.com/400x200?text=No+Image'}}
                   style={styles.image} 
                  />

              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                style={styles.imageGradient}
                />
                <Text style={styles.seeAllText}>Tap to Change Image</Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}
              style={styles.backButton}
              
            >
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.clubType}>
              <Text style={styles.clubTypeText}>{club.category || 'Nightclub'}</Text>
            </View>
          </View>
          <View style={styles.content}>
            <ClubHeader club={club} />
            <View>
            <TouchableOpacity onPress={edit? (() => {
    saveChanges().catch((error) => console.error('Error:', error));
  }):(()=>setEdit(!edit))}
              style={styles.EditButton} >
  <Text style={styles.seeAllText}>{edit ? 'Save' : 'Edit'}</Text>
</TouchableOpacity>
      {edit ? (
        <ClubEdit club={club} setClub={setClub}/>
      ) : (
        <ClubDetails club={club} />
      )}
    </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Calendar', { clubId: club.id, clubName: club.name })}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {events.length > 0 ? (
                <EventsList 
                  events={events} 
                  clubName={club.name}
                  clubId={club.id}
                />
              ) : (
                <Text style={styles.noEventsText}>No upcoming events</Text>
              )}
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Reviews', { clubId: club.id, clubName: club.name })}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {reviews.length > 0 ? (
                <ReviewsList reviews={reviews.slice(0, 3)} />
              ) : (
                <Text style={styles.noReviewsText}>No reviews yet</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1F2937',
    },
    scrollContent: {
      flexGrow: 1,
    },
    imageContainer: {
      height: height * 0.4,
      width: width,
      position: 'relative',
      backgroundColor: '#1F2937',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    
    },
    imagee: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    imageGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '50%',
    },
    backButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 20,
      padding: 8,
    },
    clubType: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: 'rgba(167, 139, 250, 0.8)',
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    clubTypeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1F2937',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
    },
    section: {
      marginTop: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    seeAllText: {
      fontSize: 14,
      color: '#A78BFA',
      fontWeight: '600',
    },
    noEventsText: {
      color: '#9CA3AF',
      fontSize: 16,
      textAlign: 'center',
    },
    noReviewsText: {
      color: '#9CA3AF',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 16,
    },
    EditButton: {
      width: '30%',
      color:'#9CA3AF',
      overflow: 'hidden',
      borderRadius: 8,
    },
  });
  
  export default HomeOwner;