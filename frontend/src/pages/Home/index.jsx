import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './index.scss';

import Slider from '../../components/Slider/';
import ProductList from '../../components/ProductList';
import Loader from '../../components/Loader';

import { STATUS } from '../../utils/status';
import { getProducts } from '../../reducer/actions/product.slice';

const HomePage = () => {
    const dispatch = useDispatch();
    const { list, status } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getProducts());
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
                                <h3>See our products</h3>
                            </div>
                            {status.list === STATUS.LOADING ? <Loader /> : <ProductList products={list} />}
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
