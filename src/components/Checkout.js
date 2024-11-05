// src/components/Checkout.js

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0); // Total order amount
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart items from localStorage
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);

    // Fetch user delivery address from Firestore
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setDeliveryAddress(userDoc.data().address);
        }
      }
    };

    fetchUserData();
  }, []);

  const handlePlaceOrder = () => {
    navigate('/payment'); // Redirect to the payment page
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div>
        <h3>Delivery Address:</h3>
        <p>{deliveryAddress}</p>
      </div>
      <h3>Total Amount: ₹{totalAmount}</h3>
      
      <div>
        <h3>Cart Items:</h3>
        {cartItems.map((item, index) => (
          <div key={index}>
            <p>{item.name} - ₹{item.price} x {item.quantity}</p>
          </div>
        ))}
      </div>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}

export default Checkout;
