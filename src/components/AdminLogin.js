// src/components/AdminLogin.js

import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // You can add an additional check to verify if the user is admin
      await signInWithEmailAndPassword(auth, email, password);
      alert('Admin logged in successfully!');
      // Redirect to admin dashboard
    } catch (error) {
      console.error('Error logging in admin:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      <input type="email" placeholder="Admin Email" required onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login as Admin</button>
    </form>
  );
}

export default AdminLogin;
