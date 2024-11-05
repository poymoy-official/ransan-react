// src/App.js

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Firebase auth import
import SignUp from './components/SignUp';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Payment from './components/Payment';  // Payment component
import PaymentSuccess from './components/PaymentSuccess';  // PaymentSuccess component

// ProtectedRoute component to enforce authentication
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;  // Redirect to login if no user is authenticated
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);  // State to track the current user

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Set the authenticated user in the state
    });
    return () => unsubscribe();  // Cleanup the auth listener on unmount
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />

      {/* Protected routes that require authentication */}
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <Products />  {/* Product listing available after login */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute user={user}>
            <Cart />  {/* Cart page available after login */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute user={user}>
            <Checkout />  {/* Checkout page available after login */}
          </ProtectedRoute>
        }
      />

      {/* Payment flow routes */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute user={user}>
            <Payment />  {/* Payment page accessible after login */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute user={user}>
            <PaymentSuccess />  {/* Payment success page after payment */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
