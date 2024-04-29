import React from 'react';
import "./index.scss";
import Product from "../Product";

const ProductList = ({products}) => {
  return (
    <div className='product-lists grid bg-whitesmoke my-3'>
      {products.map((product, index) => <Product key = {index} product = {product} />)}
    </div>
  )
}

export default ProductList