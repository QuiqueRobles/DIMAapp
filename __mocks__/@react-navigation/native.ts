export const useNavigation = () => ({
  navigate: jest.fn(),
  addListener: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(),
  isFocused: jest.fn(),
});

export const useRoute = () => ({
  params: {},
});