import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import TicketsScreen from './src/screens/TicketsScreen';
import ProfileScreen from './src/screens/ProfileScreen';


const Tab = createBottomTabNavigator();

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const tabIcons: { [key: string]: keyof typeof Feather.glyphMap } = {
  Home: 'home',
  Map: 'map-pin',
  Tickets: 'bookmark',
  Profile: 'user'
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Tickets" component={TicketsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}