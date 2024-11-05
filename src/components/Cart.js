// src/components/Cart.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
  }, []);

  const updateCart = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
  };

  const handleQuantityChange = (item, newQuantity) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
    );
    updateCart(updatedCart);
  };

  const handleRemoveItem = (item) => {
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
    updateCart(updatedCart);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const totalBill = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 && <p>No items in cart.</p>}
      {cartItems.map((item) => (
        <div key={item.id} style={{ border: '1px solid #333', margin: '10px', padding: '10px' }}>
          <h3>{item.name}</h3>
          <p>Price: ₹{item.price}</p>
          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
            />
          </div>
          <button onClick={() => handleRemoveItem(item)}>Remove</button>
        </div>
      ))}
      {cartItems.length > 0 && (
        <>
          <h3>Total Bill: ₹{totalBill}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}

export default Cart;
