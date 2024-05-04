import React from 'react';
import { BsShop } from 'react-icons/bs';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../../apis'
import { message } from 'antd';

import ProductList from '../../components/ProductList';

import { MdOutlineMarkEmailRead, MdRadioButtonChecked, MdPhone } from "react-icons/md";

export default function Shop() {
    const [shop, setShop] = React.useState(null);
    const [products, setProducts] = React.useState(null);
    const [categories, setCategories] = React.useState([]);
    const params = useParams();

    const getShop = async (shopId) => {
        await axios.get(api.GET_SHOP({ shop: shopId }))
        .then(res => {
            setShop(res.data.metadata);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    }

    const getCategory = async (shopId) => {
        await axios.get(api.GET_CATEGORY({ shop: shopId }))
        .then(res => {
            setCategories(res.data.metadata);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    }

    const getProducts = async (shopId) => {
        await axios.get(api.GET_PRODUCTS({ shop: shopId, category: '', low_price: '', high_price: '' }))
        .then(res => {
            setProducts(res.data.metadata);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    }

    React.useEffect(() => {
        getShop(params.shopId);
        getCategory(params.shopId);
        getProducts(params.shopId);
    }, [params])

    return (
        <div className="container my-5">
            <div
                style={{
                    padding: '2rem',
                    backgroundColor: 'whitesmoke',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                    }}
                >
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
                            {shop?.name}
                        </div>
                        <div
                            style={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'gray',
                            }}
                        >
                            ID: {shop?._id}
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        fontSize: '1.2rem',
                    }}>
                        <MdOutlineMarkEmailRead />
                        <span>{shop?.email}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        fontSize: '1.2rem',
                    }}>
                        <MdPhone />
                        <span>{shop?.phone}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        fontSize: '1.2rem',
                    }}>
                        <MdRadioButtonChecked />
                        <span>{shop?.address}</span>
                    </div>
                </div>
            </div>
            <div
                style={{
                    padding: '0.5rem',
                    marginTop: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                {categories && categories.map((category, index) => {
                    return (
                        <div style={{
                            padding: '8px 16px',
                            backgroundColor: '#F94E30',
                            color: 'white',
                            borderRadius: '20px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }} key={index}>
                            {category.name}
                        </div>
                    )
                })}
            </div>
            <div
                style={{
                    padding: '1rem',
                    backgroundColor: 'whitesmoke',
                    marginTop: '1rem',
                }}
            >
                {products && <ProductList products={products} />}
            </div>
        </div>
    );
}
