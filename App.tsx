import { STRIPE_PUBLISHABLE_KEY } from '@env';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './src/lib/supabase';
import { IsOwnerProvider, useSession } from './isOwner';
import { StripeProvider } from '@stripe/stripe-react-native';
import HomeScreen from '@/screens/HomeScreen/HomeScreen';
import MapScreen from '@/screens/MapScreen/MapScreen';
import TicketScreen from './src/screens/TicketsScreen';
import ProfileScreen from '@/screens/ProfileScreen/ProfileScreen';
import LoginScreen from './src/screens/Login/LoginScreen';
import RegisterScreen from '@/screens/Login/registerScreen/index';
import ForgotPasswordScreen from '@/screens/Login/ForgotPassword';
import OwnerLoginScreen from '@/screens/Login/OwnerLogScreen';
import OwnerRegisterScreen from '@/screens/Login/OwnerRegisterScreen';
import ClubScreen from '@/screens/HomeScreen/ClubScreen';
import BuyTicketScreen from '@/screens/BuyTicketScreen';
import CalendarScreen from '@/screens/CalendarScreen';
import ReviewsScreen from '@/screens/ReviewScreen';
import ClubManageScreen from '@/screens/ClubManageScreen';
import EventManageScreen from '@/screens/EventManageScreen';
import HomeOwnerScreen from '@/components/HomeOwnerScreen';
import MapOwnerScreen from '@/screens/MapOwnerScreen';
import EditProfileScreen from '@/screens/ProfileScreen/EditProfileScreen';
import { set } from 'date-fns';
import { ClubProvider } from '@/context/EventContext';
import i18n from './src/i18n';
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
// Suppress warning about defaultProps

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};


const Tab = createBottomTabNavigator();
const Tab2=createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const tabIcons: { [key: string]: keyof typeof Feather.glyphMap } = {
  Home: 'home',
  Map: 'map-pin',
  Tickets: 'bookmark',
  Profile: 'user',
  Events:'calendar'
};

const CustomTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  return (
    <View className="flex-row bg-gray-900 pt-2 pb-6">
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            className={`flex-1 items-center ${isFocused ? 'opacity-100' : 'opacity-50'}`}
          >
            <Feather
              name={tabIcons[route.name]}
              size={24}
              color={isFocused ? '#A78BFA' : '#9CA3AF'}
            />
            <Text className={`text-xs mt-1 ${isFocused ? 'text-purple-400' : 'text-gray-400'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Tickets" component={TicketScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
  
);
const MainTabs_owner = () => (
  <Tab2.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab2.Screen name="Home" component={HomeOwnerScreen} />
    <Tab2.Screen name="Map" component={MapOwnerScreen} />
    <Tab2.Screen name="Events" component={EventManageScreen} />
    <Tab2.Screen name="Profile" component={ClubManageScreen} />
  </Tab2.Navigator>
  
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="OwnerLogin" component={OwnerLoginScreen} />
    <Stack.Screen name="OwnerRegister" component={OwnerRegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {isOwner,setisOwner}=useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const { t } = useTranslation();
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if(session?.user?.id){
        setUserId(session.user.id);
        console.log(session.user.id);
        const { data, error } = await supabase.from('users').select('*').eq('user_id', session.user.id).single();

        //console.log('Query Result:', data);
        //console.log('Query Error:', error);


        if (data) {
          //console.log("isOwner correctly set");
          setisOwner(data?.isClub);
        }else{
          alert(error?.message);
        }

      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    // You can return a loading screen here
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          isOwner ? (
        
           <>
           <Stack.Screen name="MainOwner" component={MainTabs_owner} />
           <Stack.Screen name="HomeOwner" component={HomeOwnerScreen} />
           <Stack.Screen name="MapOwner" component={MapOwnerScreen} />
           <Stack.Screen name="EventsManage" component={EventManageScreen} />
           <Stack.Screen name="ClubManage" component={ClubManageScreen} />
         </>
          ):(
            <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Club" component={ClubScreen} />
            <Stack.Screen name="BuyTicket" component={BuyTicketScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Reviews" component={ReviewsScreen} />
          </>

          )
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </I18nextProvider>
  );
};

export default function App() {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="tu_identificador_de_comerciante" // Necesario para Apple Pay
    >
      <ClubProvider>
        <SessionContextProvider supabaseClient={supabase}>
          <IsOwnerProvider>
            <AppNavigator />
          </IsOwnerProvider>
        </SessionContextProvider>
      </ClubProvider>
    </StripeProvider>
  );
}