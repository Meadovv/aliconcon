import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import './index.scss';

import { IMAGE_HOST } from '../../apis';
import { Button } from '@chakra-ui/react';

import { MdAddShoppingCart } from "react-icons/md";

import {
    IconButton
} from '@chakra-ui/react';

const Product = ({ product }) => {
    const navigate = useNavigate();

    const newPrice = product?.price - (product?.price * product?.sale) / 100;

    const addToCart = (productId) => {

    }

    return (
        <div
            className="product-item bg-white"
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
                cursor: 'pointer',
            }}
        >
            <div className="sale" style={{
                display: product?.sale > 0 ? 'block' : 'none',
            }}>
                <span className="discount fw-6">{product?.sale}% Off</span>
            </div>
            <div className="product-item-img">
                <img className="img-cover" src={IMAGE_HOST.THUMBNAIL(product?.thumbnail.name)} alt={product?.name} />
            </div>
            <div className="product-item-info fs-14">
                <div className="title py-2">{product?.name}</div>
                <div className="price flex align-center justify-center">
                    <span
                        className="old-price"
                        style={{
                            display: product?.sale > 0 ? 'block' : 'none',
                        }}
                    >
                        {formatPrice(product?.price)}
                    </span>
                    <span className="new-price">{formatPrice(newPrice)}</span>
                </div>
            </div>
            <div className="product-item-action">
                <Button width={'50%'} leftIcon={<MdAddShoppingCart />} onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product._id);
                }} colorScheme='red'/>
                <Button width={'50%'}>BBB</Button>
            </div>
        </div>
    );
};

export default Product;
