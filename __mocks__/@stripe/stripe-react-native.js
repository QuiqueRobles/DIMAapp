// __mocks__/@stripe/stripe-react-native.js
export const StripeProvider = ({ children }) => children;
export const useStripe = () => ({
  init: jest.fn(),
  confirmPayment: jest.fn(),
  confirmSetupIntent: jest.fn(),
  createPaymentMethod: jest.fn(),
  handleNextAction: jest.fn(),
  retrievePaymentIntent: jest.fn(),
  retrieveSetupIntent: jest.fn(),
});