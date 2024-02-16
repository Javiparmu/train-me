'use server';

import { redirect } from 'next/navigation';
import { auth, stripe } from '@/lib';
import { PlanEnum, getPlanId, getPlanPaymentUrl } from '@/app/utils';
import { headers } from 'next/headers';

export const paymentSession = async (plan: PlanEnum, email?: string): Promise<void> => {
  const trainerEmail = email ?? (await auth())?.trainer.email;

  if (!trainerEmail) {
    redirect(`${headers().get('origin')}/auth/signin`);
  }

  const customer = await stripe.customers.list({ email: trainerEmail });

  if (customer.data.length === 0) {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          quantity: 1,
          price: getPlanId(plan),
        },
      ],
      customer_email: trainerEmail,
      success_url: `${headers().get('origin')}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get('origin')}/checkout/result`,
    });

    redirect(checkoutSession.url ?? getPlanPaymentUrl(plan) + '?prefilled_email=' + trainerEmail);
  }

  const paymentSession = await stripe.billingPortal.sessions.create({
    customer: customer.data[0].id,
    return_url: `${headers().get('origin')}/saas-product`,
  });

  redirect(paymentSession.url);
};
