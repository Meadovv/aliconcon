// Product.js
import React from 'react';

const Product = ({ name, price, imageUrl }) => {
  return (
    <div className="product">
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>${price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default Product;

