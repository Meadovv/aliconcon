import React, { useState } from 'react';
import Layout from '../../components/Layout';

const ProductsPage = () => {
    // Example product data
    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1', price: 10, quantity: 50 },
        { id: 2, name: 'Product 2', price: 20, quantity: 30 },
        { id: 3, name: 'Product 3', price: 15, quantity: 40 },
    ]);

    // Function to delete a product
    const handleDeleteProduct = (productId) => {
        // Deleting product...
    };

    return (
        <Layout>
            <div>
                <h2>Products Management</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete product</button>
                                    {/* Add more actions like edit, view, etc. */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default ProductsPage;
