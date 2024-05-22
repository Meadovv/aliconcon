import ProductList from "../../components/ProductList";
import Loader from "../../components/Loader";
import React from 'react';

import { useSearchParams } from "react-router-dom";

import axios from "axios";
import api from "../../apis";

import { message } from 'antd'

export default function Search() {

    const [products, setProducts] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    const getProducts = async (key) => {
        setLoading(true);
        await axios.post(api.SEARCH_PRODUCT, {
            key: key
        }, {
            headers: {
                'x-token-id': localStorage.getItem('token'),
                'x-client-id': localStorage.getItem('client'),
            }
        })
        .then(res => {
            setProducts(res.data.data)
        })
        .catch(err => {
            console.error(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    React.useEffect(() => {
        getProducts(searchParams.get('key'));
    }, [searchParams.get('key')])

    return (
        <main>
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
}
