import React from 'react';
import './index.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

import api from '../../apis';
import axios from 'axios';
import { message } from 'antd';

import { increaseQuantity, decreaseQuantity, clearCart, removeFromCart, restoreCart } from '../../reducer/actions/cart.slice';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { itemCount, carts, total } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const toggleCart = async ({ product, variation, type }) => {
        if (!user) return;
        await axios
            .post(
                api.TOGGLE_CART,
                {
                    productId: product._id,
                    variationId: variation._id,
                    type,
                },
                {
                    headers: {
                        'x-token-id': localStorage.getItem('token'),
                        'x-client-id': localStorage.getItem('client'),
                    },
                },
            )
            .then((res) => {
                dispatch(restoreCart({ carts: res.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    };

    const handleIncreaseQuantity = ({ product, variation, itemIdx }) => {
        dispatch(increaseQuantity({ itemIdx }));
        toggleCart({ product, variation, type: true });
    };

    const handleDecreaseQuantity = ({ product, variation, itemIdx }) => {
        dispatch(decreaseQuantity({ itemIdx }));
        toggleCart({ product, variation, type: false });
    };

    const handleCheckout = () => {
        navigate('/checkout');
    }

    const handleDeleteItem = async ({ product, variation }) => {
        dispatch(removeFromCart({ product, variation }));
        if(!user) return;
        await axios
            .post(
                api.REMOVE_FROM_CART,
                {
                    productId: product._id,
                    variationId: variation._id
                },
                {
                    headers: {
                        'x-token-id': localStorage.getItem('token'),
                        'x-client-id': localStorage.getItem('client'),
                    },
                },
            )
            .then((res) => {
                dispatch(restoreCart({ carts: res.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    }

    const handleClearCart = async () => {
        dispatch(clearCart());
        if(!user) return;
        await axios
            .post(api.CLEAR_CART, {}, {
                headers: {
                    'x-token-id': localStorage.getItem('token'),
                    'x-client-id': localStorage.getItem('client'),
                },
            })
            .then((res) => {
                dispatch(restoreCart({ carts: res.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    }

    if (carts.length === 0) {
        return (
            <div className="container my-5">
                <div className="empty-cart flex justify-center align-center flex-column font-manrope">
                    <img src="/images/shopping_cart.png" alt="" />
                    <span className="fw-6 fs-15 text-gray">Your shopping cart is empty.</span>
                    <div onClick={() => navigate('/')} className="shopping-btn bg-orange text-white fw-5">
                        Go shopping Now
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart bg-whitesmoke">
            <div className="container">
                <div className="cart-ctable">
                    <div className="cart-chead bg-white">
                        <div className="cart-ctr fw-6 font-manrope fs-15">
                            <div className="cart-cth">
                                <span className="cart-ctxt">S.N.</span>
                            </div>
                            <div className="cart-cth">
                                <span className="cart-ctxt">Product</span>
                            </div>
                            <div className="cart-cth">
                                <span className="cart-ctxt">Unit Price</span>
                            </div>
                            <div className="cart-cth">
                                <span className="cart-ctxt">Quantity</span>
                            </div>
                            <div className="cart-cth">
                                <span className="cart-ctxt">Total Price</span>
                            </div>
                            <div className="cart-cth">
                                <span className="cart-ctxt">Actions</span>
                            </div>
                        </div>
                    </div>

                    <div className="cart-cbody bg-white">
                        {carts.map((cart, idx) => {
                            const newPrice = cart?.variation.price - (cart?.variation.price * cart?.product.sale) / 100;
                            return (
                                <div className="cart-ctr py-4" key={idx}>
                                    <div className="cart-ctd">
                                        <span className="cart-ctxt">{idx + 1}</span>
                                    </div>
                                    <div
                                        className="cart-ctd"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <span className="cart-ctxt fw-5">{cart?.product.name}</span>
                                        <span
                                            className="cart-ctxt"
                                            style={{
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            {cart?.variation.name}
                                        </span>
                                    </div>
                                    <div
                                        className="cart-ctd"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <span
                                            className="cart-ctxt"
                                            style={{
                                                textDecoration: 'line-through',
                                                display: cart?.product.sale ? 'block' : 'none',
                                            }}
                                        >
                                            {formatPrice(cart?.variation.price)}
                                        </span>
                                        <span
                                            className="cart-ctxt"
                                            style={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            {formatPrice(newPrice)}
                                        </span>
                                    </div>
                                    <div className="cart-ctd">
                                        <div className="qty-change flex align-center">
                                            <button
                                                type="button"
                                                className="qty-decrease flex align-center justify-center"
                                                onClick={() => handleDecreaseQuantity({ ...cart, itemIdx: idx })}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>

                                            <div className="qty-value flex align-center justify-center">
                                                {cart?.quantity}
                                            </div>

                                            <button
                                                type="button"
                                                className="qty-increase flex align-center justify-center"
                                                onClick={() => handleIncreaseQuantity({ ...cart, itemIdx: idx })}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-ctd">
                                        <span className="cart-ctxt text-orange fw-5">
                                            {formatPrice(cart?.variation.price * cart?.quantity)}
                                        </span>
                                    </div>

                                    <div className="cart-ctd">
                                        <button
                                            type="button"
                                            className="delete-btn text-dark"
                                            onClick={() => handleDeleteItem({ product: cart?.product, variation: cart?.variation })}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-cfoot flex align-start justify-between py-3 bg-white">
                        <div className="cart-cfoot-l">
                            <button
                                type="button"
                                className="clear-cart-btn text-danger fs-15 text-uppercase fw-4"
                                onClick={() => handleClearCart()}
                            >
                                <i className="fas fa-trash"></i>
                                <span className="mx-1">Clear Cart</span>
                            </button>
                        </div>

                        <div className="cart-cfoot-r flex flex-column justify-end">
                            <div className="total-txt flex align-center justify-end">
                                <div className="font-manrope fw-5">Total {itemCount} items: </div>
                                <span className="text-orange fs-22 mx-2 fw-6">{formatPrice(total)}</span>
                            </div>

                            <button type="button" className="checkout-btn text-white bg-orange fs-16" onClick={() => handleCheckout()}>
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
