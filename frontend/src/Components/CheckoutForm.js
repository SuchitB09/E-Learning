import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const CheckoutForm = ({ selectedCourse }) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return; // Stripe.js has not loaded yet

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    // Create payment intent (request to back-end)
    try {
      const response = await fetch("http://localhost:8080/api/payment/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: selectedCourse.price * 100 }), // Stripe needs the amount in cents
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment Successful!");
          // Enroll in the course after successful payment
          enrollCourse(selectedCourse.course_id);
        }
      }
    } catch (error) {
      toast.error("Payment failed, please try again!");
      console.error(error);
      setLoading(false);
    }
  };

  const enrollCourse = (courseId) => {
    // Call API to enroll in course
    console.log("Enrolled in course:", courseId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Pay ₹{selectedCourse.price}</h3>
      <CardElement />
      <button type="submit" disabled={loading || !stripe}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
