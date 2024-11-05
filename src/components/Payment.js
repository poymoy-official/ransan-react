// src/components/Payment.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a 3-second delay for payment confirmation
    const timer = setTimeout(() => {
      navigate('/payment-success'); // Redirect to the payment success page
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigate]);

  return (
    <div>
      <h2>Processing Payment...</h2>
      <p>Please wait while we confirm your payment.</p>
    </div>
  );
}

export default Payment;
