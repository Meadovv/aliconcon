import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import './index.scss';

const Product = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div className="product-item bg-white" onClick={() => navigate('/a')} style={{
            cursor: 'pointer'
        }}>
            <div className="category">{product?.category}</div>
            <div className="product-item-img">
                <img className="img-cover" src={product?.images[0]} alt={product.title} />
            </div>
            <div className="product-item-info fs-14">
                <div className="title py-2">{product?.title}</div>
                <div className="price flex align-center justify-center">
                    <span className="old-price">{formatPrice(product?.price)}</span>
                    <span className="new-price">{formatPrice(product?.discountedPrice)}</span>
                    <span className="discount fw-6">({product?.discountedPercentage}% Off)</span>
                </div>
            </div>
        </div>
    );
};

export default Product;
