import '@testing-library/jest-native/extend-expect';
jest.mock("expo-linear-gradient", () => {
    const MockLinearGradient = ({ children }) => children;
    return { LinearGradient: MockLinearGradient };
  });