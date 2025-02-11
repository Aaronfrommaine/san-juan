import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key in environment variables');
}

// Initialize Stripe with error handling
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY).catch(err => {
      console.error('Failed to initialize Stripe:', err);
      throw err;
    });
  }
  return stripePromise;
};

interface CreateCheckoutSessionParams {
  package: string;
  price: number;
  seminarId: string;
  userId: string;
}

export async function createCheckoutSession({
  package: packageName,
  price,
  seminarId,
  userId
}: CreateCheckoutSessionParams) {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe failed to initialize');

  return stripe.redirectToCheckout({
    mode: 'payment',
    lineItems: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: packageName,
            description: `Investment Seminar - ${packageName}`,
          },
          unit_amount: price * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/cancel`,
    customer_email: userId,
    client_reference_id: `${seminarId}_${userId}`,
  });
}