// ProductList.js
import React from 'react';
import Product from './Product';

const ProductList = () => {
    const products = [
      { id: 1, name: 'Product 1', price: 10, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTljFg3WXjWysOHEA1zgrpzqQsMhGdgKYd6ufbyZCIgaQ&s' },
      { id: 2, name: 'Product 2', price: 20, imageUrl: 'https://salt.tikicdn.com/cache/550x550/ts/product/01/35/3e/7d05efdc92a37b3103e18550569757e9.png' },
      { id: 3, name: 'Product 3', price: 30, imageUrl: 'https://www.khosisusa.com/images/stories/virtuemart/product/35-(2)49098598.jpg' },
      // Add more products as needed
    ];

  return (
    <div className="product-list">
      {products.map(product => (
        <Product
          key={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
};

export default ProductList;
