import { initStripe } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from '@env';

export const initializeStripe = async () => {
  try {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: 'acct_1QhVoeE7Fg9wve6S',
      urlScheme: 'your-url-scheme',
    });
    console.log('Stripe initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Stripe', error);
  }
};

export const createPaymentIntent = async (amount: number, currency: string) => {
  try {
    const response = await fetch('https://hdjxzlniglvsaridyynv.supabase.co/functions/v1/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    throw error;
  }
};

