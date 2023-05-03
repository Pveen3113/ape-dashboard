import { usePayment, useStripePublishableKey } from "@/queries/payments";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

let loadStripeKey = false;

const Payment = () => {
  const router = useRouter();
  const { data: stripePublishableKey } = useStripePublishableKey();
  const [stripePromise, setStripePromise] =
    useState<PromiseLike<Stripe | null> | null>(null);
  const paymentId = router.query.paymentId as string;
  const { data: payment, isLoading: isLoadingPayments } = usePayment(
    paymentId || ""
  );

  useEffect(() => {
    if (loadStripeKey || !stripePublishableKey) return;
    setStripePromise(loadStripe(stripePublishableKey.publishableKey));
    loadStripeKey = true;
  }, [stripePublishableKey]);

  if (!stripePublishableKey || !payment || !stripePromise)
    return <h1>Error</h1>;
  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: payment.clientSecret }}
      >
        <CheckoutForm />
      </Elements>
    </>
  );
};

export default Payment;
