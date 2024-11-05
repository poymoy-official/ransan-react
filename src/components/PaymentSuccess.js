// src/components/PaymentSuccess.js

import React, { useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const processOrder = async () => {
      try {
        // Fetch cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Fetch user info from Firestore
        const user = auth.currentUser;
        let userEmail = '';
        let userName = '';
        let deliveryAddress = '';
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userEmail = userDoc.data().email;
            userName = userDoc.data().name;
            deliveryAddress = userDoc.data().address;

            // Log to verify email and user info
            console.log(`Customer email: ${userEmail}, Name: ${userName}, Address: ${deliveryAddress}`);
          }
        }

        // Update product quantities in Firestore
        for (const item of cartItems) {
          const productRef = doc(db, 'products', item.id);
          const newQuantity = item.quantityInStock - item.quantity;
          await updateDoc(productRef, {
            quantity: newQuantity >= 0 ? newQuantity : 0,
          });
        }

        // Send confirmation emails
        sendCustomerEmail(userEmail, userName, cartItems, totalAmount, deliveryAddress);
        sendAdminEmail(cartItems, totalAmount, userEmail, deliveryAddress);

        // Clear cart after order is processed
        localStorage.removeItem('cart');

        alert('Order placed successfully!');
        navigate('/'); // Redirect to homepage after order is processed

      } catch (error) {
        console.error('Error processing order:', error);
      }
    };

    processOrder();
  }, [navigate]);

  // Send email to the customer
  const sendCustomerEmail = (email, name, cartItems, totalAmount, deliveryAddress) => {
    if (!email) {
      console.error('Customer email is missing!');
      return;
    }

    const timestamp = new Date().toLocaleString();
    const templateParams = {
      to_email: email,  // This should be the customer's email
      customer_name: name,  // Customer's name for personalized greeting
      order_details: cartItems.map(item => `${item.name} (Qty: ${item.quantity})`).join(', '),
      total_amount: totalAmount,
      timestamp: timestamp,
      delivery_address: deliveryAddress,
    };

    // Log to verify email before sending
    console.log('Sending email to customer with params:', templateParams);

    emailjs.send('service_doxl36j', 'template_vozz7nn', templateParams, 'hPa6DwomUqK9N6LTh')
      .then((response) => {
        console.log('Customer email sent successfully!', response.status, response.text);
      }, (err) => {
        console.error('Failed to send customer email:', err);
      });
  };

  // Send email to the admin
  const sendAdminEmail = (cartItems, totalAmount, customerEmail, deliveryAddress) => {
    const timestamp = new Date().toLocaleString();
    const templateParams = {
      to_email: 'your_admin_email@example.com',  // Your email (admin)
      customer_email: customerEmail,  // Customer's email
      order_details: cartItems.map(item => `${item.name} (Qty: ${item.quantity})`).join(', '),
      total_amount: totalAmount,
      timestamp: timestamp,
      delivery_address: deliveryAddress,
    };

    emailjs.send('service_doxl36j', 'template_pq9pmyg', templateParams, 'hPa6DwomUqK9N6LTh')
      .then((response) => {
        console.log('Admin email sent successfully!', response.status, response.text);
      }, (err) => {
        console.error('Failed to send admin email:', err);
      });
  };

  return (
    <div>
      <h2>Payment Confirmed!</h2>
      <p>Your order is being processed. You will be redirected shortly.</p>
    </div>
  );
}

export default PaymentSuccess;
