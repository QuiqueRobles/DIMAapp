import '@testing-library/jest-native/extend-expect';
jest.mock("expo-linear-gradient", () => {
    const MockLinearGradient = ({ children }) => children;
    return { LinearGradient: MockLinearGradient };
  });

  import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
  useRoute: jest.fn(() => ({
    params: {},
  })),
  NavigationContainer: ({ children }) => children,
}));
global.alert = jest.fn()