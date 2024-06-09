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
                            {loading ? <Loader /> : <ProductList products={products} showFilter/>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HomePage;
