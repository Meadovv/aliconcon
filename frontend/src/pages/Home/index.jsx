import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './index.scss';

import Slider from '../../components/Slider/';
import ProductList from '../../components/ProductList';
import Loader from '../../components/Loader';

import axios from 'axios';
import api from '../../apis';
import { message } from 'antd';

const HomePage = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const getProducts = async () => {
        setLoading(true);
        await axios.get(api.GET_PRODUCTS({ shop: '', category: '', low_price: '', high_price: '' }))
        .then(res => {
            setProducts(res.data.metadata)
        })
        .catch(err => {
            console.error(err);
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <main>
            <div className="slider-wrapper">
                <Slider />
            </div>
            <div className="main-content bg-whitesmoke">
                <div className="container">
                    <div className="categories py-5">
                        <div className="categories-item">
                            <div className="title-md">
                                <h4>See our products</h4>
                            </div>
                            {loading ? <Loader /> : <ProductList products={products} />}
                        </div>

                        {/* <div className="categories-item">
                            <div className="title-md">
                                <h3>{categories[0]}</h3>
                            </div>
                            {productStatus === STATUS.LOADING ? <Loader /> : <ProductList products={catProductsOne} />}
                        </div>

                        <div className="categories-item">
                            <div className="title-md">
                                <h3>{categories[1]}</h3>
                            </div>
                            {productStatus === STATUS.LOADING ? <Loader /> : <ProductList products={catProductsTwo} />}
                        </div>

                        <div className="categories-item">
                            <div className="title-md">
                                <h3>{categories[2]}</h3>
                            </div>
                            {productStatus === STATUS.LOADING ? (
                                <Loader />
                            ) : (
                                <ProductList products={catProductsThree} />
                            )}
                        </div>

                        <div className="categories-item">
                            <div className="title-md">
                                <h3>{categories[3]}</h3>
                            </div>
                            {productStatus === STATUS.LOADING ? <Loader /> : <ProductList products={catProductsFour} />}
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HomePage;
