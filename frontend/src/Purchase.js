import React from 'react';

const Purchase = ({ username, cartItems }) => {
  // Calculate the sum of prices
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div>
      <h2>Purchase Page</h2>
      <p>Username: {username}</p>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default Purchase;
