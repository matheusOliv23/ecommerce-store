import { cn } from '@/lib/utils';
import React from 'react';

export default function CheckoutSteps({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className='flex-between flex-col space-x-2 space-y-2 mb-10 md:flex-row'>
      {[
        'Login do usuário',
        'Endereço',
        'Método de Pagamento',
        'Place order',
      ].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              'p-2 w-56 rounded-full text-center text-sm',
              index === currentStep ? 'bg-secondary' : ''
            )}
          >
            {step}
          </div>
          {step !== 'Place order' && (
            <hr className='w-16 border-t border-gray-300 mx-2' />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
