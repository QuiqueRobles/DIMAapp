import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OwnerLogin: undefined;
  Home: undefined;
  Map: undefined;
  Tickets: undefined;
  Profile: undefined;
};

export type AppNavigationProp = NavigationProp<RootStackParamList>;
export type AppRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;