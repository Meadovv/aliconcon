import React from 'react';
import './index.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import { formatPrice, formatNumber } from '../../utils/helpers';

import axios from 'axios';
import api from '../../apis';
import { message } from 'antd';

import { IMAGE_HOST } from '../../apis';

import Error from '../Error';

export default function Product() {
    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const params = useParams();

    const [quantity, setQuantity] = React.useState(1);
    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity === 1) return;
        setQuantity((prev) => prev - 1);
    };

    const getProduct = async (productId) => {
        setLoading(true);
        await axios
            .get(
                api.GET_PRODUCT({
                    id: productId,
                    user: localStorage.getItem('client'),
                }),
            )
            .then((res) => {
                setProduct(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    React.useEffect(() => {
        getProduct(params.productId);
    }, [params]);

    return loading ? (
        <Loader />
    ) : (
        <main className="py-5 bg-whitesmoke">
            <div className="product-single">
                <div className="container">
                    <div className="product-single-content bg-white grid">
                        <div className="product-single-l">
                            <div className="product-img">
                                <div className="product-img-zoom">
                                    <img
                                        src={IMAGE_HOST.ORIGINAL(product?.thumbnail.name)}
                                        alt=""
                                        className="img-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="product-single-r">
                            <div className="product-details font-manrope">
                                <div className="title fs-26 fw-7">
                                    {product?.name}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '14px',
                                            fontWeight: '450'
                                        }}
                                    >
                                        <div>Yêu thích: {formatNumber(product?.likes)}</div>
                                        <div className="vert-line"></div>
                                        <div>Đã bán: {formatNumber(product?.sell_count)}</div>
                                    </div>
                                </div>
                                <div className="info flex align-center flex-wrap fs-14">
                                    {/* <div className="rating">
                                        <span className="text-orange fw-5">Rating:</span>
                                        <span className="mx-1">{product?.rating}</span>
                                    </div>
                                    <div className="vert-line"></div> */}
                                    <div className="brand">
                                        <span className="text-orange fw-5">Category:</span>
                                        <span className="mx-1 text-capitalize">{product?.category.name}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="para fw-3 fs-15">{product?.description}</p>
                                </div>
                                <div className="price">
                                    <div className="flex align-center">
                                        <div
                                            className="old-price text-gray"
                                            style={{
                                                display: product?.sale === 0 ? 'none' : 'block',
                                            }}
                                        >
                                            {formatPrice(product?.price)}
                                        </div>
                                    </div>

                                    <div className="flex align-center my-1">
                                        <div className="new-price fw-5 font-poppins fs-24 text-orange">
                                            {formatPrice(product?.price - (product?.price * product?.sale) / 100)}
                                        </div>
                                        <div className="discount bg-orange fs-13 text-white fw-6 font-poppins">
                                            {product?.sale}% OFF
                                        </div>
                                    </div>
                                </div>

                                <div className="qty flex align-center my-4">
                                    <div className="qty-text">Quantity:</div>
                                    <div className="qty-change flex align-center mx-3">
                                        <button
                                            type="button"
                                            className="qty-decrease flex align-center justify-center"
                                            onClick={() => decreaseQuantity()}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <div className="qty-value flex align-center justify-center">{quantity}</div>
                                        <button
                                            type="button"
                                            className="qty-increase flex align-center justify-center"
                                            onClick={() => increaseQuantity()}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    {product?.stock === 0 ? (
                                        <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                                            out of stock
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>

                                <div className="btns">
                                    <button type="button" className="add-to-cart-btn btn">
                                        <i className="fas fa-shopping-cart"></i>
                                        <span
                                            className="btn-text mx-2"
                                            onClick={() => {
                                                addToCartHandler(product);
                                            }}
                                        >
                                            add to cart
                                        </span>
                                    </button>
                                    <button type="button" className="buy-now btn mx-3">
                                        <span className="btn-text">buy now</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
