import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // Sample cart items
  const cartItems = [
    { id: 1, name: 'Product 1', price: 10.99, imageUrl: 'https://img.ws.mms.shopee.vn/1234b2a2d4ccbcdc4357c818cf58a1f7' },
    { id: 2, name: 'Product 2', price: 15.99, imageUrl: 'https://tngfashion.vn/image/catalog/2021/menu_nu1.jpg' },
    { id: 3, name: 'Product 3', price: 20.99, imageUrl: 'https://vn-test-11.slatic.net/p/c42c28a5ab1ce64932e33961f4c53347.jpg' }
  ];

  const [isCartOpen, setIsCartOpen] = useState(true);

  const handleBuy = () => {
    // Add functionality for buying items
    console.log('Buying items...');
  };

  const handleCloseCart = () => {
    // Toggle the cart state to close it
    setIsCartOpen(false);
  };

  return (
    <div>
      {isCartOpen && (
        <>
          <h2>Shopping Cart</h2>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <div>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px' }} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/purchase"><button onClick={handleBuy}>Buy</button></Link>
          <button onClick={handleCloseCart}>Close Cart</button> {/* Call handleCloseCart on click */}
        </>
      )}
    </div>
  );
};

export default Cart;
