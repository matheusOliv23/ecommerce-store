import React, { FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';
import { Loader } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function StripePayment({
  priceInCents = 0,
  orderId = '',
  clientSecret = '',
}: {
  priceInCents?: number;
  orderId?: string;
  clientSecret?: string;
}) {
  if (!clientSecret) return null;

  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
}

function StripeForm({
  priceInCents,
  orderId,
}: {
  priceInCents: number;
  orderId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setError(error.message || 'Erro ao processar o pagamento');
      } else {
        setError('Erro desconhecido ao processar o pagamento');
      }
    }

    setIsLoading(false);
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <h2 className='text-xl'>Cartão de crédito</h2>
      {error && <p className='text-destructive'>{error}</p>}
      <PaymentElement />

      <Button
        type='submit'
        className='w-full'
        size='lg'
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <Loader className='animate-spin mr-2 h-4 w-4' />
            Processando...
          </div>
        ) : (
          `Pagar ${formatCurrency(priceInCents / 100)}`
        )}
      </Button>
    </form>
  );
}
