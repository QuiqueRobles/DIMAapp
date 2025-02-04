// stripe.test.ts

// Import the functions to be tested
import { initializeStripe, createPaymentIntent } from '@/utils/stripe';

// Import the function to be mocked
import { initStripe } from '@stripe/stripe-react-native';

// MOCK: @stripe/stripe-react-native
jest.mock('@stripe/stripe-react-native', () => ({
  initStripe: jest.fn(),
}));

// MOCK: @env
jest.mock('@env', () => ({
  STRIPE_PUBLISHABLE_KEY: 'pk_test_123', // You can set this value as needed
}));

describe('initializeStripe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Stripe correctly', async () => {
    // Set up the initStripe mock to resolve without errors
    (initStripe as jest.Mock).mockResolvedValueOnce(undefined);
    // Spy on console.log to verify the success message
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await initializeStripe();

    expect(initStripe).toHaveBeenCalledWith({
      publishableKey: 'pk_test_123',
      merchantIdentifier: 'acct_1QhVoeE7Fg9wve6S',
      urlScheme: 'your-url-scheme',
    });
    expect(consoleLogSpy).toHaveBeenCalledWith('Stripe initialized successfully');

    consoleLogSpy.mockRestore();
  });

  it('should log an error if initStripe fails', async () => {
    const error = new Error('Test error');
    (initStripe as jest.Mock).mockRejectedValueOnce(error);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await initializeStripe();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to initialize Stripe', error);

    consoleErrorSpy.mockRestore();
  });
});

describe('createPaymentIntent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the clientSecret when fetch is successful', async () => {
    const fakeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ clientSecret: 'cs_test' }),
    };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(fakeResponse as unknown as Response);

    const result = await createPaymentIntent(1000, 'usd');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://hdjxzlniglvsaridyynv.supabase.co/functions/v1/create-payment-intent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000, currency: 'usd' }),
      }
    );
    expect(result).toBe('cs_test');
  });

  it('should throw an error if the fetch response is not ok', async () => {
    const fakeResponse = {
      ok: false,
      json: jest.fn(), // This won't be called if ok is false
    };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(fakeResponse as unknown as Response);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(createPaymentIntent(1000, 'usd')).rejects.toThrow('Network response was not ok');

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should log and rethrow the error if fetch fails', async () => {
    const error = new Error('Fetch error');
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(error);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(createPaymentIntent(1000, 'usd')).rejects.toThrow(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating PaymentIntent:', error);
    consoleErrorSpy.mockRestore();
  });
});
