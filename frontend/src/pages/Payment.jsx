import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise =
  typeof publishableKey === "string" && publishableKey.length > 0
    ? loadStripe(publishableKey)
    : null;

function Payment() {
  if (!stripePromise) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-400">
        <h1 className="text-xl font-semibold mb-2">Make a Payment</h1>
        <p>
          Stripe is not configured. Add <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> to{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">frontend/.env</code> to enable card payments.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Make a Payment</h1>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
}

export default Payment;
