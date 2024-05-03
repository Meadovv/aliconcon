import React from 'react';
import './index.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import { formatPrice, formatNumber } from '../../utils/helpers';
import { addToCart } from '../../reducer/actions/cart.slice';
import axios from 'axios';
import api from '../../apis';
import { message } from 'antd';

import { IMAGE_HOST } from '../../apis';

import { Select } from '@chakra-ui/react';
import { BsShop } from 'react-icons/bs';

import { useNavigate } from 'react-router-dom';

export default function Product() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [variantTierIdx, setVariantTierIdx] = React.useState([]);
    const [variation, setVariant] = React.useState(null);
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
                setVariantTierIdx(Array.from({ length: res.data.metadata?.variations?.length }, () => 0));
                getVariant({
                    productId: res.data.metadata._id,
                    variation_tier_idx: Array.from({ length: res.data.metadata?.variations?.length }, () => 0),
                });
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    React.useEffect(() => {
        getProduct(params.productId);
        setVariantTierIdx(Array.from({ length: product?.variations?.length }, () => 0));
    }, [params]);

    React.useEffect(() => {
        if (product) {
            if (variantTierIdx.length === product?.variations?.length) {
                getVariant({ productId: product._id, variation_tier_idx: variantTierIdx });
            }
        }
    }, [product, variantTierIdx]);

    const likeSwitch = async (productId) => {};

    const addToCartHandler = async () => {
        if (quantity > variation?.quantity) {
            message.error('Not enough quantity in stock');
            return;
        }
        dispatch(addToCart({ product, variation, quantity }));
        if (user) {
            await axios
                .post(
                    api.ADD_TO_CART,
                    {
                        productId: product._id,
                        variationId: variation._id,
                        quantity: quantity,
                    },
                    {
                        headers: {
                            'x-token-id': localStorage.getItem('token'),
                            'x-client-id': localStorage.getItem('client'),
                        },
                    },
                )
                .then((res) => {
                    message.success(res.data.message);
                })
                .catch((err) => {
                    console.error(err);
                    message.error(err.response.data.message);
                });
        } else {
            message.success('Added to cart');
        }
    };

    const getVariant = async ({ productId, variation_tier_idx }) => {
        if (!product || !variantTierIdx?.length) return;
        await axios
            .post(api.GET_VARIANT, {
                productId: productId,
                variation_tier_idx: variation_tier_idx,
            })
            .then((res) => {
                setVariant(res.data.metadata);
            })
            .catch((err) => {
                console.error(err);
                message.error(err.response.data.message);
            });
    };

    return loading ? (
        <Loader />
    ) : (
        <main className="py-3 bg-whitesmoke">
            <div className="product-single">
                <div className="container">
                    <div className="product-single-content bg-white grid">
                        <div className="product-single-l">
                            <div className="product-img">
                                <div className="product-img-zoom">
                                    <img
                                        src={IMAGE_HOST.ORIGINAL(
                                            variation?.thumbnail
                                                ? variation?.thumbnail?.name
                                                : product?.thumbnail?.name,
                                        )}
                                        alt=""
                                        className="img-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="product-single-r">
                            <div className="product-details font-manrope">
                                <div className="title fs-26 fw-7">
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>{product?.name}</span>
                                        <i
                                            className="fas fa-bookmark"
                                            style={{
                                                color: product?.isLike ? '#ff5e14' : 'black',
                                                fontSize: '20px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => likeSwitch(product._id)}
                                        ></i>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '14px',
                                            fontWeight: '450',
                                        }}
                                    >
                                        <div>Likes: {formatNumber(product?.likes)}</div>
                                        <div className="vert-line"></div>
                                        <div>Sell: {formatNumber(product?.sell_count)}</div>
                                        <div className="vert-line"></div>
                                        <div>Rating: {formatNumber(product?.rating)}</div>
                                    </div>
                                </div>
                                <div className="info flex align-center flex-wrap fs-14">
                                    <div className="brand">
                                        <span className="text-orange fw-5">Category:</span>
                                        <span className="mx-1 text-capitalize">{product?.category.name}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="para fw-3 fs-15">{product?.short_description}</p>
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
                                            {formatPrice(variation?.price - (variation?.price * product?.sale) / 100)}
                                        </div>
                                        <div
                                            className="discount bg-orange fs-13 text-white fw-6 font-poppins"
                                            style={{
                                                display: product?.sale === 0 ? 'none' : 'block',
                                            }}
                                        >
                                            {product?.sale}% OFF
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex-column align-center my-3"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {product?.variations.map((variation, index) => {
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    marginTop: '10px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        marginRight: '10px',
                                                        width: '150px',
                                                    }}
                                                >
                                                    {variation.name}
                                                </div>
                                                <Select
                                                    value={variantTierIdx[index]}
                                                    onChange={(e) => {
                                                        setVariantTierIdx((prev) => {
                                                            const newVariantTierIdx = [...prev];
                                                            newVariantTierIdx[index] = Number(e.target.value);
                                                            return newVariantTierIdx;
                                                        });
                                                    }}
                                                >
                                                    {variation.options.map((tier, idx) => {
                                                        return (
                                                            <option key={idx} value={idx}>
                                                                {tier}
                                                            </option>
                                                        );
                                                    })}
                                                </Select>
                                            </div>
                                        );
                                    })}
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
                                    {variation?.quantity === 0 ? (
                                        <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                                            out of stock
                                        </div>
                                    ) : (
                                        <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                                            {variation?.quantity} in stock
                                        </div>
                                    )}
                                </div>

                                <div className="btns">
                                    <button type="button" className="add-to-cart-btn btn btn-cart">
                                        <i className="fas fa-shopping-cart"></i>
                                        <span
                                            className="btn-text mx-2"
                                            onClick={() => {
                                                addToCartHandler();
                                            }}
                                        >
                                            add to cart
                                        </span>
                                    </button>
                                    <button type="button" className="buy-now btn btn-buy mx-3">
                                        <span className="btn-text">buy now</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container my-3">
                    <div
                        className="product-single-content bg-white"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: '10px',
                                }}
                            >
                                <BsShop size={48} />
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        color: '#F94E30',
                                    }}
                                >
                                    {product?.shop.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: 'gray',
                                    }}
                                >
                                    ID: {product?.shop._id}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button type="button" style={{
                                backgroundColor: '#F94E30',
                                padding: '5px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} onClick={() => navigate(`/shop/${product._id}`)}>
                                <span style={{
                                    color: 'white',
                                    textTransform: 'capitalize',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                }}>view shop</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container my-3">
                    <div
                        className="product-single-content bg-white"
                        style={{
                            display: 'flex',
                        }}
                    >
                        {product?.description}
                    </div>
                </div>

                <div className="container my-3">
                    <div
                        className="product-single-content bg-white"
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div>Comments</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
