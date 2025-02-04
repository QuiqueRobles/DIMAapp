import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, Text } from 'react-native';
import ProfileScreen from '@/screens/ProfileScreen/ProfileScreen';


jest.mock('expo-image-picker', () => {
  return {
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
    launchImageLibraryAsync: jest.fn().mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://dummy-image.jpg' }],
    }),
    MediaTypeOptions: { Images: 'Images' },
  };
});

jest.mock('@/lib/supabase', () => {
    const mockStorageBuilder = {
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/dummy.jpg' } }),
    };

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upload: jest.fn().mockReturnThis(),
      getPublicUrl: jest.fn().mockReturnThis(),
    };
  
    return { 
      supabase: { 
        from: jest.fn(() => mockQueryBuilder),
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { 
                    user: { id: 'test-user-id' },
                },
                error: null,
            }),
            signOut: jest.fn().mockReturnThis(),
        },
        storage: {
            from: jest.fn(() => mockStorageBuilder),
        },
      },
    };
});

const  { supabase }  = require('@/lib/supabase');

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    // Provide a simple stub for FontAwesome
    FontAwesome: (props) => <Text {...props} />,
    Feather: (props) => <Text {...props} />,
    // Optionally, add mocks for other icons if you use them:
    // Ionicons: (props) => <Text {...props} />,
    // MaterialIcons: (props) => <Text {...props} />,
  };
});





jest.spyOn(Alert, 'alert');
jest.spyOn(console, 'error').mockImplementation(() => {});



const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
        navigate: mockedNavigate,
        }),
    };
});

//mock for LanguageSelector
jest.mock('@/components/LanguageSelector', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: () => <></>,
    };
});

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

// jest.mock('expo-image-picker', () => {
//   return {
//     launchImageLibraryAsync: jest.fn(() => {
//       // Simulate a successful image selection from the library.
//       return Promise.resolve({
//         cancelled: false,
//         uri: 'file://test-image.jpg',
//       });
//     }),
//     launchCameraAsync: jest.fn(() => {
//       // Simulate a successful image capture.
//       return Promise.resolve({
//         cancelled: false,
//         uri: 'file://test-camera-image.jpg',
//       });
//     }),
//     requestMediaLibraryPermissionsAsync: jest.fn(() => {
//       // Simulate that permissions are granted.
//       return Promise.resolve({ granted: true });
//     }),
//     requestCameraPermissionsAsync: jest.fn(() => {
//       // Simulate that permissions are granted.
//       return Promise.resolve({ granted: true });
//     }),
//   };
// });


  

describe('ProfileScreen', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('user data is fetched and rendered', async () => {

        supabase.auth.getUser.mockResolvedValueOnce({
            data: { 
                user: { 
                    id: 'test-user-id' ,
                    email: 'test-email',
                },
            },
            error: null,
        });

        supabase.from.mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({
                data: {
                    id: 'test-id',
                    name: 'test-name',
                    profile_picture: 'test-picture',
                    date_of_birth: '2001-01-01',
                    gender_id: 'test-gender',
                    country: 'test-country',
                    profile_id: 'test-user-id',
                },
                error: null,
            }),
        });

        const { getByText, getByTestId, getAllByTestId } = render(
            <NavigationContainer>
                <ProfileScreen />
            </NavigationContainer>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
        expect(supabase.from).toHaveBeenCalledWith('profiles');

        expect(getAllByTestId('info-value-container')).toBeTruthy();

    });

    it('error is rendered if user data fetch fails', async () => {

      supabase.auth.getUser.mockResolvedValueOnce({
        data: null,
        error:  { message: 'error' },
      });

      const { getByText, getByTestId } = render(
        <NavigationContainer>
            <ProfileScreen />
        </NavigationContainer>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });


      expect(Alert.alert).toHaveBeenCalledTimes(1);
    });

    it('logout after pressing logout button', async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
          data: { 
              user: { 
                  id: 'test-user-id' ,
                  email: 'test-email',
              },
          },
          error: null,
      });

      supabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
              data: {
                  id: 'test-id',
                  name: 'test-name',
                  profile_picture: 'test-picture',
                  date_of_birth: '2001-01-01',
                  gender_id: 'test-gender',
                  country: 'test-country',
                  profile_id: 'test-user-id',
              },
              error: null,
          }),
      });

      const { getByText, getByTestId, getAllByTestId } = render(
          <NavigationContainer>
              <ProfileScreen />
          </NavigationContainer>
      );

      await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');

      const logoutButton = getByTestId('logout-button');
      fireEvent.press(logoutButton);

      expect(Alert.alert).toHaveBeenCalledTimes(1);


    });
    
    it('upload profile picture', async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
          data: { 
              user: { 
                  id: 'test-user-id' ,
                  email: 'test-email',
              },
          },
          error: null,
      });

      supabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
              data: {
                  id: 'test-id',
                  name: 'test-name',
                  profile_picture: 'test-picture',
                  date_of_birth: '2001-01-01',
                  gender_id: 'test-gender',
                  country: 'test-country',
                  profile_id: 'test-user-id',
              },
              error: null,
          }),
      });

      const { getByText, getByTestId, getAllByTestId } = render(
          <NavigationContainer>
              <ProfileScreen />
          </NavigationContainer>
      );

      await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
      });

      const cameraButton = getByTestId('camera-button');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledTimes(1);
      });


    });

    it('navigate to edit profile screen', async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
          data: { 
              user: { 
                  id: 'test-user-id' ,
                  email: 'test-email',
              },
          },
          error: null,
      });

      supabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
              data: {
                  id: 'test-id',
                  name: 'test-name',
                  profile_picture: 'test-picture',
                  date_of_birth: '2001-01-01',
                  gender_id: 'test-gender',
                  country: 'test-country',
                  profile_id: 'test-user-id',
              },
              error: null,
          }),
      });

      const { getByText, getByTestId, getAllByTestId } = render(
          <NavigationContainer>
              <ProfileScreen />
          </NavigationContainer>
      );

      await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
      });


      const editButton = getByTestId('edit-button');
      fireEvent.press(editButton);

      expect(mockedNavigate).toHaveBeenCalledWith('EditProfile');
    });

    it('Display error if image upload fails', async () => {

      

      supabase.auth.getUser.mockResolvedValueOnce({
          data: { 
              user: { 
                  id: 'test-user-id' ,
                  email: 'test-email',
              },
          },
          error: null,
      });

      supabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
              data: {
                  id: 'test-id',
                  name: 'test-name',
                  profile_picture: 'test-picture',
                  date_of_birth: '2001-01-01',
                  gender_id: 'test-gender',
                  country: 'test-country',
                  profile_id: 'test-user-id',
              },
              error: null,
          }),
      });

      supabase.storage.from.mockReturnValueOnce({
          upload: jest.fn().mockResolvedValueOnce({ error: 'error' }),
      });

      const { getByText, getByTestId, getAllByTestId } = render(
          <NavigationContainer>
              <ProfileScreen />
          </NavigationContainer>
      );

      await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
      });

      const cameraButton = getByTestId('camera-button');
      fireEvent.press(cameraButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledTimes(1);
      });


    });

    

});