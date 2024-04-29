import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatNumber } from '../../utils/helpers';
import './index.scss';

import { IMAGE_HOST } from '../../apis';
import { Button } from '@chakra-ui/react';

import { MdAddShoppingCart, MdRemoveRedEye } from "react-icons/md";

import { addToCart } from '../../reducer/actions/cart.slice';
import { useDispatch } from 'react-redux';

import { message } from 'antd'

const Product = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const newPrice = product?.price - (product?.price * product?.sale) / 100;

    const add = (product) => {
        dispatch(addToCart(product));
        message.success('Add to cart successfully!');
    }

    const preview = (product) => {

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
                    add(product);
                }} colorScheme='red'>Add</Button>
                <Button width={'50%'} leftIcon={<MdRemoveRedEye />} onClick={(e) => {
                    e.stopPropagation();
                    preview(product);
                }} color="red">Preview</Button>
            </div>
            <div className="product-item-sub">
                <div>Đã bán: {formatNumber(product?.sell_count + 2345)}</div>
                <div>Yêu thích: {formatNumber(product?.likes + 3456)}</div>
            </div>
        </div>
    );
};

export default Product;
