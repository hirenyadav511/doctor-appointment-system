import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const res = await fetch(backendUrl + "/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 5000 }) // ₹50
    });

    const data = await res.json();

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) alert(result.error.message);
    else alert("Payment Successful!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}

export default PaymentForm;
