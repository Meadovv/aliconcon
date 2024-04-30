import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../../configs';
import { message, Select, Button, InputNumber } from 'antd';
import {
    Container,
    CategoryContainer,
    ProductContainer,
    ImageView,
    InformationContainer,
    MainInformationContainer,
    SubInformationContainer,
    VariationContainer,
} from './style';
import { FaShoppingCart, FaRegHeart, FaHeart  } from "react-icons/fa";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import StarRatings from 'react-star-ratings';
import { useSelector } from 'react-redux';

export default function Product() {
    const [product, setProduct] = React.useState(null);
    const [variantIdx, setVariantIdx] = React.useState([-1]);
    const [variant, setVariant] = React.useState(null);
    const params = useParams();
    const [quantity, setQuantity] = React.useState(0);
    const { user } = useSelector(state => state.user);

    const getProduct = async (productId) => {
        await axios
            .get(CONFIG.API + '/product/get?id=' + productId + '&user=' + user._id)
            .then((res) => {
                setProduct(res.data.metadata);
                setVariantIdx(Array.from({ length: res.data.metadata.variations.length }, () => -1));
            })
            .catch((err) => {
                message.error(err.message);
                console.log(err);
            });
    };

    const getVariant = async () => {
        if (variantIdx.includes(-1)) {
            return null;
        }
        await axios.post(CONFIG.API + '/shop/get-variation', {
            productId: product._id,
            variation_tier_idx: variantIdx,
        }).then(res => {
            setVariant(res.data.metadata);
        }).catch(err => {
            message.error(err.message);
            console.log(err);
        })
    }

    React.useEffect(() => {
        getProduct(params.productId);
    }, [params]);

    React.useEffect(() => {
        getVariant();
    }, [variantIdx])

    const addToCart = async () => {
        console.log(quantity);
    }

    const buyNow = async () => {
        console.log(quantity);
    }

    return (
        product && (
            <Container>
                <CategoryContainer>
                    {`Aliconcon > ${product.category.parent.name} > ${product.shop.name} > ${product.category.name} > ${product.name}`}
                </CategoryContainer>
                <ProductContainer>
                    <div>
                        <ImageView src={product.thumbnail} alt={product.name} />
                    </div>
                    <InformationContainer>
                        <MainInformationContainer>
                            <div
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                {product.name}
                            </div>
                            <div
                                style={{
                                    fontSize: '1rem',
                                    color: 'gray',
                                }}
                            >
                                {product.short_description}
                            </div>
                            <div
                                style={{
                                    fontSize: '1rem',
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                }}
                            >
                                {product.rating.toFixed(1)}
                                <StarRatings
                                    rating={product.rating}
                                    numberOfStars={5}
                                    starDimension="25px"
                                    starSpacing="2px"
                                    starRatedColor="var(--primary-color)"
                                    isSelectable={false}
                                />
                                | {product.sell_count} Đã bán | {product.comment} Lượt đánh giá
                            </div>
                            <div
                                style={{
                                    padding: '10px',
                                    fontSize: '2rem',
                                    color: 'var(--primary-color)',
                                    gap: 10,
                                }}
                            >
                                <span style={{ fontSize: '1rem', verticalAlign: 'super' }}>VNĐ</span>
                                {
                                    variant ? (
                                        variant.price.toLocaleString('vi-VN')
                                    ) : (
                                        product.price.toLocaleString('vi-VN')
                                    )
                                }
                            </div>
                        </MainInformationContainer>
                        <VariationContainer>
                            {product.variations.map((variation, index) => {
                                return (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                    }} key={index}>
                                        <div style={{
                                            minWidth: 100,
                                        }}>{variation.name}</div>
                                        <Select 
                                            style={{
                                                minWidth: 250,
                                            }}
                                            placeholder={`Chọn ${variation.name}`}
                                            options={variation.options.map((value, index) => {
                                                return {
                                                    label: value,
                                                    value: index,
                                                    key: index,
                                                }
                                            })}
                                            onChange={(value) => {
                                                setVariantIdx((prev) => {
                                                    prev[index] = value;
                                                    return [...prev];
                                                });
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </VariationContainer>
                        <SubInformationContainer>
                            <div>Kho: {variant ? variant.quantity : 0}</div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}>
                                <div style={{
                                    minWidth: 100,
                                }}>Số lượng</div>
                                <InputNumber min={0} max={variant ? variant.quantity : 0} value={quantity} onChange={(value) => setQuantity(value)} />
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: 10
                            }}>
                                <Button type='primary' block size='large' icon={<MdOutlineAddShoppingCart />} onClick={addToCart}>Thêm vào giỏ hàng</Button>
                                <Button type='primary' danger block size='large' icon={<FaShoppingCart />} onClick={buyNow}>Mua ngay</Button>
                            </div>
                        </SubInformationContainer>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 10,
                            padding: '5px',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                cursor: 'pointer',
                                fontSize: '1rem',
                                color: product.isLike ? 'var(--primary-color)' : 'black',
                            }}>{product.isLike ? <FaHeart /> : <FaRegHeart />} {`${product.isLike ? 'Đã Thích' : 'Thích'} (${product.likes})`}</div>
                        </div>
                    </InformationContainer>
                </ProductContainer>
            </Container>
        )
    );
}